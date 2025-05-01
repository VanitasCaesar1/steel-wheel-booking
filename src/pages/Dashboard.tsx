import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, isToday, parseISO } from "date-fns";
import { Calendar, SearchIcon, FilterIcon, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { authState } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("today");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authState.user) {
        const email = authState.user.email;
        const isAdminUser = email === "user@admin.com" || 
        email?.endsWith("@admin.com") || 
        authState.user?.user_metadata?.role === "admin";
        setIsAdmin(isAdminUser);
      }
    };
    checkAdminStatus();
  }, [authState.user]);

  // Format date for display and comparison
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Load bookings with pagination and filters
  const fetchBookings = async () => {
    if (!authState.user) return;
    
    setLoading(true);
    
    try {
      let query;
      
      // Ensure isAdmin is properly set before making the query
      const email = authState.user.email;
      const isAdminUser = email === "user@admin.com" || 
                        email?.endsWith("@admin.com") || 
                        authState.user?.user_metadata?.role === "admin";
      
      if (isAdminUser) {
        // Admin sees all bookings
        query = supabase
          .from('bookings')
          .select('*', { count: 'exact' });
      } else {
        // Regular user only sees their own bookings
        query = supabase
          .from('bookings')
          .select('*', { count: 'exact' })
          .eq('user_id', authState.user.id);
      }

      // Apply date filter
      if (filterDate === "today") {
        const today = new Date().toISOString().split('T')[0];
        query = query.eq('date', today);
      }

      // Apply status filter if not "all"
      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus);
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Order by date and created_at
      query = query
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true })
        .range(from, to);

      const { data, error, count } = await query;
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / pageSize));
      }
      
      if (error) throw error;
      
      // If we have data and admin user, fetch profiles separately
      if (data && data.length > 0 && isAdminUser) {
        try {
          // Get unique user IDs from bookings
          const userIds = [...new Set(data.map(booking => booking.user_id))] as string[];
          
          // Fetch profiles for these users
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, phone')
            .in('id', userIds);
          
          if (profilesError) throw profilesError;
          
          // Create a lookup map for profiles
          const profilesMap = {};
          if (profilesData) {
            profilesData.forEach(profile => {
              profilesMap[profile.id] = profile;
            });
          }
          
          // Attach profile data to bookings
          const bookingsWithProfiles = data.map(booking => ({
            ...booking,
            profile: profilesMap[booking.user_id] || null
          }));
          
          setBookings(bookingsWithProfiles);
        } catch (profileError) {
          console.error("Error fetching profiles:", profileError);
          // Still show bookings even if profiles can't be fetched
          setBookings(data);
        }
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings when dependencies change
  useEffect(() => {
    if (authState.user && isAdmin !== null) {
      fetchBookings();
    }
  }, [authState.user, isAdmin, currentPage, pageSize, filterStatus, filterDate]);

  // Open status edit dialog
  const handleEditStatus = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsStatusDialogOpen(true);
  };

  // Update booking status
  const updateBookingStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    
    setStatusUpdating(true);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', selectedBooking.id);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      setIsStatusDialogOpen(false);
      
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle page changes
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Filter bookings by search term
  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in various fields
    return (
      (booking.service_title && booking.service_title.toLowerCase().includes(searchLower)) ||
      (booking.vehicle_info && booking.vehicle_info.toLowerCase().includes(searchLower)) ||
      (booking.profile && booking.profile.full_name && booking.profile.full_name.toLowerCase().includes(searchLower)) ||
      (booking.profile && booking.profile.phone && booking.profile.phone.includes(searchTerm))
    );
  });

  // Reset filters
  const resetFilters = () => {
    setFilterStatus("all");
    setFilterDate("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'completed': 
        return 'bg-green-100 text-green-800';
      case 'canceled': 
        return 'bg-red-100 text-red-800';
      case 'confirmed': 
        return 'bg-blue-100 text-blue-800';
      default: 
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your service appointments</p>
          </div>
          {isAdmin && (
            <div className="mt-2 sm:mt-0">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                Admin Access
              </span>
            </div>
          )}
        </div>
        
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription className="mt-1">
                  View and manage all customer bookings
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-2 pl-8 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-full sm:w-auto"
                  />
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="relative"
                >
                  <FilterIcon className="h-4 w-4" />
                  {(filterStatus !== "all" || filterDate !== "all") && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={fetchBookings}
                  aria-label="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Filter Menu */}
          {isFilterMenuOpen && (
            <div className="px-6 py-3 border-t border-b">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="all">All Dates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Show</label>
                  <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
          
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredBookings.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Date & Time</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Vehicle</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(booking => {
                        const isTodays = booking.date && isToday(parseISO(booking.date));
                        
                        return (
                          <tr key={booking.id} className={`border-b hover:bg-gray-50 ${isTodays ? 'bg-blue-50/40' : 'bg-white'}`}>
                            <td className="px-4 py-3 font-medium">{booking.service_title}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  {isTodays && <Calendar className="h-3 w-3 text-blue-500 mr-1" />}
                                  {formatDate(booking.date)}
                                </div>
                                <span className="text-xs text-gray-500">{booking.time_slot}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyle(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {booking.profile ? booking.profile.full_name : 'Unknown'}
                              {booking.profile && booking.profile.phone && (
                                <div className="text-xs text-gray-500">{booking.profile.phone}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {booking.vehicle_info || 'Not specified'}
                            </td>
                            <td className="px-4 py-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditStatus(booking)}
                              >
                                Update Status
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredBookings.map(booking => {
                    const isTodays = booking.date && isToday(parseISO(booking.date));
                    
                    return (
                      <div 
                        key={booking.id} 
                        className={`p-4 rounded-lg border ${isTodays ? 'bg-blue-50/40' : 'bg-white'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{booking.service_title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyle(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <span>{formatDate(booking.date)}</span>
                              <span className="text-gray-500 ml-2">{booking.time_slot}</span>
                            </div>
                          </div>
                          
                          {booking.profile && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 min-w-16">Customer:</span>
                              <div>
                                <div>{booking.profile.full_name}</div>
                                {booking.profile.phone && (
                                  <div className="text-xs text-gray-500">{booking.profile.phone}</div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {booking.vehicle_info && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 min-w-16">Vehicle:</span>
                              <div>{booking.vehicle_info}</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditStatus(booking)}
                            className="w-full"
                          >
                            Update Status
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pagination Controls */}
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => goToPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {/* Desktop Pagination */}
                      <div className="hidden sm:flex">
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const pageNumber = i + 1;
                          
                          // Display first page, last page, and pages around current page
                          if (
                            pageNumber === 1 || 
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink 
                                  onClick={() => goToPage(pageNumber)}
                                  isActive={pageNumber === currentPage}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          // Add ellipsis
                          if (
                            (pageNumber === 2 && currentPage > 3) ||
                            (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                      
                      {/* Mobile Pagination */}
                      <div className="sm:hidden flex items-center mx-2">
                        <span className="text-sm text-gray-500">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">No bookings found</h3>
                <p className="text-yellow-700">
                  {searchTerm ? "Try adjusting your search query" : 
                   (filterStatus !== "all" || filterDate !== "all") ? "Try changing your filters" : 
                   "There are no bookings in the system yet"}
                </p>
                {(searchTerm || filterStatus !== "all" || filterDate !== "all") && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
              <DialogDescription>
                Change the status for {selectedBooking?.service_title} appointment on {selectedBooking?.date && formatDate(selectedBooking.date)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <label className="text-sm font-medium mb-1 block">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Current status: 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadgeStyle(selectedBooking?.status)}`}>
                    {selectedBooking?.status}
                  </span>
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsStatusDialogOpen(false)}
                className="mt-4 sm:mt-0"
              >
                Cancel
              </Button>
              <Button 
                onClick={updateBookingStatus} 
                disabled={statusUpdating || !newStatus || newStatus === selectedBooking?.status}
                className="mt-2 sm:mt-0"
              >
                {statusUpdating ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
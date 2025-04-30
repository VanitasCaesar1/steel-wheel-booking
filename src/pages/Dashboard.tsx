import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Calendar, Clock, Car, Phone, User, Filter } from "lucide-react";

// Define the Booking type based on the SQL schema
interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  service_title: string;
  date: string;
  time_slot: string;
  vehicle_info: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Include profile information when joined
  profiles?: {
    full_name: string | null;
    phone: string | null;
  };
}

const Dashboard = () => {
  const currentDate = new Date();
  const { authState, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogAction, setDialogAction] = useState<"confirm" | "cancel" | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authState.user) {
        // Example admin check - modify according to your admin designation method
        const email = authState.user.email;
        setIsAdmin(
          email?.endsWith("@admin.com") ||
          authState.user.user_metadata?.role === "admin"
        );
      }
    };
    checkAdminStatus();
  }, [authState.user]);

  // Handle mobile responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!authState.user) return;
      try {
        let query;
        if (isAdmin) {
          // Admin sees all bookings with profile information
          query = supabase
            .from('bookings')
            .select(`
              *,
              profiles(full_name, phone)
            `);
        } else {
          // Regular user only sees their own bookings
          query = supabase
            .from('bookings')
            .select('*')
            .eq('user_id', authState.user.id);
        }

        // Apply status filter if not "all"
        if (statusFilter !== "all") {
          query = query.eq('status', statusFilter);
        }

        // Order by date and created_at
        query = query.order('date', { ascending: false })
          .order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authState.user, isAdmin, statusFilter]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Update booking in local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus, updated_at: new Date().toISOString() }
            : booking
        )
      );

      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const openActionDialog = (booking: Booking, action: "confirm" | "cancel") => {
    setSelectedBooking(booking);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-500 font-medium whitespace-nowrap text-xs">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-500 font-medium whitespace-nowrap text-xs">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirmed
            </span>
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 font-medium whitespace-nowrap text-xs">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending
            </span>
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500 font-medium whitespace-nowrap text-xs">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelled
            </span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 font-medium whitespace-nowrap text-xs">{status}</Badge>
        );
    }
  };

  // Mobile card view for bookings
  const renderMobileBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="mb-4 border border-gray-200 shadow-sm overflow-hidden">
      <div className={`px-4 py-2 ${booking.status.toLowerCase() === 'completed' ? 'bg-green-50' : 
                                  booking.status.toLowerCase() === 'confirmed' ? 'bg-blue-50' : 
                                  booking.status.toLowerCase() === 'pending' ? 'bg-yellow-50' : 
                                  booking.status.toLowerCase() === 'cancelled' ? 'bg-red-50' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{booking.service_title}</h3>
          {getStatusBadge(booking.status)}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{format(new Date(booking.date), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{booking.time_slot}</span>
          </div>
          
          {isAdmin && (
            <>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span>{booking.profiles?.full_name || "Unknown"}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{booking.profiles?.phone || "No phone"}</span>
              </div>
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-2 text-gray-500" />
                <span>{booking.vehicle_info || "Not provided"}</span>
              </div>
            </>
          )}
          
          {isAdmin && booking.status === "pending" && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full text-xs"
                onClick={() => openActionDialog(booking, "confirm")}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 w-full text-xs"
                onClick={() => openActionDialog(booking, "cancel")}
              >
                Cancel
              </Button>
            </div>
          )}
          
          {isAdmin && booking.status === "confirmed" && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white w-full text-xs"
                onClick={() => handleStatusUpdate(booking.id, "completed")}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 w-full text-xs"
                onClick={() => openActionDialog(booking, "cancel")}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Desktop table view
  const renderDesktopTable = () => (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 bg-gray-50">
            {isAdmin && <TableHead className="text-left py-3 text-xs font-semibold">Customer</TableHead>}
            {isAdmin && <TableHead className="text-left py-3 text-xs font-semibold">Contact</TableHead>}
            <TableHead className="text-left py-3 text-xs font-semibold">Service</TableHead>
            <TableHead className="text-left py-3 text-xs font-semibold">Date</TableHead>
            <TableHead className="text-left py-3 text-xs font-semibold">Time</TableHead>
            {isAdmin && <TableHead className="text-left py-3 text-xs font-semibold">Vehicle</TableHead>}
            <TableHead className="text-left py-3 text-xs font-semibold">Status</TableHead>
            {isAdmin && <TableHead className="text-right py-3 text-xs font-semibold">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking, index) => (
            <TableRow
              key={booking.id}
              className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              {isAdmin && (
                <TableCell className="text-sm py-3">
                  {booking.profiles?.full_name || "Unknown"}
                </TableCell>
              )}
              {isAdmin && (
                <TableCell className="text-sm py-3">{booking.profiles?.phone || "No phone"}</TableCell>
              )}
              <TableCell className="text-sm py-3 font-medium">{booking.service_title}</TableCell>
              <TableCell className="text-sm py-3">{format(new Date(booking.date), "MM/dd/yyyy")}</TableCell>
              <TableCell className="text-sm py-3">{booking.time_slot}</TableCell>
              {isAdmin && (
                <TableCell className="text-sm py-3">{booking.vehicle_info || "Not provided"}</TableCell>
              )}
              <TableCell className="py-3">{getStatusBadge(booking.status)}</TableCell>
              {isAdmin && (
                <TableCell className="text-right py-3">
                  {booking.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => openActionDialog(booking, "confirm")}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
                        onClick={() => openActionDialog(booking, "cancel")}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {booking.status === "confirmed" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        onClick={() => handleStatusUpdate(booking.id, "completed")}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
                        onClick={() => openActionDialog(booking, "cancel")}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Summary cards rendering
  const renderStatusSummary = () => {
    const statusCounts = {
      all: bookings.length,
      pending: bookings.filter(b => b.status.toLowerCase() === 'pending').length,
      confirmed: bookings.filter(b => b.status.toLowerCase() === 'confirmed').length,
      completed: bookings.filter(b => b.status.toLowerCase() === 'completed').length,
      cancelled: bookings.filter(b => b.status.toLowerCase() === 'cancelled').length
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-600">Total</div>
              <div className="text-lg font-bold">{statusCounts.all}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-yellow-700">Pending</div>
              <div className="text-lg font-bold text-yellow-800">{statusCounts.pending}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-blue-700">Confirmed</div>
              <div className="text-lg font-bold text-blue-800">{statusCounts.confirmed}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-green-700">Completed</div>
              <div className="text-lg font-bold text-green-800">{statusCounts.completed}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container px-4 sm:px-6 mx-auto py-8">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-lg rounded-lg mt-16">
          {/* Header section */}
          <div className="bg-gray-900 text-white py-4 px-4 sm:px-6 sm:py-6 rounded-t-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {isAdmin ? "ADMIN DASHBOARD" : "Service History"}
                </h1>
                <div className="text-xs text-gray-300 mt-1">CKB Layout, Bengaluru</div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-sm">Welcome,</div>
                <div className="font-bold">{authState.user?.user_metadata?.full_name || "User"}{isAdmin && " (Admin)"}</div>
                <div className="text-xs text-gray-300 mt-1">{format(currentDate, "MMM dd, yyyy • hh:mm a")}</div>
              </div>
            </div>
          </div>
          
          {/* Filter section */}
          {isAdmin && (
            <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto order-2 sm:order-1">
                  <div className="text-sm text-gray-500">
                    <span>System ID: </span>
                    <span className="font-medium">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                  </div>
                </div>
                <div className="w-full sm:w-auto order-1 sm:order-2">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-40 text-sm h-9">
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Main content */}
          <div className="p-4 sm:p-6">
            {/* Admin status summary cards */}
            {isAdmin && renderStatusSummary()}
            
            {/* Bookings section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  {isAdmin ? "All Bookings" : "Your Bookings"}
                </h2>
              </div>
              
              {loading ? (
                <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <div className="text-gray-500 animate-pulse">Loading bookings...</div>
                  <div className="mt-2 text-xs text-gray-400">Please wait</div>
                </div>
              ) : bookings.length > 0 ? (
                <>
                  {/* Mobile view - cards */}
                  {isMobile ? (
                    <div className="space-y-4">
                      {bookings.map(booking => renderMobileBookingCard(booking))}
                    </div>
                  ) : (
                    /* Desktop view - table */
                    renderDesktopTable()
                  )}
                </>
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-gray-600 mb-4">
                    {isAdmin
                      ? "No bookings match the selected filter"
                      : "You don't have any bookings yet"}
                  </p>
                  {!isAdmin && (
                    <Button
                      onClick={() => navigate("/#booking")}
                      className="bg-gray-800 hover:bg-gray-900"
                    >
                      Book a Service
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50 text-center rounded-b-lg">
            <p className="text-sm font-bold mb-1">THANK YOU FOR YOUR BUSINESS!</p>
            <p className="text-xs text-gray-500">Generated on {format(currentDate, "MM/dd/yyyy hh:mm a")}</p>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border border-gray-300 max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === "confirm"
                ? "Confirm Booking"
                : "Cancel Booking"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "confirm"
                ? "Are you sure you want to confirm this booking? This will notify the customer."
                : "Are you sure you want to cancel this booking? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">No, Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedBooking && dialogAction) {
                  const newStatus = dialogAction === "confirm" ? "confirmed" : "cancelled";
                  handleStatusUpdate(selectedBooking.id, newStatus);
                }
              }}
              className={`w-full sm:w-auto ${dialogAction === "confirm" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {dialogAction === "confirm" ? "Yes, Confirm" : "Yes, Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
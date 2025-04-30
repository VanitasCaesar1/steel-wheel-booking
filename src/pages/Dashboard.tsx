import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authState.user) {
        // Example admin check - modify according to your admin designation method
        // This could be based on a specific email domain, user metadata, or a separate admins table
        const email = authState.user.email;
        setIsAdmin(
          email?.endsWith("@admin.com") || 
          authState.user.user_metadata?.role === "admin"
        );
      }
    };
    
    checkAdminStatus();
  }, [authState.user]);

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
          <div className="flex items-center">
            <Badge className="bg-green-500 font-mono text-xs font-bold uppercase">Completed</Badge>
            <svg className="ml-1 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex items-center">
            <Badge className="bg-blue-500 font-mono text-xs font-bold uppercase">Confirmed</Badge>
            <svg className="ml-1 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center">
            <Badge className="bg-yellow-500 font-mono text-xs font-bold uppercase">Pending</Badge>
            <svg className="ml-1 h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center">
            <Badge className="bg-red-500 font-mono text-xs font-bold uppercase">Cancelled</Badge>
            <svg className="ml-1 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Badge className="bg-gray-500 font-mono text-xs font-bold uppercase">{status}</Badge>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8">
        {/* Receipt-style container */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-lg mt-16" style={{transform: "rotate(0deg)", transformOrigin: "center"}}>
          {/* Store logo/header section */}
          <div className="bg-gray-900 text-white py-6 px-8 text-center">
            <h1 className="text-3xl font-bold font-mono tracking-tight">
              {isAdmin ? "ADMIN DASHBOARD" : "SERVICE CENTER"}
            </h1>
            <div className="text-sm font-mono mt-1 text-gray-300">123 Main Street, Anytown USA</div>
            <div className="text-sm font-mono text-gray-300">Tel: (555) 123-4567</div>
          </div>
          
          {/* Receipt header */}
          <div className="bg-gray-50 border-b border-dashed border-gray-300 py-4 px-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-mono text-lg font-bold mb-1">
                  {isAdmin ? "BOOKING MANAGEMENT" : "SERVICE RECEIPT"}
                </div>
                <div className="font-mono text-sm text-gray-600 flex items-center">
                  <span className="mr-2">Date:</span>
                  <span className="font-bold">{format(currentDate, "MM/dd/yyyy")}</span>
                  <span className="mx-2">•</span>
                  <span className="mr-2">Time:</span>
                  <span className="font-bold">{format(currentDate, "hh:mm a")}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm">Welcome,</div>
                <div className="font-mono font-bold">{authState.user?.user_metadata?.full_name || "User"}{isAdmin && " (Admin)"}</div>
                <div className="font-mono text-xs text-gray-500">ID: #{authState.user?.id?.substring(0, 8) || "00000000"}</div>
              </div>
            </div>
          </div>
          
          {/* Main receipt content */}
          <div className="p-6 lg:p-8 bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y1ZjVmNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-opacity-30">
            {/* Filter bar for admin */}
            {isAdmin && (
              <div className="mb-6 pb-4 border-b border-dashed border-gray-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="mb-3 sm:mb-0">
                    <div className="font-mono text-xs text-gray-500 mb-1">Receipt #: {Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</div>
                    <div className="font-mono text-xs text-gray-500">Clerk: {authState.user?.email?.split('@')[0] || "admin"}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 font-mono mr-2">Filter by status:</span>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[180px] font-mono text-sm bg-white border-gray-300">
                        <SelectValue placeholder="Select status" />
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
            )}
            
            {/* Bookings section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
                <h2 className="text-xl font-bold font-mono tracking-tight uppercase">
                  {isAdmin ? "ALL BOOKINGS" : "YOUR BOOKINGS"}
                </h2>
                <div className="font-mono text-sm text-gray-500 px-2 py-1 border border-gray-300 rounded">
                  {isAdmin ? "CUSTOMER RECORDS" : "SERVICE RECORDS"}
                </div>
              </div>
              
              {loading ? (
                <div className="py-12 text-center">
                  <div className="font-mono text-gray-500 animate-pulse">Processing bookings...</div>
                  <div className="mt-2 font-mono text-xs text-gray-400">Please wait while we retrieve your records</div>
                </div>
              ) : bookings.length > 0 ? (
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-sm shadow">
                  <Table className="w-full border-collapse">
                    <TableHeader>
                      <TableRow className="border-b-2 border-black bg-gray-50">
                        {isAdmin && <TableHead className="text-left font-mono text-sm font-bold py-3">Customer</TableHead>}
                        {isAdmin && <TableHead className="text-left font-mono text-sm font-bold py-3">Contact</TableHead>}
                        <TableHead className="text-left font-mono text-sm font-bold py-3">Service</TableHead>
                        <TableHead className="text-left font-mono text-sm font-bold py-3">Date</TableHead>
                        <TableHead className="text-left font-mono text-sm font-bold py-3">Time</TableHead>
                        {isAdmin && <TableHead className="text-left font-mono text-sm font-bold py-3">Vehicle</TableHead>}
                        <TableHead className="text-left font-mono text-sm font-bold py-3">Status</TableHead>
                        {isAdmin && <TableHead className="text-right font-mono text-sm font-bold py-3">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking, index) => (
                        <TableRow 
                          key={booking.id} 
                          className={`border-b border-dotted border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          {isAdmin && (
                            <TableCell className="font-mono text-sm py-3">
                              {booking.profiles?.full_name || "Unknown"}
                            </TableCell>
                          )}
                          {isAdmin && (
                            <TableCell className="font-mono text-sm py-3">{booking.profiles?.phone || "No phone"}</TableCell>
                          )}
                          <TableCell className="font-mono text-sm py-3 font-medium">{booking.service_title}</TableCell>
                          <TableCell className="font-mono text-sm py-3">{format(new Date(booking.date), "MM/dd/yyyy")}</TableCell>
                          <TableCell className="font-mono text-sm py-3">{booking.time_slot}</TableCell>
                          {isAdmin && (
                            <TableCell className="font-mono text-sm py-3">{booking.vehicle_info || "Not provided"}</TableCell>
                          )}
                          <TableCell className="py-3">{getStatusBadge(booking.status)}</TableCell>
                          {isAdmin && (
                            <TableCell className="text-right py-3">
                              {booking.status === "pending" && (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="font-mono text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                                    onClick={() => openActionDialog(booking, "confirm")}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="font-mono text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
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
                                    variant="outline"
                                    className="font-mono text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                    onClick={() => handleStatusUpdate(booking.id, "completed")}
                                  >
                                    Mark Complete
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="font-mono text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
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
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <p className="font-mono text-gray-600 mb-4">
                    {isAdmin 
                      ? "No bookings match the selected filter" 
                      : "You don't have any bookings yet"}
                  </p>
                  {!isAdmin && (
                    <Button 
                      onClick={() => navigate("/#booking")}
                      className="font-mono bg-gray-800 hover:bg-gray-900"
                    >
                      Book a Service
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Summary section for larger receipts */}
            {bookings.length > 0 && (
              <div className="mt-8 mb-6 pt-4 border-t-2 border-black">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="font-mono text-sm font-bold mb-2">SUMMARY</div>
                    <div className="font-mono text-xs">
                      <div className="flex items-center mb-1">
                        <div className="w-24">Total Bookings:</div>
                        <div className="font-bold">{bookings.length}</div>
                      </div>
                      {isAdmin && (
                        <>
                          <div className="flex items-center mb-1">
                            <div className="w-24">Pending:</div>
                            <div className="font-bold">{bookings.filter(b => b.status.toLowerCase() === 'pending').length}</div>
                          </div>
                          <div className="flex items-center mb-1">
                            <div className="w-24">Confirmed:</div>
                            <div className="font-bold">{bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}</div>
                          </div>
                          <div className="flex items-center mb-1">
                            <div className="w-24">Completed:</div>
                            <div className="font-bold">{bookings.filter(b => b.status.toLowerCase() === 'completed').length}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-24">Cancelled:</div>
                            <div className="font-bold">{bookings.filter(b => b.status.toLowerCase() === 'cancelled').length}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-right">
                    <div className="font-mono text-xs text-gray-500 mb-1">Generated on</div>
                    <div className="font-mono text-sm font-bold">{format(currentDate, "MM/dd/yyyy hh:mm:ss a")}</div>
                    <div className="font-mono text-xs text-gray-500 mt-4 mb-1">System ID</div>
                    <div className="font-mono text-sm">{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Receipt footer */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-300 text-center">
              <p className="font-mono text-sm font-bold">THANK YOU FOR YOUR BUSINESS!</p>
              <p className="font-mono text-xs text-gray-500 mt-1">Please retain this receipt for your records</p>
              <div className="mt-4 mb-2">
                <svg className="mx-auto h-8 text-gray-400" viewBox="0 0 100 20" fill="currentColor">
                </svg>
              </div>
            </div>
          </div>
          
          {/* Receipt tear - more pronounced and realistic */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-white"></div>
            <svg width="100%" height="20" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,0 L2,5 L4,0 L6,5 L8,0 L10,5 L12,0 L14,5 L16,0 L18,5 L20,0 L22,5 L24,0 L26,5 L28,0 L30,5 L32,0 L34,5 L36,0 L38,5 L40,0 L42,5 L44,0 L46,5 L48,0 L50,5 L52,0 L54,5 L56,0 L58,5 L60,0 L62,5 L64,0 L66,5 L68,0 L70,5 L72,0 L74,5 L76,0 L78,5 L80,0 L82,5 L84,0 L86,5 L88,0 L90,5 L92,0 L94,5 L96,0 L98,5 L100,0 L100,10 L0,10 Z" fill="#f3f4f6" />
            </svg>
            <div className="h-2 bg-gray-100"></div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="font-mono border border-gray-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">
              {dialogAction === "confirm" 
                ? "Confirm Booking" 
                : "Cancel Booking"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono">
              {dialogAction === "confirm"
                ? "Are you sure you want to confirm this booking? This will notify the customer."
                : "Are you sure you want to cancel this booking? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedBooking && dialogAction) {
                  const newStatus = dialogAction === "confirm" ? "confirmed" : "cancelled";
                  handleStatusUpdate(selectedBooking.id, newStatus);
                }
              }}
              className={`font-mono ${dialogAction === "confirm" ? "bg-blue-600" : "bg-red-600"}`}
            >
              {dialogAction === "confirm" ? "Confirm" : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;

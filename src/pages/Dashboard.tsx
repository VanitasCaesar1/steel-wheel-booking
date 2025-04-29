
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings } from "@/services/bookingService";
import { Booking } from "@/types/bookingTypes";
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

const Dashboard = () => {
  const { authState, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadBookings = async () => {
      if (authState.user) {
        const userBookings = await getUserBookings();
        setBookings(userBookings);
        setLoading(false);
      }
    };
    
    loadBookings();
  }, [authState.user]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container px-4 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-slate-600">
              Welcome back, {authState.user?.user_metadata?.full_name || "User"}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>View and manage your service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading your bookings...</p>
            ) : bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.service_title}</TableCell>
                      <TableCell>{format(new Date(booking.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{booking.time_slot}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">You don't have any bookings yet.</p>
                <Button onClick={() => navigate("/#booking")}>Book a Service</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

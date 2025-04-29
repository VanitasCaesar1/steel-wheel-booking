
import { supabase } from "@/integrations/supabase/client";
import type { Booking, BookingFormData } from "@/types/bookingTypes";
import { toast } from "sonner";

export const submitBooking = async (bookingData: BookingFormData) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast("Please log in to book a service");
      return null;
    }
    
    if (!bookingData.date || !bookingData.timeSlot || !bookingData.serviceId) {
      toast("Please fill in all required fields");
      return null;
    }
    
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.user.id,
        service_id: bookingData.serviceId,
        service_title: getServiceTitle(bookingData.serviceId),
        date: bookingData.date.toISOString().split('T')[0],
        time_slot: bookingData.timeSlot,
        vehicle_info: bookingData.vehicleInfo,
        status: "pending"
      })
      .select()
      .single();
      
    if (error) {
      toast(error.message);
      console.error("Error submitting booking:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in submitBooking:", error);
    return null;
  }
};

export const getServiceTitle = (serviceId: string): string => {
  const serviceIdNumber = parseInt(serviceId);
  const service = services.find(service => service.id === serviceIdNumber);
  return service ? service.title : "Unknown Service";
};

// Importing the services from lib/data.ts to avoid circular dependencies
import { services } from "@/lib/data";

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.user.id)
      .order("date", { ascending: false });
      
    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    return [];
  }
};

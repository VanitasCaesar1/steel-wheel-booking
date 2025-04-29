
import { Database } from "@/integrations/supabase/types";

// Use the auto-generated types from Supabase
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

// Custom types for the booking form
export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  date: Date | undefined;
  timeSlot: string | null;
  vehicleInfo: string;
}

export interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
}

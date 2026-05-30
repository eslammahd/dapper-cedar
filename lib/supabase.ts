import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Slot = {
  id: string;
  date: string;
  time: string;
  duration: number;
  is_available: boolean;
};

export type Booking = {
  id: string;
  slot_id: string;
  patient_name: string;
  phone: string;
  session_type: string;
  notes: string | null;
  status: string;
  created_at: string;
};

export type BookingWithSlot = Booking & {
  slots: Slot;
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface Donor {
  donor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  blood_group: string;
  date_of_birth: string;
  gender: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  last_donation_date?: string;
  total_donations: number;
  is_eligible: boolean;
  registered_date: string;
  created_at: string;
}

export interface Hospital {
  hospital_id: number;
  hospital_name: string;
  hospital_type: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  license_number: string;
  is_active: boolean;
  registered_date: string;
  created_at: string;
}

export interface BloodStock {
  stock_id: number;
  blood_group: string;
  quantity_ml: number;
  units_available: number;
  minimum_threshold: number;
  last_updated: string;
  updated_by?: number;
}

export interface Donation {
  donation_id: number;
  donor_id: number;
  donation_date: string;
  blood_group: string;
  quantity_ml: number;
  hemoglobin_level?: number;
  blood_pressure?: string;
  donation_status: string;
  staff_id?: number;
  remarks?: string;
  created_at: string;
}

export interface Request {
  request_id: number;
  hospital_id: number;
  blood_group: string;
  units_requested: number;
  units_fulfilled: number;
  request_date: string;
  required_by_date: string;
  urgency_level: string;
  request_status: string;
  approved_by?: number;
  approval_date?: string;
  remarks?: string;
  created_at: string;
}

export interface Transfusion {
  transfusion_id: number;
  request_id: number;
  hospital_id: number;
  blood_group: string;
  units_transfused: number;
  quantity_ml: number;
  transfusion_date: string;
  patient_name?: string;
  patient_age?: number;
  staff_id?: number;
  remarks?: string;
  created_at: string;
}

export interface Staff {
  staff_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  hire_date: string;
  is_active: boolean;
  created_at: string;
}

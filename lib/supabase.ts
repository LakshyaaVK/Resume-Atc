import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client with fallback values for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we're using placeholder values
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';
};

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  id?: string;
  user_id: string;
  job_description: string;
  resume_text: string;
  overall_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills_analysis: {
    score: number;
    details: string;
  };
  experience_analysis: {
    score: number;
    details: string;
  };
  education_analysis: {
    score: number;
    details: string;
  };
  weights: {
    skills: number;
    experience: number;
    education: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

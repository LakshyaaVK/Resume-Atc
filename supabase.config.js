// Supabase Configuration
// Copy this file to .env.local and add your actual Supabase credentials

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'your_supabase_project_url',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key'
};

// Instructions:
// 1. Create a new project at https://supabase.com
// 2. Go to Settings > API
// 3. Copy your Project URL and anon/public key
// 4. Create a .env.local file with:
//    VITE_SUPABASE_URL=your_actual_project_url
//    VITE_SUPABASE_ANON_KEY=your_actual_anon_key

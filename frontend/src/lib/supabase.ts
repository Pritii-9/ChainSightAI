import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const IS_DEMO_MODE = supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder';

if (IS_DEMO_MODE) {
  console.warn('Supabase credentials missing. App will run in degraded/demo mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from '@supabase/supabase-js';

// Use default values for development to prevent the app from crashing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWp2cHN1a3BxeG50dm5veXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA5ODg2MDUsImV4cCI6MjAwNjU2NDYwNX0.dummy-key';

// Create Supabase client with non-throwing configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Log a warning if using default values
if (supabaseUrl === 'https://example.supabase.co') {
  console.warn('Using default Supabase URL. Please set VITE_SUPABASE_URL in your environment variables for production.');
}


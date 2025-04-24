
import { createClient } from '@supabase/supabase-js';

// For development purposes - in production these would come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eulrvmjguqhnevglosjs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bHJ2bWpndXFobmV2Z2xvc2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYzODEsImV4cCI6MjA2MTAzMjM4MX0.86XTY8Nqkv-TIwofdbjFeFKuOqqWchyeglR22_KlmMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

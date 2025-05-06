
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://eemaqmcwhimxuggkraoc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbWFxbWN3aGlteHVnZ2tyYW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzkyMjEsImV4cCI6MjA2MTUxNTIyMX0.EAsmsV6K2LKkn13qsF03chaZAZpGYkO4P6ZshQ3zMr0";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
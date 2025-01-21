import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Add console logging for debugging
console.log('Initializing Supabase client...');
console.log('VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cetahbdawfhiohrsadlc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldGFoYmRhd2ZoaW9ocnNhZGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMzU4NjYsImV4cCI6MjA1MjcxMTg2Nn0.t8qvXldZyew5bRcwjn0syziWy6oN-RqbgdzO5hKruyo';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Supabase key length:', supabaseKey?.length);

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce',
    debug: true // Enable debug mode for auth
  }
});

// Test the connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, 'Session:', session ? 'exists' : 'null');
});

// Test the database connection
supabase
  .from('profiles')
  .select('count')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Database connection test failed:', error);
    } else {
      console.log('Database connection test successful');
    }
  });

export type { User } from '@supabase/supabase-js';
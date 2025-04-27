import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL is required');
if (!supabaseAnonKey) throw new Error('VITE_SUPABASE_ANON_KEY is required');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage // Explicitly set storage to ensure persistence
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any stored auth data on sign out
    localStorage.removeItem('sb-' + supabaseUrl + '-auth-token');
  }
});

// Test the connection
supabase.from('products').select('count', { count: 'exact', head: true })
  .then(() => {
    console.log('Successfully connected to Supabase');
  })
  .catch((error) => {
    console.error('Failed to connect to Supabase:', error.message);
  });
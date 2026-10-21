import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://wnnkbsrhikicocfrfpmt.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indubmtic3JoaWtpY29jZnJmcG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzOTA3MDYsImV4cCI6MjEwNzk2NjcwNn0.jD9-SaN7lyxsBGgYEe6l-F8QdCYHUsGuAk8c29CbLaw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

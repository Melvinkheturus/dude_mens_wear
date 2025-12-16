import { createClient } from '@supabase/supabase-js';
import { publicEnv } from '@/lib/env';

const supabaseUrl = publicEnv.supabaseUrl;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_KEY is required for admin operations');
}

// Service role client for admin operations
export const supabaseServiceClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
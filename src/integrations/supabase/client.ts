
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fpgmiomtgjvccipwiknw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZ21pb210Z2p2Y2NpcHdpa253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzAxNjMsImV4cCI6MjA1NDI0NjE2M30.S_WAqrvCTaT-VvRbtDY47lRhwBc7FjtHrRWs2J_E-FY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

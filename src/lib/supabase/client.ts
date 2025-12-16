import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";

const supabaseUrl = publicEnv.supabaseUrl;
const supabaseAnonKey = publicEnv.supabaseAnonKey;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: "public",
  },
});
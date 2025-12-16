"use client";

import { dataProvider as dataProviderSupabase } from "@refinedev/supabase";
import { supabase } from "@/lib/supabase/client";

export const dataProvider = dataProviderSupabase(supabase);

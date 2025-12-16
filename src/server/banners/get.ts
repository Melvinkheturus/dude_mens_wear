"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function getBanners() {
  try {
    const supabase = await createServerSupabase();
    
    const { data: banners, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    
    if (error) throw error;
    
    return { success: true, data: banners || [] };
  } catch (error) {
    console.error("Error getting banners:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get banners",
      data: [],
    };
  }
}
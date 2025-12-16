"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { bannerSchema, type BannerInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createBanner(input: BannerInput) {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Validate input
    const validatedInput = bannerSchema.parse(input);
    
    const supabase = await createServerSupabase();
    
    const { data: banner, error } = await supabase
      .from("banners")
      .insert(validatedInput)
      .select()
      .single();
    
    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true, data: banner };
  } catch (error) {
    console.error("Error creating banner:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create banner",
    };
  }
}

export async function updateBanner(id: string, input: Partial<BannerInput>) {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    const supabase = await createServerSupabase();
    
    const { data: banner, error } = await supabase
      .from("banners")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true, data: banner };
  } catch (error) {
    console.error("Error updating banner:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update banner",
    };
  }
}

export async function deleteBanner(id: string) {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    const supabase = await createServerSupabase();
    
    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete banner",
    };
  }
}

export async function getAdminBanners() {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized", data: [] };
    }
    
    const supabase = await createServerSupabase();
    
    const { data: banners, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    
    if (error) throw error;
    
    return { success: true, data: banners || [] };
  } catch (error) {
    console.error("Error getting admin banners:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get banners",
      data: [],
    };
  }
}
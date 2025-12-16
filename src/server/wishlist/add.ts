"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser, getGuestIdForAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addToWishlist(productId: string) {
  try {
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();
    
    // Get user_id or guest_id
    const userId = user?.id;
    const guestId = userId ? null : await getGuestIdForAuth();
    
    // Check if item already exists in wishlist
    const { data: existingItem } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("product_id", productId)
      .eq(userId ? "user_id" : "guest_id", userId || guestId)
      .single();
    
    if (existingItem) {
      return { success: true, message: "Item already in wishlist" };
    }
    
    // Add to wishlist
    const { error } = await supabase
      .from("wishlist_items")
      .insert({
        product_id: productId,
        user_id: userId,
        guest_id: guestId,
      });
    
    if (error) throw error;
    
    revalidatePath("/wishlist");
    return { success: true, message: "Added to wishlist" };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add to wishlist" 
    };
  }
}
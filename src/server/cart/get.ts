"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser, getGuestIdForAuth } from "@/lib/auth";

export async function getCart() {
  try {
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();
    
    // Get user_id or guest_id
    const userId = user?.id;
    const guestId = userId ? null : await getGuestIdForAuth();
    
    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        created_at,
        product_variants (
          id,
          sku,
          price,
          discount_price,
          size,
          color,
          stock,
          products (
            id,
            title,
            slug,
            product_images (
              image_url,
              sort_order
            )
          )
        )
      `)
      .eq(userId ? "user_id" : "guest_id", userId || guestId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return { success: true, data: cartItems || [] };
  } catch (error) {
    console.error("Error getting cart:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get cart",
      data: []
    };
  }
}

export async function getCartCount() {
  try {
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();
    
    // Get user_id or guest_id
    const userId = user?.id;
    const guestId = userId ? null : await getGuestIdForAuth();
    
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq(userId ? "user_id" : "guest_id", userId || guestId);
    
    if (error) throw error;
    
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("Error getting cart count:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get cart count",
      count: 0
    };
  }
}
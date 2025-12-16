"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser, getGuestIdForAuth } from "@/lib/auth";

export async function getWishlist() {
  try {
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();

    // Get user_id or guest_id
    const userId = user?.id;
    const guestId = userId ? null : await getGuestIdForAuth();

    const { data: wishlistItems, error } = await supabase
      .from("wishlist_items")
      .select(`
        id,
        created_at,
        products (
          id,
          title,
          slug,
          product_images (
            image_url,
            sort_order
          ),
          product_variants (
            id,
            price,
            discount_price,
            stock
          )
        )
      `)
      .eq(userId ? "user_id" : "guest_id", userId || guestId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: wishlistItems || [] };
  } catch (error) {
    console.error("Error getting wishlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get wishlist",
      data: []
    };
  }
}

export async function isInWishlist(productId: string) {
  try {
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();

    // Get user_id or guest_id
    const userId = user?.id;
    const guestId = userId ? null : await getGuestIdForAuth();

    const { data, error } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("product_id", productId)
      .eq(userId ? "user_id" : "guest_id", userId || guestId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return { success: true, isInWishlist: !!data };
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check wishlist",
      isInWishlist: false
    };
  }
}
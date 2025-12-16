"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser, getGuestIdForAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function removeFromWishlist(productId: string) {
  try {
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();

    // Get user_id or guest_id
    const userId = user?.id;
    const guestId = userId ? null : await getGuestIdForAuth();

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("product_id", productId)
      .eq(userId ? "user_id" : "guest_id", userId || guestId);

    if (error) throw error;

    revalidatePath("/wishlist");
    return { success: true, message: "Removed from wishlist" };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove from wishlist"
    };
  }
}
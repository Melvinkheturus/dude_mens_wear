"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function removeFromCart(itemId: string) {
  try {
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();
    
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq(user ? "user_id" : "guest_id", user?.id || null);
    
    if (error) throw error;
    
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to remove from cart" 
    };
  }
}
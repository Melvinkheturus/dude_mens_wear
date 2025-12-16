"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { updateCartItemSchema, type UpdateCartItemInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function updateCartItem(itemId: string, input: UpdateCartItemInput) {
  try {
    // Validate input
    const validatedInput = updateCartItemSchema.parse(input);
    
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();
    
    if (validatedInput.quantity === 0) {
      // Remove item if quantity is 0
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
        .eq(user ? "user_id" : "guest_id", user?.id || null);
      
      if (error) throw error;
    } else {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: validatedInput.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .eq(user ? "user_id" : "guest_id", user?.id || null);
      
      if (error) throw error;
    }
    
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update cart item" 
    };
  }
}
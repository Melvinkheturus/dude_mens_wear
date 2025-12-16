"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser, getGuestIdForAuth } from "@/lib/auth";
import { addToCartSchema, type AddToCartInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { getGuestId } from "@/lib/guest";

export async function addToCart(input: AddToCartInput) {
  try {
    // Validate input
    const validatedInput = addToCartSchema.parse(input);
    
    const supabase = await createServerSupabase();
    const user = await getCurrentUser();
    
    // Get user_id or guest_id
    const userId = user?.id;
    const guestId = userId ? null : await getGuestIdForAuth();
    
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("variant_id", validatedInput.variant_id)
      .eq(userId ? "user_id" : "guest_id", userId || guestId)
      .single();
    
    if (existingItem) {
      // Update existing item
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + validatedInput.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);
      
      if (error) throw error;
    } else {
      // Create new item
      const { error } = await supabase
        .from("cart_items")
        .insert({
          variant_id: validatedInput.variant_id,
          quantity: validatedInput.quantity,
          user_id: userId,
          guest_id: guestId,
        });
      
      if (error) throw error;
    }
    
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add to cart" 
    };
  }
}
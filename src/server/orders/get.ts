"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function getUserOrders() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required", data: [] };
    }
    
    const supabase = await createServerSupabase();
    
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        payment_status,
        total,
        created_at,
        order_items (
          id,
          quantity,
          price,
          name,
          products (
            id,
            name,
            images,
            slug
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return { success: true, data: orders || [] };
  } catch (error) {
    console.error("Error getting user orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get orders",
      data: [],
    };
  }
}

export async function getOrder(orderId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required", data: null };
    }
    
    const supabase = await createServerSupabase();
    
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        payment_status,
        subtotal,
        tax,
        shipping,
        total,
        shipping_address,
        billing_address,
        payment_method,
        notes,
        created_at,
        updated_at,
        order_items (
          id,
          quantity,
          price,
          name,
          products (
            id,
            name,
            images,
            slug
          ),
          product_variants (
            id,
            name
          )
        )
      `)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();
    
    if (error) throw error;
    
    return { success: true, data: order };
  } catch (error) {
    console.error("Error getting order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Order not found",
      data: null,
    };
  }
}
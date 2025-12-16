import { createServerSupabase } from "@/lib/supabase/server";

export interface CartItem {
  id: string;
  quantity: number;
  variant_id: string;
}

export interface ShippingAddress {
  state: string;
  city: string;
  pincode: string;
}

export interface ShippingCalculation {
  amount: number; // in paise
  provider: string;
  zone: string;
  rule_id: string;
}

export interface ShippingError {
  error: string;
  code: string;
}

/**
 * Calculate shipping cost based on cart items and shipping address
 * This is the authoritative shipping calculation function
 */
export async function calculateShipping(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress
): Promise<ShippingCalculation | ShippingError> {
  try {
    const supabase = await createServerSupabase();

    // 1. Calculate total quantity
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity === 0) {
      return {
        error: "Cart is empty",
        code: "EMPTY_CART"
      };
    }

    // 2. Determine shipping zone
    const zone = normalizeShippingZone(shippingAddress.state);

    // 3. Find matching shipping rule
    const { data: shippingRules, error } = await supabase
      .from("shipping_rules")
      .select("*")
      .eq("zone", zone)
      .eq("is_active", true)
      .gte("max_quantity", totalQuantity)
      .order("max_quantity", { ascending: true })
      .limit(1);

    if (error) {
      console.error("Error fetching shipping rules:", error);
      return {
        error: "Failed to calculate shipping",
        code: "DATABASE_ERROR"
      };
    }

    if (!shippingRules || shippingRules.length === 0) {
      return {
        error: `No shipping rule found for ${totalQuantity} items in ${zone}`,
        code: "NO_SHIPPING_RULE"
      };
    }

    const rule = shippingRules[0];

    return {
      amount: rule.price,
      provider: rule.provider,
      zone: zone,
      rule_id: rule.id
    };

  } catch (error) {
    console.error("Shipping calculation error:", error);
    return {
      error: "Internal server error",
      code: "INTERNAL_ERROR"
    };
  }
}

/**
 * Normalize state name to shipping zone
 * Handles various formats of Tamil Nadu
 */
function normalizeShippingZone(state: string): string {
  const normalizedState = state.toLowerCase().trim();
  
  // Handle various Tamil Nadu formats
  const tamilNaduVariants = [
    "tamil nadu",
    "tamilnadu", 
    "tn",
    "tamil-nadu",
    "tamil_nadu"
  ];

  if (tamilNaduVariants.includes(normalizedState)) {
    return "tamilnadu";
  }

  return "rest_of_india";
}

/**
 * Get all active shipping rules (for admin display)
 */
export async function getShippingRules() {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from("shipping_rules")
    .select("*")
    .eq("is_active", true)
    .order("zone", { ascending: true })
    .order("max_quantity", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch shipping rules: ${error.message}`);
  }

  return data;
}

/**
 * Update shipping rule (admin only)
 */
export async function updateShippingRule(
  id: string,
  updates: {
    zone?: string;
    max_quantity?: number;
    price?: number;
    provider?: string;
    is_active?: boolean;
  }
) {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from("shipping_rules")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update shipping rule: ${error.message}`);
  }

  return data;
}

/**
 * Create new shipping rule (admin only)
 */
export async function createShippingRule(rule: {
  zone: string;
  max_quantity: number;
  price: number;
  provider: string;
}) {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from("shipping_rules")
    .insert(rule)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create shipping rule: ${error.message}`);
  }

  return data;
}
import { createServerSupabase } from "@/lib/supabase/server";
import { calculateShipping, type CartItem, type ShippingAddress } from "@/server/shipping/calculate";

export interface CreateOrderData {
  cartItems: CartItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address_line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  userEmail?: string;
  userId?: string;
  guestId?: string;
  paymentMethod?: string;
}

export interface OrderResult {
  orderId: string;
  totalAmount: number;
  shippingAmount: number;
  subtotal: number;
  razorpayOrderId?: string;
}

/**
 * Create order with shipping calculation
 * This is the authoritative order creation function
 */
export async function createOrder(orderData: CreateOrderData): Promise<OrderResult> {
  const supabase = await createServerSupabase();

  try {
    // 1. Calculate shipping (authoritative)
    const shippingResult = await calculateShipping(
      orderData.cartItems,
      {
        state: orderData.shippingAddress.state,
        city: orderData.shippingAddress.city,
        pincode: orderData.shippingAddress.pincode,
      }
    );

    if ("error" in shippingResult) {
      throw new Error(`Shipping calculation failed: ${shippingResult.error}`);
    }

    // 2. Get product variant prices for subtotal calculation
    const variantIds = orderData.cartItems.map(item => item.variant_id);
    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("id, price, discount_price, stock")
      .in("id", variantIds);

    if (variantsError) {
      throw new Error(`Failed to fetch product variants: ${variantsError.message}`);
    }

    // 3. Calculate subtotal and validate stock
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of orderData.cartItems) {
      const variant = variants?.find(v => v.id === cartItem.variant_id);
      if (!variant) {
        throw new Error(`Product variant ${cartItem.variant_id} not found`);
      }

      if (variant.stock < cartItem.quantity) {
        throw new Error(`Insufficient stock for variant ${cartItem.variant_id}`);
      }

      const price = variant.discount_price || variant.price;
      const itemTotal = price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        variant_id: cartItem.variant_id,
        quantity: cartItem.quantity,
        price: price, // Store price at time of order
      });
    }

    const totalAmount = subtotal + shippingResult.amount;

    // 4. Create shipping address
    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .insert({
        ...orderData.shippingAddress,
        user_id: orderData.userId || null,
        guest_id: orderData.guestId || null,
      })
      .select()
      .single();

    if (addressError) {
      throw new Error(`Failed to create address: ${addressError.message}`);
    }

    // 5. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.userId || null,
        guest_id: orderData.guestId || null,
        guest_email: orderData.userEmail || null,
        total_amount: totalAmount,
        shipping_amount: shippingResult.amount,
        shipping_provider: shippingResult.provider,
        shipping_zone: shippingResult.zone,
        shipping_address_id: address.id,
        order_status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // 6. Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // 7. Update stock (reduce inventory)
    for (const cartItem of orderData.cartItems) {
      // First get current stock
      const { data: variant, error: fetchError } = await supabase
        .from("product_variants")
        .select("stock_quantity")
        .eq("id", cartItem.variant_id)
        .single();

      if (fetchError || !variant) {
        console.error(`Failed to fetch variant ${cartItem.variant_id}:`, fetchError);
        continue;
      }

      // Update stock by subtracting quantity
      const newStock = Math.max(0, variant.stock_quantity - cartItem.quantity);
      const { error: stockError } = await supabase
        .from("product_variants")
        .update({ 
          stock_quantity: newStock
        })
        .eq("id", cartItem.variant_id);

      if (stockError) {
        console.error(`Failed to update stock for variant ${cartItem.variant_id}:`, stockError);
        // Don't throw here - order is already created
      }
    }

    return {
      orderId: order.id,
      totalAmount,
      shippingAmount: shippingResult.amount,
      subtotal,
    };

  } catch (error) {
    console.error("Order creation error:", error);
    throw error;
  }
}

/**
 * Get order with shipping details
 */
export async function getOrderWithShipping(orderId: string) {
  const supabase = await createServerSupabase();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        product_variants (
          *,
          products (title, slug)
        )
      ),
      addresses (*)
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return order;
}

/**
 * Update order shipping tracking
 */
export async function updateOrderTracking(
  orderId: string, 
  trackingNumber: string,
  orderStatus: string = "shipped"
) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("orders")
    .update({
      shipping_tracking_number: trackingNumber,
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tracking: ${error.message}`);
  }

  return data;
}
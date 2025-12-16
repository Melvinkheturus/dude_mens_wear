import { NextRequest, NextResponse } from "next/server";
import { createOrder, type CreateOrderData } from "@/server/orders/create";

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderData = await request.json();

    // Validate required fields
    if (!orderData.cartItems || !Array.isArray(orderData.cartItems) || orderData.cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!orderData.shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // Validate shipping address fields
    const requiredAddressFields = ["name", "phone", "address_line1", "city", "state", "pincode"];
    for (const field of requiredAddressFields) {
      if (!orderData.shippingAddress[field as keyof typeof orderData.shippingAddress]) {
        return NextResponse.json(
          { error: `Shipping address ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create order
    const result = await createOrder(orderData);

    return NextResponse.json({
      success: true,
      order: result
    });

  } catch (error) {
    console.error("Order creation API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
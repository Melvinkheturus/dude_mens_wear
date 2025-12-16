import { NextRequest, NextResponse } from "next/server";
import { calculateShipping, type CartItem, type ShippingAddress } from "@/server/shipping/calculate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems, shippingAddress } = body as {
      cartItems: CartItem[];
      shippingAddress: ShippingAddress;
    };

    // Validate input
    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.state) {
      return NextResponse.json(
        { error: "Invalid shipping address" },
        { status: 400 }
      );
    }

    // Calculate shipping
    const result = await calculateShipping(cartItems, shippingAddress);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      shipping: result
    });

  } catch (error) {
    console.error("Shipping calculation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
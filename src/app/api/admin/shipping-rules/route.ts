import { NextRequest, NextResponse } from "next/server";
import { getShippingRules, createShippingRule } from "@/server/shipping/calculate";

export async function GET() {
  try {
    const rules = await getShippingRules();
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    console.error("Get shipping rules API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ruleData = await request.json();
    
    // Validate required fields
    const { zone, max_quantity, price, provider } = ruleData;
    
    if (!zone || !max_quantity || price === undefined || !provider) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate zone
    if (!["tamilnadu", "rest_of_india"].includes(zone)) {
      return NextResponse.json(
        { error: "Invalid zone" },
        { status: 400 }
      );
    }

    // Validate quantity and price
    if (max_quantity <= 0 || price < 0) {
      return NextResponse.json(
        { error: "Invalid quantity or price" },
        { status: 400 }
      );
    }

    const newRule = await createShippingRule({
      zone,
      max_quantity: Math.round(max_quantity),
      price: Math.round(price * 100), // Convert to paise
      provider,
    });

    return NextResponse.json({
      success: true,
      rule: newRule
    });

  } catch (error) {
    console.error("Create shipping rule API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to create shipping rule";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
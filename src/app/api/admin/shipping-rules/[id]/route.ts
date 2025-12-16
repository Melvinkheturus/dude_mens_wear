import { NextRequest, NextResponse } from "next/server";
import { updateShippingRule } from "@/server/shipping/calculate";
import { createServerSupabase } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const updates = await request.json();
    
    // Convert price to paise if provided
    if (updates.price !== undefined) {
      updates.price = Math.round(updates.price * 100);
    }

    // Convert max_quantity to integer if provided
    if (updates.max_quantity !== undefined) {
      updates.max_quantity = Math.round(updates.max_quantity);
    }

    const updatedRule = await updateShippingRule(resolvedParams.id, updates);

    return NextResponse.json({
      success: true,
      rule: updatedRule
    });

  } catch (error) {
    console.error("Update shipping rule API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to update shipping rule";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const supabase = await createServerSupabase();
    
    const { error } = await supabase
      .from("shipping_rules")
      .delete()
      .eq("id", resolvedParams.id);

    if (error) {
      throw new Error(`Failed to delete shipping rule: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Shipping rule deleted successfully"
    });

  } catch (error) {
    console.error("Delete shipping rule API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to delete shipping rule";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
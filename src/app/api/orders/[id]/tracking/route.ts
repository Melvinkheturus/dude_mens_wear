import { NextRequest, NextResponse } from "next/server";
import { updateOrderTracking } from "@/server/orders/create";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { tracking_number, order_status } = await request.json();

    if (!tracking_number) {
      return NextResponse.json(
        { error: "Tracking number is required" },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderTracking(
      resolvedParams.id,
      tracking_number,
      order_status || "shipped"
    );

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error("Tracking update API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to update tracking";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
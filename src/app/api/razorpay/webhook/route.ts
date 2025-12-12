import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Razorpay webhook handler
  return NextResponse.json({ received: true });
}

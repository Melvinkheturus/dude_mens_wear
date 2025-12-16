import { NextRequest, NextResponse } from 'next/server'
import { serverEnv } from '@/lib/env'

// Razorpay order creation (server-side only)
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json()

    // Validate required fields
    if (!amount || !receipt) {
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      )
    }

    // Create Razorpay order using secret key
    const orderData = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      payment_capture: serverEnv.razorpayKeySecret ? 1 : 0, // Auto-capture if secret is available
    }

    // Check if Razorpay credentials are configured
    if (!serverEnv.razorpayKeyId || !serverEnv.razorpayKeySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // TODO: Implement actual Razorpay integration
    // const razorpay = new Razorpay({
    //   key_id: serverEnv.razorpayKeyId,
    //   key_secret: serverEnv.razorpayKeySecret,
    // })
    // const order = await razorpay.orders.create(orderData)

    // For now, return error indicating payment gateway needs setup
    return NextResponse.json(
      { error: 'Payment gateway integration pending. Please use demo checkout.' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Payment order creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
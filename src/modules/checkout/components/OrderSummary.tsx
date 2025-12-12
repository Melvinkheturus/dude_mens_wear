'use client'

import { useDemoCart } from '@/contexts/DemoCartContext'
import Image from 'next/image'
import { useState } from 'react'
import PromoCode from '@/components/checkout/PromoCode'

export default function OrderSummary() {
  const { items: cartItems, getTotalPrice, getTotalItems, getSubtotal, getShippingCost } = useDemoCart()
  const [discount, setDiscount] = useState<{ code: string; amount: number } | null>(null)

  const formatPrice = (amount: number) => {
    return `₹${amount.toFixed(0)}`
  }

  const handlePromoApplied = (discountData: { code: string; amount: number } | null) => {
    setDiscount(discountData)
  }

  const subtotal = getSubtotal()
  const shippingCost = getShippingCost()
  const discountAmount = discount ? discount.amount : 0
  const finalTotal = subtotal + shippingCost - discountAmount

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
              {item.product.images && item.product.images.length > 0 ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.product.title}</h3>
              {(item.size || item.color) && (
                <p className="text-sm text-gray-600">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && ' • '}
                  {item.color && `Color: ${item.color}`}
                </p>
              )}
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="font-semibold">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <div className="mb-4">
        <PromoCode onApplied={handlePromoApplied} />
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({getTotalItems()} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
        </div>

        {discount && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({discount.code})</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span className="text-red-600">
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
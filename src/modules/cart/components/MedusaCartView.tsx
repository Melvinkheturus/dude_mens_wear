'use client'

import { useDemoCart } from '@/contexts/DemoCartContext'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function MedusaCartView() {
  const { items: cartItems, updateItem, removeItem, getTotalPrice } = useDemoCart()

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some items to get started!</p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const formatPrice = (amount: number) => {
    return `₹${amount.toFixed(0)}`
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateItem(itemId, newQuantity)
  }

  const handleRemove = (itemId: string) => {
    removeItem(itemId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.title}</h3>
                {(item.size || item.color) && (
                  <p className="text-sm text-gray-600">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' • '}
                    {item.color && `Color: ${item.color}`}
                  </p>
                )}
                <p className="text-lg font-bold mt-2">
                  {formatPrice(item.product.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1 border rounded hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item Total & Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <p className="font-bold text-lg">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-black text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full text-center py-3 mt-3 text-sm text-gray-600 hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

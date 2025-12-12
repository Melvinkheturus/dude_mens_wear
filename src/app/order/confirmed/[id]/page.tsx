'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmedPage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock order data
        const mockOrder = {
          id: params.id,
          display_id: params.id,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          items: [
            {
              id: '1',
              title: 'Sample Product',
              quantity: 1,
              unit_price: 1999,
              thumbnail: '/images/placeholder.jpg'
            }
          ],
          total: 1999,
          shipping_address: {
            first_name: 'John',
            last_name: 'Doe',
            address_1: '123 Main St',
            city: 'Mumbai',
            province: 'Maharashtra',
            postal_code: '400001'
          }
        }
        
        setOrder(mockOrder)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span>#{order.display_id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-green-600 font-medium">{order.status}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Items</h3>
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title} x {item.quantity}</span>
                <span>₹{(item.unit_price / 100).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{(order.total / 100).toFixed(0)}</span>
            </div>
          </div>

          {order.shipping_address && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                {order.shipping_address.address_1}<br />
                {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Link
            href="/profile?section=track-order"
            className="flex-1 bg-black text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Track Order
          </Link>
          <Link
            href="/products"
            className="flex-1 bg-gray-200 text-gray-800 text-center py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            This is a demo order confirmation page. In a real application, you would receive email confirmations and tracking information.
          </p>
        </div>
      </div>
    </div>
  )
}
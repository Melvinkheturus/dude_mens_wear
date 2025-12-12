'use client'

import { useDemoCart } from '@/contexts/DemoCartContext'
import DemoCartView from '@/modules/cart/components/DemoCartView'
import EmptyCart from '@/modules/cart/components/EmptyCart'

export default function CartPage() {
  const { items, isLoading } = useDemoCart()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading cart...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyCart />
  }

  return <DemoCartView />
}

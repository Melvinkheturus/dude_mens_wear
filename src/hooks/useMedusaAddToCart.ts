import { useState } from 'react'
import { useDemoCart } from '@/contexts/DemoCartContext'

export function useMedusaAddToCart() {
  const { addItem } = useDemoCart()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addToCart = async (productId: string, quantity: number = 1, size?: string, color?: string) => {
    setIsAdding(true)
    setError(null)
    
    try {
      addItem(productId, quantity, size, color)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
      return false
    } finally {
      setIsAdding(false)
    }
  }

  return {
    addToCart,
    isAdding,
    error,
  }
}

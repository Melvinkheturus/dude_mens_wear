'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
  variantKey: string // Unique key for variant (e.g., "product-1-M-Black")
  isFBT?: boolean // Flag to identify FBT items
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQuantity: (variantKey: string, quantity: number) => void
  removeFromCart: (variantKey: string) => void
  clearCart: () => void
  clearFBTItems: () => void
  totalPrice: number
  itemCount: number
  uniqueVariantCount: number
  getItemByVariant: (variantKey: string) => CartItem | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((cartItem) => cartItem.variantKey === item.variantKey)
      
      if (existingIndex !== -1) {
        // Item exists, update quantity
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (item.quantity || 1),
        }
        return updated
      }
      
      // New item, add to cart
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const updateQuantity = (variantKey: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.variantKey !== variantKey)
      }
      return prev.map((item) =>
        item.variantKey === variantKey ? { ...item, quantity } : item
      )
    })
  }

  const removeFromCart = (variantKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.variantKey !== variantKey))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const clearFBTItems = () => {
    setCartItems((prev) => prev.filter((item) => !item.isFBT))
  }

  const getItemByVariant = (variantKey: string) => {
    return cartItems.find((item) => item.variantKey === variantKey)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const uniqueVariantCount = cartItems.length

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearFBTItems,
        totalPrice,
        itemCount,
        uniqueVariantCount,
        getItemByVariant,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

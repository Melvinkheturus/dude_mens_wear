'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DemoProduct, getProductById } from '@/lib/demo-data'

export interface CartItem {
  id: string
  productId: string
  product: DemoProduct
  quantity: number
  size?: string
  color?: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
}

interface DemoCartContextType {
  items: CartItem[]
  isLoading: boolean
  email: string | null
  shippingAddress: ShippingAddress | null
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => void
  updateItem: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  updateEmail: (email: string) => void
  updateShippingAddress: (address: ShippingAddress) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getSubtotal: () => number
  getShippingCost: () => number
  completeCheckout: () => Promise<{ success: boolean; orderId?: string; error?: string }>
}

const DemoCartContext = createContext<DemoCartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'demo_cart_items'
const EMAIL_STORAGE_KEY = 'demo_cart_email'
const ADDRESS_STORAGE_KEY = 'demo_cart_address'

export function DemoCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(CART_STORAGE_KEY)
      const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY)
      const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY)

      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        // Validate items and ensure products still exist
        const validItems = parsedItems.filter((item: CartItem) => {
          const product = getProductById(item.productId)
          if (product) {
            item.product = product // Update product data
            return true
          }
          return false
        })
        setItems(validItems)
      }

      if (savedEmail) {
        setEmail(savedEmail)
      }

      if (savedAddress) {
        setShippingAddress(JSON.parse(savedAddress))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoading])

  // Save email to localStorage
  useEffect(() => {
    if (email) {
      localStorage.setItem(EMAIL_STORAGE_KEY, email)
    }
  }, [email])

  // Save address to localStorage
  useEffect(() => {
    if (shippingAddress) {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(shippingAddress))
    }
  }, [shippingAddress])

  const addItem = (productId: string, quantity: number = 1, size?: string, color?: string) => {
    const product = getProductById(productId)
    if (!product) {
      console.error('Product not found:', productId)
      return
    }

    setItems(currentItems => {
      // Check if item with same product, size, and color already exists
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      )

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${productId}-${size || 'no-size'}-${color || 'no-color'}-${Date.now()}`,
          productId,
          product,
          quantity,
          size,
          color
        }
        return [...currentItems, newItem]
      }
    })
  }

  const updateItem = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setItems([])
    setEmail(null)
    setShippingAddress(null)
    localStorage.removeItem(CART_STORAGE_KEY)
    localStorage.removeItem(EMAIL_STORAGE_KEY)
    localStorage.removeItem(ADDRESS_STORAGE_KEY)
  }

  const updateEmail = (newEmail: string) => {
    setEmail(newEmail)
  }

  const updateShippingAddress = (address: ShippingAddress) => {
    setShippingAddress(address)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getShippingCost = () => {
    const subtotal = getSubtotal()
    // Free shipping over ₹999
    return subtotal >= 999 ? 0 : 99
  }

  const getTotalPrice = () => {
    return getSubtotal() + getShippingCost()
  }

  const completeCheckout = async (): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    // Simulate checkout process
    if (items.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    if (!email) {
      return { success: false, error: 'Email is required' }
    }

    if (!shippingAddress) {
      return { success: false, error: 'Shipping address is required' }
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock order ID
    const orderId = `ORDER-${Date.now()}`

    // Clear cart after successful checkout
    clearCart()

    return { success: true, orderId }
  }

  return (
    <DemoCartContext.Provider
      value={{
        items,
        isLoading,
        email,
        shippingAddress,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        updateEmail,
        updateShippingAddress,
        getTotalItems,
        getTotalPrice,
        getSubtotal,
        getShippingCost,
        completeCheckout,
      }}
    >
      {children}
    </DemoCartContext.Provider>
  )
}

export function useDemoCart() {
  const context = useContext(DemoCartContext)
  if (context === undefined) {
    throw new Error('useDemoCart must be used within a DemoCartProvider')
  }
  return context
}
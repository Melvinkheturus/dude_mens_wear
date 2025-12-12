export interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  name: string
  image: string
  size: string
  quantity: number
  price: number
}

export interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

export type ProfileSection = 'orders' | 'wishlist' | 'addresses' | 'settings' | 'track-order'

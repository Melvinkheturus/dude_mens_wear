// Global TypeScript types
export interface Product {
  id: string;
  title: string;
  price: number;
  // Add more fields
}

// Re-export demo types for convenience
export type { DemoProduct, DemoCategory } from '@/lib/demo-data'
export type { CartItem, ShippingAddress } from '@/contexts/DemoCartContext'

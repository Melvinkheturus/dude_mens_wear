import type { Product } from '@/lib/services/products'

export interface ProductCardProps {
  product: Product
  badge?: "NEW" | "BESTSELLER" | "SALE" | string
  badgeColor?: "red" | "black"
}

export interface ProductGridProps {
  products: Product[]
}

export interface RelatedProductsProps {
  products?: Product[]
}

// Re-export from services for convenience
export type { Product } from '@/lib/services/products'
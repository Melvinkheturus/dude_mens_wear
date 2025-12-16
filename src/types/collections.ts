import type { Database } from './supabase'

// Use Supabase generated types
export type Collection = Database['public']['Tables']['collections']['Row']
export type CollectionInsert = Database['public']['Tables']['collections']['Insert']
export type CollectionUpdate = Database['public']['Tables']['collections']['Update']

export type CollectionProduct = Database['public']['Tables']['collection_products']['Row']
export type CollectionProductInsert = Database['public']['Tables']['collection_products']['Insert']
export type CollectionProductUpdate = Database['public']['Tables']['collection_products']['Update']

export type HomepageSection = Database['public']['Tables']['homepage_sections']['Row']
export type HomepageSectionInsert = Database['public']['Tables']['homepage_sections']['Insert']
export type HomepageSectionUpdate = Database['public']['Tables']['homepage_sections']['Update']

// Extended types for frontend use
export interface HomepageSectionWithCollection extends HomepageSection {
  collection?: Collection
}

export interface CollectionRule {
  created_at?: {
    gte?: string
    lte?: string
  }
  category?: string | string[]
  discount?: {
    gte?: number
    lte?: number
  }
  sales_count?: {
    gte?: number
    lte?: number
  }
  price?: {
    gte?: number
    lte?: number
  }
  tags?: string[]
}
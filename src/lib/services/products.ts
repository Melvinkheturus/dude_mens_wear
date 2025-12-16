import { supabase } from '@/lib/supabase/client'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  original_price?: number
  images: string[]
  category_id: string
  sizes: string[]
  colors: string[]
  in_stock: boolean
  is_bestseller: boolean
  is_new_drop: boolean
  slug: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
  description?: string
  created_at: string
  updated_at: string
}

export class ProductsService {
  // Products CRUD
  static async getProducts(limit?: number): Promise<Product[]> {
    const query = supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (limit) {
      query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  }

  static async getProductsByCategory(categorySlug: string, limit?: number): Promise<Product[]> {
    // First get the category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (!category) {
      return []
    }

    const query = supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (limit) {
      query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products by category:', error)
      return []
    }

    return data || []
  }

  static async getBestsellers(limit?: number): Promise<Product[]> {
    const query = supabase
      .from('products')
      .select('*')
      .eq('is_bestseller', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (limit) {
      query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching bestsellers:', error)
      return []
    }

    return data || []
  }

  static async getNewDrops(limit?: number): Promise<Product[]> {
    const query = supabase
      .from('products')
      .select('*')
      .eq('is_new_drop', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (limit) {
      query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching new drops:', error)
      return []
    }

    return data || []
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }

    return data
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product by ID:', error)
      return null
    }

    return data
  }

  // Categories CRUD
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }

    return data
  }

  // Search functionality
  static async searchProducts(query: string, limit?: number): Promise<Product[]> {
    const searchQuery = supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (limit) {
      searchQuery.limit(limit)
    }

    const { data, error } = await searchQuery

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return data || []
  }
}
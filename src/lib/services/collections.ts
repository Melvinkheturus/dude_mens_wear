import { supabase } from '@/lib/supabase/client'
import type { 
  Collection, 
  CollectionInsert, 
  CollectionUpdate,
  CollectionProduct, 
  CollectionProductInsert,
  HomepageSection, 
  HomepageSectionInsert,
  HomepageSectionUpdate,
  HomepageSectionWithCollection,
  CollectionRule 
} from '@/types/collections'
import type { Product } from '@/lib/services/products'

export class CollectionsService {
  // Collections CRUD
  static async getCollections(): Promise<Collection[]> {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getCollection(id: string): Promise<Collection | null> {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async createCollection(collection: CollectionInsert): Promise<Collection> {
    const { data, error } = await supabase
      .from('collections')
      .insert(collection)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateCollection(id: string, updates: CollectionUpdate): Promise<Collection> {
    const { data, error } = await supabase
      .from('collections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteCollection(id: string): Promise<void> {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Collection Products CRUD
  static async getCollectionProducts(collectionId: string): Promise<CollectionProduct[]> {
    const { data, error } = await supabase
      .from('collection_products')
      .select('*')
      .eq('collection_id', collectionId)
      .order('sort_order')

    if (error) throw error
    return data || []
  }

  static async addProductToCollection(collectionId: string, productId: string, sortOrder = 0): Promise<CollectionProduct> {
    const { data, error } = await supabase
      .from('collection_products')
      .insert({
        collection_id: collectionId,
        product_id: productId,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async removeProductFromCollection(collectionId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('collection_products')
      .delete()
      .eq('collection_id', collectionId)
      .eq('product_id', productId)

    if (error) throw error
  }

  // Homepage Sections CRUD
  static async getHomepageSections(): Promise<HomepageSectionWithCollection[]> {
    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('homepage_sections')
      .select(`
        *,
        collection:collections(*)
      `)
      .eq('is_active', true)
      .or(`start_at.is.null,start_at.lte.${now}`)
      .or(`end_at.is.null,end_at.gte.${now}`)
      .order('position')

    if (error) throw error
    return data || []
  }

  static async getAllHomepageSections(): Promise<HomepageSectionWithCollection[]> {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select(`
        *,
        collection:collections(*)
      `)
      .order('position')

    if (error) throw error
    return data || []
  }

  static async createHomepageSection(section: HomepageSectionInsert): Promise<HomepageSectionWithCollection> {
    const { data, error } = await supabase
      .from('homepage_sections')
      .insert(section)
      .select(`
        *,
        collection:collections(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  static async updateHomepageSection(id: string, updates: HomepageSectionUpdate): Promise<HomepageSectionWithCollection> {
    const { data, error } = await supabase
      .from('homepage_sections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        collection:collections(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  static async deleteHomepageSection(id: string): Promise<void> {
    const { error } = await supabase
      .from('homepage_sections')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Product resolution for collections
  static async resolveCollectionProducts(collection: Collection): Promise<Product[]> {
    if (collection.type === 'manual') {
      return this.getManualCollectionProducts(collection.id)
    } else {
      return this.getRuleBasedCollectionProducts(collection.rule_json as CollectionRule || {})
    }
  }

  private static async getManualCollectionProducts(collectionId: string): Promise<Product[]> {
    const { ProductsService } = await import('@/lib/services/products')
    
    // Get products from collection_products table
    const collectionProducts = await this.getCollectionProducts(collectionId)
    const productIds = collectionProducts.map(cp => cp.product_id)
    
    if (productIds.length === 0) {
      return []
    }
    
    // Fetch actual products
    const products: Product[] = []
    for (const productId of productIds) {
      const product = await ProductsService.getProductById(productId)
      if (product) {
        products.push(product)
      }
    }
    
    return products
  }

  private static async getRuleBasedCollectionProducts(rules: CollectionRule): Promise<Product[]> {
    const { ProductsService } = await import('@/lib/services/products')
    
    // Handle specific rule patterns
    if (rules.created_at?.gte === 'last_30_days') {
      return ProductsService.getNewDrops(8)
    }
    
    if (rules.sales_count?.gte) {
      return ProductsService.getBestsellers(8)
    }
    
    // Default fallback - return empty array since no products exist yet
    return []
  }
}
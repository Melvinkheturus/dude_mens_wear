import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabase } from '@/lib/supabase/server'
import { parseCSV } from '@/lib/csv-parser'

// CSV row validation schema
const csvRowSchema = z.object({
  product_handle: z.string().min(1),
  product_title: z.string().min(1),
  product_description: z.string().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  variant_sku: z.string().min(1),
  variant_size: z.string().optional(),
  variant_color: z.string().optional(),
  price: z.string().refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num > 0
  }),
  discount_price: z.string().optional().refine((val) => {
    if (!val || val === '') return true
    const num = parseInt(val)
    return !isNaN(num) && num >= 0
  }),
  stock: z.string().refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num >= 0
  }),
  image_urls: z.string().optional()
})

interface ParsedProduct {
  handle: string
  title: string
  description?: string
  category?: string
  collection?: string
  variants: ParsedVariant[]
  images: string[]
}

interface ParsedVariant {
  sku: string
  size?: string
  color?: string
  price: number
  discount_price?: number
  stock: number
}



function transformCSVToProducts(headers: string[], rows: string[][]): ParsedProduct[] {
  const productMap = new Map<string, ParsedProduct>()

  rows.forEach(row => {
    const rowData: Record<string, string> = {}
    headers.forEach((header, i) => {
      rowData[header] = row[i] || ''
    })

    // Validate row
    const validatedRow = csvRowSchema.parse(rowData)
    
    const handle = validatedRow.product_handle
    const imageUrls = validatedRow.image_urls 
      ? validatedRow.image_urls.split('|').map(url => url.trim()).filter(Boolean)
      : []

    // Get or create product
    if (!productMap.has(handle)) {
      productMap.set(handle, {
        handle,
        title: validatedRow.product_title,
        description: validatedRow.product_description,
        category: validatedRow.category,
        collection: validatedRow.collection,
        variants: [],
        images: imageUrls
      })
    }

    // Add variant to product
    const product = productMap.get(handle)!
    product.variants.push({
      sku: validatedRow.variant_sku,
      size: validatedRow.variant_size,
      color: validatedRow.variant_color,
      price: parseInt(validatedRow.price),
      discount_price: validatedRow.discount_price ? parseInt(validatedRow.discount_price) : undefined,
      stock: parseInt(validatedRow.stock)
    })
  })

  return Array.from(productMap.values())
}

async function findOrCreateCategory(supabase: any, categoryName: string): Promise<string | null> {
  if (!categoryName) return null

  // Try to find existing category
  const { data: existingCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single()

  if (existingCategory) {
    return existingCategory.id
  }

  // Create new category
  const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({
      name: categoryName,
      slug: slug
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create category:', error)
    return null
  }

  return newCategory.id
}

async function findOrCreateCollection(supabase: any, collectionName: string): Promise<string | null> {
  if (!collectionName) return null

  // Try to find existing collection
  const { data: existingCollection } = await supabase
    .from('collections')
    .select('id')
    .eq('title', collectionName)
    .single()

  if (existingCollection) {
    return existingCollection.id
  }

  // Create new collection
  const slug = collectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const { data: newCollection, error } = await supabase
    .from('collections')
    .insert({
      title: collectionName,
      slug: slug,
      type: 'manual',
      is_active: true
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create collection:', error)
    return null
  }

  return newCollection.id
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const csvText = await file.text()
    const { headers, rows, errors: parseErrors } = parseCSV(csvText)
    
    if (parseErrors.length > 0) {
      return NextResponse.json({ 
        error: `CSV parsing errors: ${parseErrors.join(', ')}` 
      }, { status: 400 })
    }
    
    // Transform CSV data to products
    const products = transformCSVToProducts(headers, rows)
    
    if (products.length === 0) {
      return NextResponse.json({ error: 'No valid products found' }, { status: 400 })
    }

    // Check for existing SKUs
    const allSkus = products.flatMap(p => p.variants.map(v => v.sku))
    const { data: existingVariants } = await supabase
      .from('product_variants')
      .select('sku')
      .in('sku', allSkus)

    const existingSkus = new Set(existingVariants?.map(v => v.sku) || [])
    const duplicateSkus = allSkus.filter(sku => existingSkus.has(sku))
    
    if (duplicateSkus.length > 0) {
      return NextResponse.json({ 
        error: `SKUs already exist in database: ${duplicateSkus.join(', ')}` 
      }, { status: 400 })
    }

    let importedCount = 0

    // Process each product in a transaction-like manner
    for (const product of products) {
      try {
        // Find or create category
        const categoryId = await findOrCreateCategory(supabase, product.category || '')
        
        // Find or create collection
        const collectionId = await findOrCreateCollection(supabase, product.collection || '')

        // Create product slug
        const productSlug = product.handle.toLowerCase().replace(/[^a-z0-9]+/g, '-')

        // Insert product
        const { data: insertedProduct, error: productError } = await supabase
          .from('products')
          .insert({
            title: product.title,
            slug: productSlug,
            description: product.description,
            category_id: categoryId,
            status: 'active',
            price: Math.min(...product.variants.map(v => v.price)), // Set base price to lowest variant price
            original_price: product.variants.some(v => v.discount_price) 
              ? Math.min(...product.variants.filter(v => v.discount_price).map(v => v.discount_price!))
              : null,
            images: product.images,
            in_stock: product.variants.some(v => v.stock > 0)
          })
          .select('id')
          .single()

        if (productError) {
          console.error('Failed to insert product:', productError)
          continue
        }

        // Insert variants
        const variantInserts = product.variants.map(variant => ({
          product_id: insertedProduct.id,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          discount_price: variant.discount_price,
          stock: variant.stock
        }))

        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantInserts)

        if (variantsError) {
          console.error('Failed to insert variants:', variantsError)
          // Rollback: delete the product
          await supabase.from('products').delete().eq('id', insertedProduct.id)
          continue
        }

        // Insert product images if any
        if (product.images.length > 0) {
          const imageInserts = product.images.map((imageUrl, index) => ({
            product_id: insertedProduct.id,
            image_url: imageUrl,
            sort_order: index
          }))

          await supabase.from('product_images').insert(imageInserts)
        }

        // Add to collection if specified
        if (collectionId) {
          await supabase
            .from('collection_products')
            .insert({
              collection_id: collectionId,
              product_id: insertedProduct.id,
              sort_order: 0
            })
        }

        importedCount++

      } catch (error) {
        console.error('Failed to process product:', product.handle, error)
        continue
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      total: products.length
    })

  } catch (error) {
    console.error('Import error:', error)
    
    if (error instanceof Error && (
      error.message === 'Authentication required' || 
      error.message === 'Admin access required'
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    )
  }
}
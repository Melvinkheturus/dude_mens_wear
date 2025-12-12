// Product Detail Page Types

export interface ProductColor {
  name: string
  hex: string
  image: string
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  inventory_quantity?: number
  options: Array<{
    option_id: string
    value: string
  }>
}

export interface PDPProduct {
  id: string
  title: string
  price: number
  mrp: number
  rating: number
  reviews: number
  fabric: string
  colors: ProductColor[]
  sizes: string[]
  mainImage: string
  images: string[]
  description?: string
  stock?: number
  sku?: string
  category?: string
  tags?: string[]
  variants?: ProductVariant[]
  handle?: string
}

export interface Review {
  id: string
  name: string
  rating: number
  date: string
  comment: string
  verified: boolean
  helpful: number
  images?: string[]
}

export interface ComboProduct {
  id: string
  title: string
  price: number
  image: string
  selected: boolean
}

export interface RelatedProduct {
  id: string
  title: string
  price: number
  mrp: number
  image: string
  badge?: 'Bestseller' | 'New' | 'Trending' | 'Sale'
}

export interface FAQ {
  question: string
  answer: string
}

export interface InstagramPost {
  id: string
  image: string
  likes: number
  url?: string
}

// Medusa to PDP Product Transformer
export function transformMedusaProduct(medusaProduct: any): PDPProduct {
  // Get first variant for default pricing
  const firstVariant = medusaProduct.variants?.[0]
  const firstPrice = firstVariant?.prices?.[0]

  // Extract colors from variants (assuming color is an option)
  const colorOption = medusaProduct.options?.find(
    (opt: any) => opt.title.toLowerCase() === 'color'
  )
  
  const colors: ProductColor[] = colorOption
    ? colorOption.values.map((value: any) => {
        // Find variant with this color
        const variant = medusaProduct.variants?.find((v: any) =>
          v.options?.some(
            (o: any) => o.option_id === colorOption.id && o.value === value.value
          )
        )
        
        // Try to get hex from multiple sources
        let hex = '#808080' // default gray
        
        // 1. Check option value metadata
        if (value.metadata?.hex) {
          hex = value.metadata.hex
        }
        // 2. Check option value metadata with color_code key
        else if (value.metadata?.color_code) {
          hex = value.metadata.color_code
        }
        // 3. Check variant metadata
        else if (variant?.metadata?.color_code) {
          hex = variant.metadata.color_code
        }
        // 4. Fallback to common color names
        else {
          const colorName = value.value.toLowerCase()
          if (colorName.includes('black')) hex = '#000000'
          else if (colorName.includes('white')) hex = '#FFFFFF'
          else if (colorName.includes('red')) hex = '#DC2626'
          else if (colorName.includes('blue')) hex = '#2563EB'
          else if (colorName.includes('green')) hex = '#16A34A'
          else if (colorName.includes('yellow')) hex = '#EAB308'
          else if (colorName.includes('gray') || colorName.includes('grey')) hex = '#6B7280'
          else if (colorName.includes('navy')) hex = '#1E3A8A'
          else if (colorName.includes('olive')) hex = '#84CC16'
        }
        
        return {
          name: value.value,
          hex: hex,
          image: variant?.thumbnail || medusaProduct.thumbnail || medusaProduct.images?.[0]?.url || '',
        }
      })
    : [
        {
          name: 'Default',
          hex: '#000000',
          image: medusaProduct.thumbnail || medusaProduct.images?.[0]?.url || '',
        },
      ]

  // Extract sizes from options
  const sizeOption = medusaProduct.options?.find(
    (opt: any) => opt.title.toLowerCase() === 'size'
  )
  const sizes = sizeOption
    ? sizeOption.values.map((v: any) => v.value).sort((a: string, b: string) => {
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
      })
    : ['One Size']

  // Calculate price - use metadata or default to 499
  const price = firstPrice?.amount 
    ? firstPrice.amount / 100 
    : medusaProduct.metadata?.price 
    ? Number(medusaProduct.metadata.price)
    : 499

  // Calculate MRP (original price) - use metadata or add 100% markup
  const mrp = medusaProduct.metadata?.mrp
    ? Number(medusaProduct.metadata.mrp)
    : price * 2

  return {
    id: medusaProduct.id,
    title: medusaProduct.title,
    price,
    mrp,
    rating: medusaProduct.metadata?.rating
      ? Number(medusaProduct.metadata.rating)
      : 4.8,
    reviews: medusaProduct.metadata?.reviews
      ? Number(medusaProduct.metadata.reviews)
      : Math.floor(Math.random() * 3000) + 500, // Random reviews between 500-3500
    fabric:
      medusaProduct.metadata?.fabric ||
      medusaProduct.material ||
      'Premium Cotton • 180 GSM • Made in India',
    colors,
    sizes,
    mainImage: medusaProduct.thumbnail || medusaProduct.images?.[0]?.url || '',
    images: medusaProduct.images?.map((img: any) => img.url) || [],
    description: medusaProduct.description,
    stock: firstVariant?.inventory_quantity || 100,
    sku: firstVariant?.sku,
    category: medusaProduct.collection?.title,
    tags: medusaProduct.tags?.map((tag: any) => tag.value) || [],
    variants: medusaProduct.variants?.map((v: any) => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      inventory_quantity: v.inventory_quantity,
      options: v.options || [],
    })) || [],
    handle: medusaProduct.handle,
  }
}

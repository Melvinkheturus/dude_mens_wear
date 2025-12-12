import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProducts } from '@/lib/demo-data'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/utils/seo'
import PDP from '@/modules/product-detail-page'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Fetch product from demo data
  const product = getProductBySlug(slug)

  // Handle product not found
  if (!product) {
    notFound()
  }

  // Get related products from same category
  const allProducts = getAllProducts()
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8)

  // Mock combo products (frequently bought together)
  const comboProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3)

  // Reviews will be empty for demo
  const reviews: any[] = []

  // Generate structured data for SEO
  const productSchema = generateProductSchema({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    images: product.images,
    handle: product.slug,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.title, url: `/products/${product.slug}` },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <PDP 
        product={product} 
        comboProducts={comboProducts}
        relatedProducts={relatedProducts}
        reviews={reviews}
      />
    </>
  )
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const description = product.description || `Shop ${product.title} at Dude Menswear. Premium quality menswear with fast delivery.`

  return {
    title: `${product.title} - ₹${product.price.toLocaleString()}`,
    description,
    keywords: [product.title, 'menswear', 'fashion', 'streetwear', product.category, 'clothing'],
    openGraph: {
      type: 'website',
      title: product.title,
      description,
      images: [
        {
          url: product.images[0] || '',
          width: 1080,
          height: 1350,
          alt: product.title,
        },
      ],
      siteName: 'Dude Menswear',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [product.images[0] || ''],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  }
}

/**
 * SEO utility functions for generating structured data and meta tags
 */

interface Product {
  id: string
  title: string
  description?: string
  price: number
  images: string[]
  handle?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
}

/**
 * Generate JSON-LD structured data for a product
 */
export function generateProductSchema(product: Product) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dudemenswear.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || '',
    image: product.images,
    url: `${baseUrl}/products/${product.handle || product.id}`,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: `${baseUrl}/products/${product.handle || product.id}`,
    },
    brand: {
      '@type': 'Brand',
      name: 'Dude Menswear',
    },
  }
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dudemenswear.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dude Menswear',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Premium streetwear and fashion for men',
    sameAs: [
      'https://instagram.com/dudemenswear',
      'https://facebook.com/dudemenswear',
      'https://twitter.com/dudemenswear',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91-98765-43210',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  }
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dudemenswear.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

/**
 * Generate JSON-LD structured data for website search
 */
export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dudemenswear.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dude Menswear',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

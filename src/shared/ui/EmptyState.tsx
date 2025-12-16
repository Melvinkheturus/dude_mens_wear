import Link from "next/link"
import { ShoppingBag, Search, Package } from "lucide-react"

interface EmptyStateProps {
  type?: 'products' | 'search' | 'category' | 'wishlist' | 'cart' | 'orders'
  title?: string
  description?: string
  actionText?: string
  actionHref?: string
  query?: string
  category?: string
}

export default function EmptyState({ 
  type = 'products',
  title,
  description,
  actionText,
  actionHref,
  query,
  category
}: EmptyStateProps) {
  // Default configurations for different types
  const configs = {
    products: {
      icon: Package,
      title: "No products available",
      description: "We're working on adding new products. Check back soon!",
      actionText: "Browse Categories",
      actionHref: "/collections/all"
    },
    search: {
      icon: Search,
      title: "No results found",
      description: query ? `We couldn't find anything for "${query}"` : "Try adjusting your search terms",
      actionText: "Browse All Products",
      actionHref: "/collections/all"
    },
    category: {
      icon: Package,
      title: "Category is empty",
      description: category ? `No products available in ${category} category` : "This category is currently empty",
      actionText: "Browse All Products",
      actionHref: "/collections/all"
    },
    wishlist: {
      icon: ShoppingBag,
      title: "Your wishlist is empty",
      description: "Save items you love to your wishlist and shop them later",
      actionText: "Start Shopping",
      actionHref: "/collections/all"
    },
    cart: {
      icon: ShoppingBag,
      title: "Your cart is empty",
      description: "Add some products to your cart to get started",
      actionText: "Continue Shopping",
      actionHref: "/collections/all"
    },
    orders: {
      icon: Package,
      title: "No orders yet",
      description: "When you place your first order, it will appear here",
      actionText: "Start Shopping",
      actionHref: "/collections/all"
    }
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 rounded-full bg-gray-100 p-6">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      
      <h2 className="mb-3 font-heading text-2xl font-medium text-gray-900">
        {title || config.title}
      </h2>
      
      <p className="mb-8 max-w-md font-body text-gray-600">
        {description || config.description}
      </p>
      
      <Link
        href={actionHref || config.actionHref}
        className="inline-block rounded-full bg-red-600 px-8 py-3 font-heading text-sm tracking-wider text-white transition-colors hover:bg-black"
      >
        {actionText || config.actionText}
      </Link>
    </div>
  )
}
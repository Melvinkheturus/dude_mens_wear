"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

type ProductCardProps = {
  product: {
    id: string
    handle: string
    title: string
    thumbnail: string
    description?: string
    created_at: string
    variants: Array<{
      prices: Array<{
        amount: number
        currency_code: string
      }>
      calculated_price?: number
      original_price?: number
      inventory_quantity?: number
    }>
    metadata?: {
      badge?: string
      stock?: number
      sold_count?: number
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [isCartHovered, setIsCartHovered] = useState(false)

  // Price calculations - Always show discount
  const originalPrice = product.variants[0]?.original_price || product.variants[0]?.prices[0]?.amount || 99900
  const currentPrice = product.variants[0]?.calculated_price || Math.floor(originalPrice * 0.6) // 40% off
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)

  // Badge logic - Show only ONE badge
  const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const soldCount = product.metadata?.sold_count || 0
  // Get actual inventory from first variant, fallback to metadata, then default to 100
  const stockCount = product.variants[0]?.inventory_quantity ?? product.metadata?.stock ?? 100
  
  let badge = null
  let badgeColor = "bg-red-600"

  if (isNew) {
    badge = "NEW"
    badgeColor = "bg-red-600"
  } else if (discountPercent >= 40) {
    badge = `${discountPercent}% OFF`
    badgeColor = "bg-red-600"
  } else if (soldCount > 5000) {
    badge = "BESTSELLER"
    badgeColor = "bg-black"
  } else if (stockCount > 0 && stockCount < 20) {
    badge = "LOW STOCK"
    badgeColor = "bg-red-600"
  }

  // Short description
  const shortDesc = product.description?.slice(0, 50) || "Premium cotton • 180 GSM • S–XXL"

  // Use product thumbnail or placeholder
  const imageUrl = product.thumbnail || '/images/placeholder-product.jpg'

  return (
    <div className="group relative">
      <Link href={`/products/${product.handle}`} className="block">
        {/* Image Container - Portrait aspect ratio */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badge - Top Left */}
          {badge && (
            <span className={`absolute left-3 top-3 rounded-full ${badgeColor} px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white`}>
              {badge}
            </span>
          )}

          {/* Favorite Icon - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-all ${
              isWishlisted 
                ? "bg-red-600 text-white" 
                : "bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content - Separated from image */}
        <div className="mt-3">
          {/* Product Title - 18px bold */}
          <h3 className="line-clamp-2 font-body !text-[18px] !font-bold !leading-tight !text-black transition-colors duration-200 group-hover:!text-red-600">
            {product.title}
          </h3>

          {/* Description */}
          <p className="mt-1 text-xs text-gray-600">
            {shortDesc}
          </p>

          {/* Star Rating */}
          <div className="mt-1.5 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-gray-500">(4.5)</span>
          </div>

          {/* Price with Expandable Cart Button */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-black">
                ₹{(currentPrice / 100).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{(originalPrice / 100).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-red-600">
                ({discountPercent}% OFF)
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                if (isInCart) {
                  // Navigate to cart
                  window.location.href = '/cart'
                } else {
                  // Add to cart
                  setIsInCart(true)
                }
              }}
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
              className={`flex items-center justify-center gap-2 overflow-hidden rounded-full transition-all ${
                isInCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-200 hover:bg-red-600"
              } ${isCartHovered ? "w-auto px-3" : "w-8"} h-8`}
              aria-label={isInCart ? "View in cart" : "Add to cart"}
            >
              <ShoppingCart className={`h-4 w-4 flex-shrink-0 transition-colors ${
                isInCart ? "text-white" : isCartHovered ? "text-white" : "text-red-600"
              }`} />
              {isCartHovered && (
                <span className={`whitespace-nowrap text-xs font-medium transition-colors ${
                  isInCart ? "text-white" : "text-white"
                }`}>
                  {isInCart ? "View in Cart" : "Add to Cart"}
                </span>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

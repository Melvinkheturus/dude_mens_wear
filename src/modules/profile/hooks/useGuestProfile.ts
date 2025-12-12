/**
 * Shared hook for guest profile functionality
 * Consolidates logic used by both mobile and desktop guest views
 */

import { useState, useEffect } from 'react'
import { getBestsellers, type DemoProduct } from '@/lib/demo-data'
import { useWishlist } from '@/hooks/useWishlist'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

export function useGuestProfile(productCount: number = 6) {
  const [trackingData, setTrackingData] = useState({
    email: '',
    orderNumber: '',
  })
  const [fallbackProducts, setFallbackProducts] = useState<DemoProduct[]>([])

  const { wishlist: userWishlist, count: wishlistCount } = useWishlist()
  const { recentlyViewed: userRecentlyViewed, count: recentlyViewedCount } = useRecentlyViewed()

  // Fetch fallback products from demo data
  useEffect(() => {
    async function fetchFallbackProducts() {
      const products = getBestsellers(productCount)
      setFallbackProducts(products)
    }
    fetchFallbackProducts()
  }, [productCount])

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement order tracking API integration
    // This would call your backend API to track the order
  }

  // Transform wishlist items to product format
  const wishlistProducts = userWishlist.length > 0 
    ? userWishlist.slice(0, Math.floor(productCount / 2)).map(item => ({
        id: item.id,
        title: item.name,
        images: [item.image],
        slug: item.slug,
        description: '',
        price: item.price,
        category: '',
        sizes: [],
        colors: [],
        inStock: true,
        isBestseller: false,
        isNewDrop: false
      }))
    : fallbackProducts.slice(0, Math.floor(productCount / 2))
  
  // Transform recently viewed items to product format
  const recentlyViewedProducts = userRecentlyViewed.length > 0
    ? userRecentlyViewed.slice(0, Math.floor(productCount / 2)).map(item => ({
        id: item.id,
        title: item.name,
        images: [item.image],
        slug: item.slug,
        description: '',
        price: item.price,
        category: '',
        sizes: [],
        colors: [],
        inStock: true,
        isBestseller: false,
        isNewDrop: false
      }))
    : fallbackProducts.slice(Math.floor(productCount / 2), productCount)

  return {
    trackingData,
    setTrackingData,
    handleTrackOrder,
    wishlistProducts,
    recentlyViewedProducts,
    wishlistCount,
    recentlyViewedCount,
  }
}

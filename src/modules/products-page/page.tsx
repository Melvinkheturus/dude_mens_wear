"use client"

import { useEffect, useState, Suspense } from "react"
import BannerCarousel from "./components/BannerCarousel"
import CategoryLite from "./components/CategoryLite"
import CategoryTitleBanner from "./components/CategoryTitleBanner"
import SidebarFilters from "./components/SidebarFilters"
import ProductGrid from "./components/ProductGrid"
import RelatedSearches from "./components/RelatedSearches"
import EmptyState from "./components/EmptyState"
import MinimalPagination from "./components/MinimalPagination"
import AppliedFiltersChips from "./components/AppliedFiltersChips"
import HorizontalProductScroll from "./components/HorizontalProductScroll"
import MobileFilterButton from "./components/MobileFilterButton"
import { FilterProvider } from "./context/FilterContext"
import { getNewDrops, getBestsellers, getAllProducts, getProductsByCategory, getCategoryBySlug } from "@/lib/demo-data"

interface ProductsPageProps {
  searchParams?: {
    q?: string
    page?: string
    sort?: string
  }
  category?: string
}

export default function ProductsPage({ searchParams, category }: ProductsPageProps) {
  const query = searchParams?.q?.trim() || undefined
  const page = searchParams?.page ? Number(searchParams.page) : 1

  // Detect Variant
  const isSearch = !!query
  const isCategory = !!category && !isSearch
  const isAllProducts = !isSearch && !isCategory

  // State for products
  const [products, setProducts] = useState<any[]>([])
  const [newDrops, setNewDrops] = useState<any[]>([])
  const [bestSellers, setBestSellers] = useState<any[]>([])
  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from demo data
  useEffect(() => {
    setLoading(true)
    try {
      let allProducts = getAllProducts()
      const newArrivals = getNewDrops(5)
      const bestsellers = getBestsellers(5)

      // Filter by category if specified
      if (category) {
        allProducts = getProductsByCategory(category)
      }

      // Filter by search query if specified
      if (query) {
        allProducts = allProducts.filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
      }

      setProducts(allProducts)
      setNewDrops(newArrivals)
      setBestSellers(bestsellers)
      
      // Mix of new drops and best sellers for trending (ensure unique products)
      const trendingCandidates = [
        ...newArrivals.slice(0, 3),
        ...bestsellers.slice(0, 2),
      ]
      
      // Remove duplicates by ID
      const uniqueTrending = trendingCandidates.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      )
      
      setTrendingProducts(uniqueTrending)
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }, [query, category, page])

  const total = products.length
  const hasMore = false // Implement pagination logic if needed
  const hasResults = products.length > 0

  return (
    <FilterProvider>
      {/* 1. ALL PRODUCTS VARIANT */}
      {isAllProducts && (
        <>
          <BannerCarousel />
          <CategoryLite />

          {/* Curated Product Sections - Horizontal Scroll */}
          <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
            <HorizontalProductScroll
              title="New Drops"
              products={newDrops}
              badge="NEW"
              badgeColor="red"
              viewAllLink="/collections/new-arrivals"
            />
            <HorizontalProductScroll
              title="Best Sellers"
              products={bestSellers}
              badge="BESTSELLER"
              badgeColor="black"
              viewAllLink="/collections/best-sellers"
            />
            <HorizontalProductScroll
              title="Trending Now"
              products={trendingProducts}
              badgeColor="red"
              viewAllLink="/collections/trending"
            />

            {/* Divider */}
            <div className="my-8 border-t-2 border-gray-200 md:my-12" />

            {/* All Products Title */}
            <h2 className="mb-4 font-heading text-2xl font-bold tracking-wide text-black md:mb-6 md:text-3xl">
              All Products
            </h2>

            {/* Mobile Filter Button - Below Title */}
            <div className="lg:hidden">
              <MobileFilterButton />
            </div>
          </section>
        </>
      )}

      {/* 2. CATEGORY VARIANT */}
      {isCategory && <CategoryTitleBanner handle={category} />}

      {/* 3. SEARCH VARIANT */}
      {isSearch && hasResults && <RelatedSearches query={query!} />}

      <section className={`mx-auto max-w-7xl px-4 pb-12 md:px-6 ${isAllProducts ? 'pt-4' : 'pt-12'}`}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-10 lg:gap-12">
            {/* Sidebar Filters – Show for all product lists (All Products, Category, Search) */}
            {hasResults && (
              <div className="hidden lg:block lg:w-64">
                <SidebarFilters />
              </div>
            )}

            {/* Main Content */}
            <div className={hasResults ? "flex-1" : "w-full"}>
              {hasResults ? (
                <>
                  {/* Product Count */}
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-body text-gray-600">
                      Showing {products.length} of {total} products
                    </p>
                  </div>

                  {/* Applied Filters Chips */}
                  <AppliedFiltersChips />

                  {/* Product Grid */}
                  <div className="mt-6">
                    <ProductGrid products={products} />
                  </div>

                  {/* Pagination */}
                  {hasMore && (
                    <Suspense fallback={<div className="mt-12 flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div></div>}>
                      <MinimalPagination current={page} total={4} />
                    </Suspense>
                  )}
                </>
              ) : (
                <EmptyState query={query} category={category} />
              )}
            </div>
          </div>
        )}
      </section>
    </FilterProvider>
  )
}

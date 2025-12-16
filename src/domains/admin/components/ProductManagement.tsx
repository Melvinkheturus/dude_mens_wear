'use client'

import { useState, useEffect } from 'react'
import { ProductGrid } from '@/domains/product'
import { Search, Plus, Filter, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface AdminProduct {
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
  status?: string
  stock?: number
}

export default function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data: productsData, error } = await supabase
        .from('products')
        .select(`
          *,
          product_variants (
            id,
            size,
            color,
            price,
            original_price,
            stock_quantity
          ),
          product_images (
            image_url,
            display_order
          ),
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      // Transform Supabase data to AdminProduct format
      const transformedProducts: AdminProduct[] = productsData?.map((product: any) => ({
        id: product.id,
        title: product.name,
        description: product.description || '',
        price: product.product_variants?.[0]?.price || 0,
        original_price: product.product_variants?.[0]?.original_price,
        images: product.product_images
          ?.sort((a: any, b: any) => a.display_order - b.display_order)
          ?.map((img: any) => img.image_url) || [],
        category_id: product.category_id,
        sizes: product.product_variants?.map((v: any) => v.size).filter((size: any) => size) || [],
        colors: product.product_variants?.map((v: any) => v.color).filter((color: any) => color) || [],
        in_stock: product.product_variants?.some((v: any) => v.stock_quantity > 0) || false,
        is_bestseller: product.is_featured || false,
        is_new_drop: new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        slug: product.slug,
        created_at: product.created_at,
        updated_at: product.updated_at,
        status: product.is_active ? 'active' : 'draft',
        stock: product.product_variants?.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) || 0
      })) || []

      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchProducts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">{products.length} products total</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="t-shirts">T-Shirts</option>
            <option value="pants">Pants</option>
            <option value="hoodies">Hoodies</option>
            <option value="shoes">Shoes</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Advanced Filters */}
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          <p className="text-xs text-green-600">+12% from last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
          <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'active').length}</p>
          <p className="text-xs text-green-600">Live products</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
          <p className="text-2xl font-bold text-orange-600">{products.filter(p => (p.stock || 0) < 30).length}</p>
          <p className="text-xs text-orange-600">Needs attention</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => (p.stock || 0) === 0).length}</p>
          <p className="text-xs text-gray-500">Needs restocking</p>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Products ({filteredProducts.length})</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>View:</span>
            <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Grid</button>
            <button className="px-2 py-1 hover:bg-gray-100 rounded">List</button>
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedStatus('all')
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
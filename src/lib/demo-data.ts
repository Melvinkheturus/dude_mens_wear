// Demo data for the storefront
export interface DemoProduct {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  isBestseller: boolean
  isNewDrop: boolean
  slug: string
}

export interface DemoCategory {
  id: string
  name: string
  slug: string
  image: string
  description: string
}

export const demoCategories: DemoCategory[] = [
  {
    id: "1",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "/images/categories/T-Shirt.png",
    description: "Premium cotton t-shirts for everyday comfort"
  },
  {
    id: "2", 
    name: "Shirts",
    slug: "shirts",
    image: "/images/categories/Shirts.png",
    description: "Formal and casual shirts for every occasion"
  },
  {
    id: "3",
    name: "Hoodies",
    slug: "hoodies", 
    image: "/images/categories/Hoodies.png",
    description: "Cozy hoodies for the perfect streetwear look"
  },
  {
    id: "4",
    name: "Cargos",
    slug: "cargos",
    image: "/images/categories/Cargos.png", 
    description: "Utility cargo pants with style and function"
  },
  {
    id: "5",
    name: "Track Pants",
    slug: "track-pants",
    image: "/images/categories/Track-Pant.png",
    description: "Comfortable track pants for active lifestyle"
  },
  {
    id: "6",
    name: "Shoes",
    slug: "shoes",
    image: "/images/categories/Shoes.png",
    description: "Trendy footwear to complete your look"
  }
]

export const demoProducts: DemoProduct[] = [
  // T-Shirts
  {
    id: "1",
    title: "Classic White Tee",
    description: "Premium 100% cotton white t-shirt with perfect fit and comfort",
    price: 899,
    originalPrice: 1299,
    images: ["/images/banners/tshirt.png"],
    category: "t-shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray"],
    inStock: true,
    isBestseller: true,
    isNewDrop: false,
    slug: "classic-white-tee"
  },
  {
    id: "2", 
    title: "Graphic Print Tee",
    description: "Trendy graphic print t-shirt made from soft cotton blend",
    price: 1199,
    images: ["/images/banners/tshirt.png"],
    category: "t-shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Maroon"],
    inStock: true,
    isBestseller: true,
    isNewDrop: true,
    slug: "graphic-print-tee"
  },
  
  // Shirts
  {
    id: "3",
    title: "Formal White Shirt", 
    description: "Crisp white formal shirt perfect for office and formal events",
    price: 1899,
    originalPrice: 2499,
    images: ["/images/banners/brown.png"],
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    inStock: true,
    isBestseller: true,
    isNewDrop: false,
    slug: "formal-white-shirt"
  },
  {
    id: "4",
    title: "Casual Check Shirt",
    description: "Comfortable casual check shirt for weekend outings",
    price: 1599,
    images: ["/images/banners/brown.png"],
    category: "shirts", 
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Red", "Green"],
    inStock: true,
    isBestseller: false,
    isNewDrop: true,
    slug: "casual-check-shirt"
  },

  // Hoodies
  {
    id: "5",
    title: "Premium Hoodie",
    description: "Ultra-soft premium hoodie with kangaroo pocket and adjustable hood",
    price: 2499,
    originalPrice: 3299,
    images: ["/images/categories/banner/Hoodies.png"],
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy", "Maroon"],
    inStock: true,
    isBestseller: true,
    isNewDrop: false,
    slug: "premium-hoodie"
  },
  {
    id: "6",
    title: "Zip-Up Hoodie",
    description: "Stylish zip-up hoodie perfect for layering",
    price: 2199,
    images: ["/images/categories/banner/Hoodies.png"],
    category: "hoodies",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Olive"],
    inStock: true,
    isBestseller: false,
    isNewDrop: true,
    slug: "zip-up-hoodie"
  },

  // Cargos
  {
    id: "7",
    title: "Tactical Cargo Pants",
    description: "Durable cargo pants with multiple pockets and comfortable fit",
    price: 2299,
    originalPrice: 2999,
    images: ["/images/categories/banner/Cargo-Pants.png"],
    category: "cargos",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Khaki", "Black", "Olive", "Brown"],
    inStock: true,
    isBestseller: true,
    isNewDrop: false,
    slug: "tactical-cargo-pants"
  },
  {
    id: "8",
    title: "Slim Fit Cargos",
    description: "Modern slim fit cargo pants for contemporary style",
    price: 1999,
    images: ["/images/categories/banner/Cargo-Pants.png"],
    category: "cargos",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Navy", "Khaki"],
    inStock: true,
    isBestseller: false,
    isNewDrop: true,
    slug: "slim-fit-cargos"
  },

  // Track Pants
  {
    id: "9",
    title: "Athletic Track Pants",
    description: "Comfortable track pants perfect for workouts and casual wear",
    price: 1499,
    originalPrice: 1999,
    images: ["/images/banners/group.png"],
    category: "track-pants",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray"],
    inStock: true,
    isBestseller: true,
    isNewDrop: false,
    slug: "athletic-track-pants"
  },
  {
    id: "10",
    title: "Jogger Track Pants",
    description: "Trendy jogger style track pants with tapered fit",
    price: 1699,
    images: ["/images/banners/group.png"],
    category: "track-pants",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Charcoal", "Olive"],
    inStock: true,
    isBestseller: false,
    isNewDrop: true,
    slug: "jogger-track-pants"
  },

  // Shoes
  {
    id: "11",
    title: "Casual Sneakers",
    description: "Comfortable casual sneakers for everyday wear",
    price: 3499,
    originalPrice: 4299,
    images: ["/images/banners/studio.png"],
    category: "shoes",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray"],
    inStock: true,
    isBestseller: true,
    isNewDrop: false,
    slug: "casual-sneakers"
  },
  {
    id: "12",
    title: "Sports Shoes",
    description: "High-performance sports shoes for active lifestyle",
    price: 4299,
    images: ["/images/banners/studio.png"],
    category: "shoes",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "Blue", "Red"],
    inStock: true,
    isBestseller: false,
    isNewDrop: true,
    slug: "sports-shoes"
  }
]

// Helper functions
export function getProductsByCategory(categorySlug: string): DemoProduct[] {
  return demoProducts.filter(product => product.category === categorySlug)
}

export function getBestsellers(limit?: number): DemoProduct[] {
  const bestsellers = demoProducts.filter(product => product.isBestseller)
  return limit ? bestsellers.slice(0, limit) : bestsellers
}

export function getNewDrops(limit?: number): DemoProduct[] {
  const newDrops = demoProducts.filter(product => product.isNewDrop)
  return limit ? newDrops.slice(0, limit) : newDrops
}

export function getProductBySlug(slug: string): DemoProduct | undefined {
  return demoProducts.find(product => product.slug === slug)
}

export function getProductById(id: string): DemoProduct | undefined {
  return demoProducts.find(product => product.id === id)
}

export function getAllProducts(): DemoProduct[] {
  return demoProducts
}

export function getCategoryBySlug(slug: string): DemoCategory | undefined {
  return demoCategories.find(category => category.slug === slug)
}

export interface DemoBanner {
  id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  buttonText?: string
}

export const demoBanners: DemoBanner[] = [
  {
    id: "1",
    title: "New Collection",
    subtitle: "Discover the latest trends in menswear",
    image: "/images/banners/brown.png",
    link: "/collections/new-drop",
    buttonText: "Shop Now"
  },
  {
    id: "2", 
    title: "Premium Quality",
    subtitle: "Crafted for the modern man",
    image: "/images/banners/group.png",
    link: "/collections/all",
    buttonText: "Explore"
  },
  {
    id: "3",
    title: "Studio Collection",
    subtitle: "Professional wear for every occasion",
    image: "/images/banners/studio.png",
    link: "/collections/shirts",
    buttonText: "View Collection"
  }
]

export function getBanners(): DemoBanner[] {
  return demoBanners
}

export function getAllCategories(): DemoCategory[] {
  return demoCategories
}
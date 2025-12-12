import ProductCard from "@/modules/homepage/components/ProductCard"
import { DemoProduct } from "@/lib/demo-data"

interface ProductGridProps {
  products: DemoProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          badge={product.isBestseller ? "BESTSELLER" : product.isNewDrop ? "NEW" : undefined}
          badgeColor={product.isBestseller ? "red" : "black"}
        />
      ))}
    </div>
  )
}

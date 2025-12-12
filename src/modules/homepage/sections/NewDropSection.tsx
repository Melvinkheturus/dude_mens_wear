import { Flame } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { getNewDrops } from "@/lib/demo-data"

export default function NewDropSection() {
  const products = getNewDrops(8)

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="flex items-center justify-center gap-2 font-heading text-4xl tracking-wider text-black md:text-5xl">
            NEW DROP <Flame className="h-8 w-8 text-brand-red md:h-10 md:w-10" />
          </h2>
          <p className="mt-4 font-body text-gray-800">
            Fresh styles just landed
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                badge="NEW"
                badgeColor="black"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No new products available yet.</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for fresh drops!</p>
          </div>
        )}
      </div>
    </section>
  )
}

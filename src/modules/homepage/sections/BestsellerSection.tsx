import ProductCard from "../components/ProductCard"
import { getBestsellers } from "@/lib/demo-data"

export default function BestsellerSection() {
  const products = getBestsellers(8)

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-4xl tracking-wider text-black md:text-5xl">
            BESTSELLERS
          </h2>
          <p className="mt-4 font-body text-gray-800">
            What everyone's buying
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                badge="BESTSELLER"
                badgeColor="red"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No bestsellers available yet.</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import ProductDetailPage from './ProductDetailPage'
import ProductHighlights from './sections/ProductHighlights'
import ProductReviews from './sections/ProductReviews'
import FrequentlyBoughtTogether from './sections/FrequentlyBoughtTogether'
import RelatedProducts from './sections/RelatedProducts'
import TrustBadges from './sections/TrustBadges'
import BottomNavbar from '@/components/layout/mobile/BottomNavbar'
import { DemoProduct } from '@/lib/demo-data'

interface ExtendedPDPProps {
  product: DemoProduct
  comboProducts?: DemoProduct[]
  relatedProducts?: DemoProduct[]
  reviews?: any[]
}

export default function PDP({
  product,
  comboProducts,
  relatedProducts,
  reviews,
}: ExtendedPDPProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  }

  return (
      <div className="min-h-screen">
        {/* Main Product Section with all core elements */}
        <ProductDetailPage product={product} />

      {/* Product Highlights */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
      >
        <ProductHighlights />
      </motion.div>

      {/* Frequently Bought Together */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <FrequentlyBoughtTogether 
          productId={product.id}
          currentProduct={{
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0],
          }}
        />
      </motion.div>

      {/* Testimonials/Reviews Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        <ProductReviews
          reviews={reviews}
          rating={4.5}
          totalReviews={128}
        />
      </motion.div>

      {/* Trust Badges - Before Similar Products */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
      >
        <TrustBadges />
      </motion.div>

      {/* Similar Products */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      >
        <RelatedProducts products={relatedProducts} />
      </motion.div>

        {/* Bottom Navbar for Mobile */}
        <BottomNavbar />
      </div>
  )
}

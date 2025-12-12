'use client'

import MobileProductView from './components/MobileProductView'
import DesktopProductView from './components/DesktopProductView'

import { DemoProduct } from '@/lib/demo-data'

interface ProductDetailPageProps {
  product: DemoProduct
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  return (
    <>
      <MobileProductView product={product} />
      <DesktopProductView product={product} />
    </>
  )
}

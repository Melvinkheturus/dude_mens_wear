import { Metadata } from "next"
import ProductsPage from "@/modules/products-page/page"

export const metadata: Metadata = {
  title: "All Products | Dude Mens Wear",
  description: "Browse our complete collection of premium menswear",
}

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>
}) {
  const resolvedSearchParams = await searchParams
  return <ProductsPage searchParams={resolvedSearchParams} />
}

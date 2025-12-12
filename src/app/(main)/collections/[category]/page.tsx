import { Metadata } from "next"
import ProductsPage from "@/modules/products-page/page"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const title = category.replace(/-/g, " ")
  return {
    title: `${title.charAt(0).toUpperCase() + title.slice(1)} | Dude Mens Wear`,
    description: `Shop our ${title} collection`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { category } = await params
  const resolvedSearchParams = await searchParams
  return <ProductsPage searchParams={resolvedSearchParams} category={category} />
}

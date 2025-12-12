import Link from "next/link"

interface EmptyStateProps {
  query?: string
  category?: string
}

export default function EmptyState({ query, category }: EmptyStateProps) {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto mb-8 text-8xl">😔</div>
      <h2 className="mb-4 font-heading text-4xl font-medium">
        No products found
      </h2>
      <p className="mb-8 font-body text-gray-600">
        {query
          ? `We couldn't find anything for "${query}"`
          : category
          ? "This category is currently empty"
          : "No products available"}
      </p>
      <Link
        href="/collections/all"
        className="inline-block rounded-full bg-red-600 px-8 py-4 font-heading tracking-wider text-white transition-colors hover:bg-black"
      >
        Browse All Products
      </Link>
    </div>
  )
}

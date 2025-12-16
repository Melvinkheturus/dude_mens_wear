import EmptyState from "@/shared/ui/EmptyState"

interface ProductEmptyStateProps {
  query?: string
  category?: string
}

export default function ProductEmptyState({ query, category }: ProductEmptyStateProps) {
  if (query) {
    return <EmptyState type="search" query={query} />
  }
  
  if (category) {
    return <EmptyState type="category" category={category} />
  }
  
  return <EmptyState type="products" />
}

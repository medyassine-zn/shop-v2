import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '../common/Skeletons'
import { EmptyState, ErrorMessage } from '../common/States'
import { PackageSearch } from 'lucide-react'

export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onRetry,
  columns = '2 sm:grid-cols-3 lg:grid-cols-4',
  emptyTitle = 'Aucun produit',
  emptyDescription = 'Aucun produit disponible pour le moment.',
}) {
  if (loading) return <ProductGridSkeleton count={8} />

  if (error) return <ErrorMessage message={error} onRetry={onRetry} />

  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={PackageSearch}
      />
    )
  }

  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

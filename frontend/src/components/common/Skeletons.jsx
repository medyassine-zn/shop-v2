export const ProductCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="aspect-square skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-3 skeleton w-1/3 rounded" />
      <div className="h-4 skeleton w-3/4 rounded" />
      <div className="h-4 skeleton w-1/2 rounded" />
      <div className="flex justify-between items-center pt-3">
        <div className="h-6 skeleton w-1/4 rounded" />
        <div className="w-9 h-9 skeleton rounded-xl" />
      </div>
    </div>
  </div>
)

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
    <div className="aspect-square skeleton rounded-2xl" />
    <div className="space-y-4 py-4">
      <div className="h-4 skeleton w-1/4 rounded" />
      <div className="h-8 skeleton w-3/4 rounded" />
      <div className="h-4 skeleton w-full rounded" />
      <div className="h-4 skeleton w-2/3 rounded" />
      <div className="h-10 skeleton w-1/3 rounded" />
      <div className="h-12 skeleton rounded-xl" />
    </div>
  </div>
)

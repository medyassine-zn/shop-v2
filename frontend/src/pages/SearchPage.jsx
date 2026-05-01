import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import API from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/common/Skeletons'
import { EmptyState, ErrorMessage } from '../components/common/States'
import Pagination from '../components/common/Pagination'
import SEOHead from '../components/common/SEOHead'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'popular', label: 'Popularité' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'newest'
  const popular = searchParams.get('popular') || ''
  const page = Number(searchParams.get('page') || 1)

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries())
    if (value) params[key] = value
    else delete params[key]
    params.page = '1'
    setSearchParams(params)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ sort, page, limit: 12 })
      if (q) params.set('search', q)
      if (category !== 'all') params.set('category', category)
      if (popular) params.set('popular', popular)

      const res = await API.get(`/api/products?${params}`)
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [q, category, sort, popular, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    API.get('/api/products/categories')
      .then(res => setCategories(res.data.categories))
      .catch(() => {})
  }, [])

  const clearSearch = () => {
    setSearchParams({})
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      <SEOHead title={q ? `Recherche: ${q}` : 'Catalogue'} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">
            {q ? `Résultats pour "${q}"` : popular ? 'Produits populaires' : category !== 'all' ? category : 'Catalogue'}
          </h1>
          {!loading && (
            <p className="text-sm text-ink-500 mt-1">{total} produit{total !== 1 ? 's' : ''}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={sort}
            onChange={e => updateParam('sort', e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary py-2 text-sm gap-2 sm:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters (desktop always visible, mobile toggle) */}
        <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-52 shrink-0 space-y-6`}>
          <div className="card p-4">
            <h3 className="font-medium text-sm text-ink-700 mb-3 uppercase tracking-wide">Catégories</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    category === 'all' ? 'bg-accent text-white font-medium' : 'hover:bg-ink-100 text-ink-700'
                  }`}
                >
                  Toutes
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => updateParam('category', cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      category === cat ? 'bg-accent text-white font-medium' : 'hover:bg-ink-100 text-ink-700'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {(q || category !== 'all' || popular) && (
            <button onClick={clearSearch} className="btn-ghost w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
              <X className="w-4 h-4" /> Réinitialiser
            </button>
          )}
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <EmptyState
              title="Aucun produit trouvé"
              description="Essayez de modifier vos critères de recherche."
              icon={Search}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              <Pagination
                currentPage={page}
                totalPages={pages}
                onPageChange={(p) => setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: p })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

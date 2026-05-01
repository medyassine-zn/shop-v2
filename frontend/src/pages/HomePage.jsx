import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, Grid3x3, Sparkles } from 'lucide-react'
import API from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/common/Skeletons'
import { ErrorMessage } from '../components/common/States'
import { useSettings } from '../context/SettingsContext'
import SEOHead from '../components/common/SEOHead'

export default function HomePage() {
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [popularProducts, setPopularProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popRes, newRes, catRes] = await Promise.all([
          API.get('/api/products?popular=true&limit=4'),
          API.get('/api/products?sort=newest&limit=8'),
          API.get('/api/products/categories'),
        ])
        setPopularProducts(popRes.data.products)
        setNewProducts(newRes.data.products)
        setCategories(catRes.data.categories)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="animate-fade-in">
      <SEOHead />
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #e8470a 0%, transparent 60%)' }}
        />
        <div className="page-container py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 badge bg-white/10 text-white/80 mb-6 py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs">Nouveaux produits chaque semaine</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              {settings.storeName}
              <span className="block text-accent mt-1">Boutique en ligne</span>
            </h1>
            <p className="text-ink-300 text-lg mb-8 leading-relaxed max-w-lg">
              {settings.storeDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/search" className="btn-primary">
                Découvrir le catalogue <ArrowRight className="w-4 h-4" />
              </Link>
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary border-white/20 text-white hover:bg-white/10"
                >
                  Commander via WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="page-container py-10">
          <div className="flex items-center gap-2 mb-6">
            <Grid3x3 className="w-5 h-5 text-accent" />
            <h2 className="section-title text-xl">Catégories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/search')}
              className="btn-secondary text-sm py-2 px-4"
            >
              Tout voir
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                className="btn-ghost text-sm py-2 px-4 border border-ink-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Popular products */}
      {(loading || popularProducts.length > 0) && (
        <section className="page-container py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="section-title text-xl">Produits populaires</h2>
            </div>
            <Link to="/search?popular=true" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 skeleton rounded w-1/2" />
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-5 skeleton rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {popularProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>
      )}

      {/* New arrivals */}
      <section className="page-container py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-xl">Nouveautés</h2>
          <Link to="/search?sort=newest" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}

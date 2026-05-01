import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Package, TrendingUp } from 'lucide-react'
import API from '../../utils/api'
import { useSettings } from '../../context/SettingsContext'
import { Spinner, EmptyState } from '../../components/common/States'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function AdminProducts() {
  const { settings } = useSettings()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: 100 })
      if (search) params.set('search', search)
      const res = await API.get(`/api/products?${params}`)
      setProducts(res.data.products)
    } catch (err) {
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ?`)) return
    setDeleting(id)
    try {
      await API.delete(`/api/products/${id}`)
      setProducts(ps => ps.filter(p => p._id !== id))
      toast.success('Produit supprimé')
    } catch (err) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Produits</h1>
          <p className="text-ink-500 text-sm mt-1">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary gap-2 self-start">
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="input pl-10"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <EmptyState title="Aucun produit" description="Ajoutez votre premier produit." icon={Package} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 border-b border-ink-100">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium">Produit</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium hidden sm:table-cell">Catégorie</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium">Prix</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium hidden md:table-cell">Stock</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {products.map(product => {
                  const imageUrl = product.images?.[0]
                    ? product.images[0].startsWith('http') ? product.images[0] : `${API_URL}${product.images[0]}`
                    : null
                  return (
                    <tr key={product._id} className="hover:bg-ink-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink-100 shrink-0">
                            {imageUrl ? (
                              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <Package className="w-5 h-5 text-ink-300 m-auto mt-2.5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-ink-900 line-clamp-1">{product.name}</div>
                            {product.isPopular && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
                                <TrendingUp className="w-2.5 h-2.5" /> Populaire
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-500 hidden sm:table-cell">{product.category}</td>
                      <td className="px-4 py-3 text-right font-display font-semibold">
                        {product.price.toFixed(2)}{settings.currencySymbol}
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className={`badge ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 rounded-lg hover:bg-ink-100 text-ink-500 hover:text-ink-900 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deleting === product._id}
                            className="p-2 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {deleting === product._id ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

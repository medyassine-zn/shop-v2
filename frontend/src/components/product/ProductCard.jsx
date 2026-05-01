import { Link } from 'react-router-dom'
import { ShoppingCart, Star, TrendingUp } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useSettings } from '../../context/SettingsContext'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { settings } = useSettings()

  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http') ? product.images[0] : `${API_URL}${product.images[0]}`
    : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} ajouté au panier !`)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <Link to={`/product/${product._id}`} className="group card hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-ink-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-ink-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isPopular && (
            <span className="badge bg-amber-100 text-amber-700">
              <TrendingUp className="w-3 h-3" /> Populaire
            </span>
          )}
          {discount && (
            <span className="badge bg-accent text-white">-{discount}%</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-accent font-medium uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-display font-semibold text-ink-900 text-sm leading-snug line-clamp-2 mb-2 flex-1">
          {product.name}
        </h3>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs text-ink-500">{product.rating.toFixed(1)} ({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink-100">
          <div>
            <span className="font-display font-bold text-ink-900 text-lg">
              {product.price.toFixed(2)}{settings.currencySymbol}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-ink-400 line-through ml-1.5">
                {product.originalPrice.toFixed(2)}{settings.currencySymbol}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 flex items-center justify-center bg-ink-950 text-white rounded-xl hover:bg-accent active:scale-90 transition-all duration-150"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}

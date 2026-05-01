import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { EmptyState } from '../components/common/States'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart()
  const { settings } = useSettings()

  if (items.length === 0) {
    return (
      <div className="page-container py-16 animate-fade-in">
        <EmptyState
          title="Votre panier est vide"
          description="Explorez notre catalogue et ajoutez des produits."
          icon={ShoppingCart}
        />
        <div className="flex justify-center mt-6">
          <Link to="/search" className="btn-primary">Voir les produits</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Panier ({items.length})</h1>
        <button onClick={clearCart} className="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
          <Trash2 className="w-4 h-4" /> Vider
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            const imageUrl = item.images?.[0]
              ? item.images[0].startsWith('http') ? item.images[0] : `${API_URL}${item.images[0]}`
              : null

            return (
              <div key={item._id} className="card p-4 flex gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-ink-100 shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-ink-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`} className="font-display font-semibold text-ink-900 text-sm leading-snug hover:text-accent transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-xs text-ink-400 mt-0.5">{item.category}</p>

                  <div className="flex items-center justify-between mt-3 gap-4">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 bg-ink-100 rounded-xl p-1">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-ink-900">
                        {(item.price * item.quantity).toFixed(2)}{settings.currencySymbol}
                      </span>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-display font-semibold text-lg mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm text-ink-600">
                  <span className="truncate pr-2">{item.name} ×{item.quantity}</span>
                  <span className="shrink-0 font-medium">{(item.price * item.quantity).toFixed(2)}{settings.currencySymbol}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-100 pt-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-ink-700">Total</span>
                <span className="font-display font-bold text-2xl text-ink-900">
                  {totalPrice.toFixed(2)}{settings.currencySymbol}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full justify-center py-3.5 text-base">
              Commander <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/search" className="btn-ghost w-full justify-center text-sm mt-2">
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

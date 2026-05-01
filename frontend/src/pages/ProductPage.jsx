import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, ArrowLeft, Star, TrendingUp, MessageCircle,
  Minus, Plus, Package, CheckCircle
} from 'lucide-react'
import API from '../utils/api'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { ProductDetailSkeleton } from '../components/common/Skeletons'
import { ErrorMessage } from '../components/common/States'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, updateQty, items } = useCart()
  const { settings } = useSettings()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)

  const cartItem = items.find(i => i._id === id)

  useEffect(() => {
    setLoading(true)
    API.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data.product)
        setSelectedImage(0)
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
    toast.success(`${qty}x ${product.name} ajouté au panier !`)
  }

  const whatsappMessage = product
    ? encodeURIComponent(`Bonjour ! Je suis intéressé par le produit : ${product.name} (${product.price}${settings.currencySymbol})`)
    : ''

  if (loading) return <div className="page-container py-8"><ProductDetailSkeleton /></div>
  if (error) return <div className="page-container py-16"><ErrorMessage message={error} onRetry={() => window.location.reload()} /></div>
  if (!product) return null

  const images = product.images?.length > 0 ? product.images : []
  const currentImage = images[selectedImage]
  const imageUrl = currentImage
    ? currentImage.startsWith('http') ? currentImage : `${API_URL}${currentImage}`
    : null

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="page-container py-6 md:py-10 animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm gap-2 mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-ink-100">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-ink-300" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => {
                const url = img.startsWith('http') ? img : `${API_URL}${img}`
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-accent' : 'border-transparent hover:border-ink-200'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="py-2 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-accent/10 text-accent text-xs">{product.category}</span>
              {product.isPopular && (
                <span className="badge bg-amber-100 text-amber-700 text-xs">
                  <TrendingUp className="w-3 h-3" /> Populaire
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}`} />
                ))}
              </div>
              <span className="text-sm text-ink-500">{product.rating.toFixed(1)} ({product.reviewCount} avis)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-ink-900">
              {product.price.toFixed(2)}{settings.currencySymbol}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-ink-400 line-through text-lg">{product.originalPrice.toFixed(2)}{settings.currencySymbol}</span>
                <span className="badge bg-accent text-white">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-ink-600 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-700 font-medium">En stock ({product.stock} disponibles)</span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Rupture de stock</span>
            )}
          </div>

          {/* Qty + CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink-700">Quantité :</span>
              <div className="flex items-center gap-2 bg-ink-100 rounded-xl p-1">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-medium text-sm">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItem ? 'Ajouter encore' : 'Ajouter au panier'}
              </button>

              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary flex-1 py-3.5 gap-2 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              )}
            </div>

            {cartItem && (
              <div className="flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 rounded-xl text-sm text-accent">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{cartItem.quantity}x dans votre panier — <Link to="/cart" className="font-medium underline">Voir le panier</Link></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

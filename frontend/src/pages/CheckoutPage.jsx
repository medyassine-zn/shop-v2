import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, User, Phone, MapPin, Mail, MessageSquare } from 'lucide-react'
import API from '../utils/api'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { Spinner } from '../components/common/States'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', notes: ''
  })
  const [errors, setErrors] = useState({})

  if (items.length === 0) {
    return (
      <div className="page-container py-16 text-center animate-fade-in">
        <ShoppingBag className="w-16 h-16 text-ink-300 mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold mb-2">Panier vide</h2>
        <p className="text-ink-500 mb-6">Ajoutez des produits avant de commander.</p>
        <Link to="/search" className="btn-primary">Voir les produits</Link>
      </div>
    )
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Le nom est requis'
    if (!form.phone.trim()) errs.phone = 'Le téléphone est requis'
    if (!form.address.trim()) errs.address = "L'adresse est requise"
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Email invalide'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        customer: { name: form.name, phone: form.phone, email: form.email, address: form.address },
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        notes: form.notes,
      }
      const res = await API.post('/api/orders', payload)
      if (res.data.success) {
        clearCart()
        navigate('/order-success', { state: { order: res.data.order } })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm gap-2 mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Retour au panier
      </button>

      <h1 className="section-title mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" /> Vos informations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom complet *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Jean Dupont" className={`input pl-10 ${errors.name ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label">Téléphone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+33 6 12 34 56 78" className={`input pl-10 ${errors.phone ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="label">Email (optionnel)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="jean@example.com" className={`input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Adresse de livraison *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-ink-400" />
                <textarea
                  name="address" value={form.address} onChange={handleChange}
                  placeholder="Rue, ville, code postal, pays..."
                  rows={3}
                  className={`input pl-10 resize-none ${errors.address ? 'border-red-400 focus:ring-red-200' : ''}`}
                />
              </div>
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="mt-4">
              <label className="label">Notes (optionnel)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-ink-400" />
                <textarea
                  name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Instructions de livraison, horaires préférés..."
                  rows={2}
                  className="input pl-10 resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base justify-center"
          >
            {loading ? <><Spinner size="sm" /> Envoi en cours...</> : <><ShoppingBag className="w-5 h-5" /> Confirmer la commande</>}
          </button>
        </form>

        {/* Order summary */}
        <div className="card p-5 h-fit sticky top-20">
          <h2 className="font-display font-semibold text-lg mb-4">Votre commande</h2>
          <div className="space-y-3 mb-5">
            {items.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-ink-600 truncate pr-2">{item.name} ×{item.quantity}</span>
                <span className="font-medium shrink-0">{(item.price * item.quantity).toFixed(2)}{settings.currencySymbol}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink-100 pt-4">
            <div className="flex justify-between items-baseline">
              <span className="font-medium">Total</span>
              <span className="font-display font-bold text-2xl">{totalPrice.toFixed(2)}{settings.currencySymbol}</span>
            </div>
            <p className="text-xs text-ink-400 mt-2">Paiement à la livraison</p>
          </div>
        </div>
      </div>
    </div>
  )
}

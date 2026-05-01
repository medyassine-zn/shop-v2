import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Home, MessageCircle } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function OrderSuccessPage() {
  const { state } = useLocation()
  const { settings } = useSettings()
  const order = state?.order

  const whatsappMessage = order
    ? encodeURIComponent(`Bonjour ! J'ai passé une commande (${order.orderNumber}). Pouvez-vous confirmer ?`)
    : ''

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="font-display text-3xl font-bold text-ink-900 mb-3">
          Commande confirmée !
        </h1>
        <p className="text-ink-500 mb-2">
          Merci pour votre commande. Nous vous contacterons bientôt pour confirmer la livraison.
        </p>

        {order && (
          <div className="card p-5 my-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Numéro de commande</span>
              <span className="font-mono font-bold text-accent">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Client</span>
              <span className="font-medium">{order.customer?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Téléphone</span>
              <span className="font-medium">{order.customer?.phone}</span>
            </div>
            <div className="border-t border-ink-100 pt-3 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-display font-bold text-lg">{order.totalAmount?.toFixed(2)}{settings.currencySymbol}</span>
            </div>
          </div>
        )}

        {order?.customer?.email && (
          <p className="text-sm text-ink-500 mb-6">
            Un email de confirmation a été envoyé à <strong>{order.customer.email}</strong>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary gap-2">
            <Home className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <Link to="/search" className="btn-secondary gap-2">
            <ShoppingBag className="w-4 h-4" /> Continuer les achats
          </Link>
          {settings.whatsappNumber && (
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary gap-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

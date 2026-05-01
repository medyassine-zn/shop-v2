import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Store, MessageCircle } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="bg-ink-950 text-ink-300 mt-16">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-white">{settings.storeName}</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-400">{settings.storeDescription}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/search" className="text-sm hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link to="/cart" className="text-sm hover:text-white transition-colors">Panier</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              {settings.contactPhone && (
                <li className="flex items-start gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition-colors">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.whatsappNumber && (
                <li className="flex items-start gap-2.5 text-sm">
                  <MessageCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li className="flex items-start gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} {settings.storeName}. Tous droits réservés.</p>
          <Link to="/admin" className="text-xs text-ink-600 hover:text-ink-400 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}

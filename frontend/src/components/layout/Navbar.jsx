import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, Store } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useSettings } from '../../context/SettingsContext'

export default function Navbar() {
  const { totalItems } = useCart()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-ink-100 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 bg-ink-950 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-xl text-ink-900 hidden sm:block">
              {settings.storeName}
            </span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="input pl-10 py-2.5 text-sm"
              />
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="btn-ghost text-sm py-2">Accueil</Link>
            <Link to="/search" className="btn-ghost text-sm py-2">Catalogue</Link>
          </nav>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-ink-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-ink-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-ink-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-ink-100 space-y-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="input pl-10 py-2.5 text-sm"
              />
            </form>
            <div className="flex flex-col gap-1">
              <Link to="/" className="btn-ghost justify-start text-sm" onClick={() => setMenuOpen(false)}>Accueil</Link>
              <Link to="/search" className="btn-ghost justify-start text-sm" onClick={() => setMenuOpen(false)}>Catalogue</Link>
              <Link to="/cart" className="btn-ghost justify-start text-sm" onClick={() => setMenuOpen(false)}>
                Panier {totalItems > 0 && <span className="badge bg-accent/10 text-accent">{totalItems}</span>}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

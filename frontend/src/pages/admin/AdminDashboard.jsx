import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, TrendingUp, Clock, ArrowRight, CheckCircle2, XCircle, Truck } from 'lucide-react'
import API from '../../utils/api'
import { useSettings } from '../../context/SettingsContext'
import { Spinner } from '../../components/common/States'

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'text-amber-600 bg-amber-50', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'text-blue-600 bg-blue-50', icon: CheckCircle2 },
  processing: { label: 'En traitement', color: 'text-purple-600 bg-purple-50', icon: Package },
  shipped: { label: 'Expédiée', color: 'text-indigo-600 bg-indigo-50', icon: Truck },
  delivered: { label: 'Livrée', color: 'text-green-600 bg-green-50', icon: CheckCircle2 },
  cancelled: { label: 'Annulée', color: 'text-red-600 bg-red-50', icon: XCircle },
}

export default function AdminDashboard() {
  const { settings } = useSettings()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/api/orders/stats')
      .then(res => { if (res.data.success) setStats(res.data.stats) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Spinner size="lg" />
    </div>
  )

  const statCards = [
    {
      label: 'Total commandes',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Chiffre d\'affaires',
      value: `${(stats?.totalRevenue ?? 0).toFixed(2)}${settings.currencySymbol}`,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Produits',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'En attente',
      value: stats?.ordersByStatus?.pending ?? 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-ink-500 text-sm mt-1">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="font-display text-2xl font-bold text-ink-900">{value}</div>
            <div className="text-xs text-ink-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      {stats?.ordersByStatus && (
        <div className="card p-5">
          <h2 className="font-display font-semibold mb-4">Commandes par statut</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const count = stats.ordersByStatus[key] || 0
              const Icon = config.icon
              return (
                <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${config.color}`}>
                  <Icon className="w-4 h-4" />
                  {config.label}: <strong>{count}</strong>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-ink-100">
          <h2 className="font-display font-semibold">Commandes récentes</h2>
          <Link to="/admin/orders" className="text-sm text-accent hover:underline flex items-center gap-1">
            Toutes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-ink-100">
          {!stats?.recentOrders?.length ? (
            <p className="text-sm text-ink-500 p-5">Aucune commande pour le moment.</p>
          ) : (
            stats.recentOrders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
              const Icon = cfg.icon
              return (
                <div key={order._id} className="flex items-center justify-between p-4 hover:bg-ink-50 transition-colors">
                  <div>
                    <div className="font-mono text-sm font-medium text-ink-900">{order.orderNumber}</div>
                    <div className="text-xs text-ink-500 mt-0.5">{order.customer?.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-sm">
                      {order.totalAmount?.toFixed(2)}{settings.currencySymbol}
                    </span>
                    <span className={`badge ${cfg.color} gap-1`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

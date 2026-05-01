import { useEffect, useState, useCallback } from 'react'
import { Search, ChevronDown, Eye, Trash2, Clock, CheckCircle2, XCircle, Truck, Package } from 'lucide-react'
import API from '../../utils/api'
import { useSettings } from '../../context/SettingsContext'
import { Spinner, EmptyState } from '../../components/common/States'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending:    { label: 'En attente',    color: 'bg-amber-100 text-amber-700',   icon: Clock },
  confirmed:  { label: 'Confirmée',     color: 'bg-blue-100 text-blue-700',     icon: CheckCircle2 },
  processing: { label: 'En traitement', color: 'bg-purple-100 text-purple-700', icon: Package },
  shipped:    { label: 'Expédiée',      color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  delivered:  { label: 'Livrée',        color: 'bg-green-100 text-green-700',   icon: CheckCircle2 },
  cancelled:  { label: 'Annulée',       color: 'bg-red-100 text-red-700',       icon: XCircle },
}

export default function AdminOrders() {
  const { settings } = useSettings()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: 50 })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await API.get(`/api/orders?${params}`)
      setOrders(res.data.orders)
    } catch (err) {
      toast.error('Erreur chargement commandes')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300)
    return () => clearTimeout(t)
  }, [fetchOrders])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)
    try {
      const res = await API.put(`/api/orders/${orderId}/status`, { status: newStatus })
      if (res.data.success) {
        setOrders(os => os.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        if (selectedOrder?._id === orderId) setSelectedOrder(o => ({ ...o, status: newStatus }))
        toast.success('Statut mis à jour')
      }
    } catch (err) {
      toast.error('Erreur mise à jour statut')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return
    try {
      await API.delete(`/api/orders/${id}`)
      setOrders(os => os.filter(o => o._id !== id))
      if (selectedOrder?._id === id) setSelectedOrder(null)
      toast.success('Commande supprimée')
    } catch {
      toast.error('Erreur suppression')
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Commandes</h1>
        <p className="text-ink-500 text-sm mt-1">{orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, numéro..." className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <EmptyState title="Aucune commande" description="Les commandes apparaîtront ici." />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Orders list */}
          <div className={`${selectedOrder ? 'xl:col-span-3' : 'xl:col-span-5'} card overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink-50 border-b border-ink-100">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium">Commande</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium hidden md:table-cell">Client</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium">Total</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium">Statut</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wide text-ink-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {orders.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                    const Icon = cfg.icon
                    return (
                      <tr
                        key={order._id}
                        className={`hover:bg-ink-50 transition-colors cursor-pointer ${selectedOrder?._id === order._id ? 'bg-accent/5' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-mono font-medium text-ink-900 text-xs">{order.orderNumber}</div>
                          <div className="text-xs text-ink-400 mt-0.5">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="font-medium text-ink-800">{order.customer?.name}</div>
                          <div className="text-xs text-ink-400">{order.customer?.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-display font-semibold text-ink-900">
                          {order.totalAmount?.toFixed(2)}{settings.currencySymbol}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <span className={`badge gap-1 text-xs ${cfg.color}`}>
                              <Icon className="w-3 h-3" />
                              <span className="hidden sm:inline">{cfg.label}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={e => { e.stopPropagation(); setSelectedOrder(order) }}
                              className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleDelete(order._id) }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* Order detail panel */}
          {selectedOrder && (
            <div className="xl:col-span-2 card p-5 space-y-5 h-fit animate-slide-up">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono font-bold text-ink-900">{selectedOrder.orderNumber}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{formatDate(selectedOrder.createdAt)}</div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="btn-ghost p-2"><XCircle className="w-4 h-4" /></button>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-xs uppercase tracking-wide text-ink-500 font-medium mb-2">Client</h3>
                <div className="bg-ink-50 rounded-xl p-3 space-y-1.5 text-sm">
                  <div><strong>{selectedOrder.customer?.name}</strong></div>
                  <div className="text-ink-500">{selectedOrder.customer?.phone}</div>
                  {selectedOrder.customer?.email && <div className="text-ink-500">{selectedOrder.customer?.email}</div>}
                  <div className="text-ink-600 text-xs">{selectedOrder.customer?.address}</div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs uppercase tracking-wide text-ink-500 font-medium mb-2">Produits</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-ink-700">{item.name} ×{item.quantity}</span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)}{settings.currencySymbol}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-ink-100 mt-3 pt-3 flex justify-between font-display font-bold">
                  <span>Total</span>
                  <span>{selectedOrder.totalAmount?.toFixed(2)}{settings.currencySymbol}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-ink-500 font-medium mb-1">Notes</h3>
                  <p className="text-sm text-ink-600 bg-amber-50 rounded-xl p-3">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status update */}
              <div>
                <h3 className="text-xs uppercase tracking-wide text-ink-500 font-medium mb-2">Statut</h3>
                <div className="relative">
                  <select
                    value={selectedOrder.status}
                    onChange={e => handleStatusChange(selectedOrder._id, e.target.value)}
                    disabled={updatingStatus === selectedOrder._id}
                    className="input appearance-none pr-8"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                  {updatingStatus === selectedOrder._id ? (
                    <Spinner size="sm" className="absolute right-3 top-1/2 -translate-y-1/2" />
                  ) : (
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { Clock, CheckCircle2, XCircle, Truck, Package } from 'lucide-react'

export const ORDER_STATUS = {
  pending:    { label: 'En attente',    color: 'bg-amber-100 text-amber-700',   icon: Clock },
  confirmed:  { label: 'Confirmée',     color: 'bg-blue-100 text-blue-700',     icon: CheckCircle2 },
  processing: { label: 'En traitement', color: 'bg-purple-100 text-purple-700', icon: Package },
  shipped:    { label: 'Expédiée',      color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  delivered:  { label: 'Livrée',        color: 'bg-green-100 text-green-700',   icon: CheckCircle2 },
  cancelled:  { label: 'Annulée',       color: 'bg-red-100 text-red-700',       icon: XCircle },
}

export default function StatusBadge({ status, showIcon = true }) {
  const cfg = ORDER_STATUS[status] || ORDER_STATUS.pending
  const Icon = cfg.icon

  return (
    <span className={`badge gap-1 text-xs font-medium ${cfg.color}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {cfg.label}
    </span>
  )
}

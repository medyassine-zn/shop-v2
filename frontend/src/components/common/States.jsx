import { AlertCircle, PackageSearch, RefreshCw } from 'lucide-react'

export const ErrorMessage = ({ message = 'Une erreur est survenue.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
      <AlertCircle className="w-7 h-7 text-red-500" />
    </div>
    <div>
      <h3 className="font-display font-semibold text-ink-900 mb-1">Erreur</h3>
      <p className="text-sm text-ink-500 max-w-sm">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-sm gap-2">
        <RefreshCw className="w-4 h-4" /> Réessayer
      </button>
    )}
  </div>
)

export const EmptyState = ({ title = 'Aucun résultat', description = '', icon: Icon = PackageSearch }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center">
      <Icon className="w-7 h-7 text-ink-400" />
    </div>
    <div>
      <h3 className="font-display font-semibold text-ink-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-sm">{description}</p>}
    </div>
  </div>
)

export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={`${sizes[size]} border-2 border-ink-200 border-t-accent rounded-full animate-spin`} />
  )
}

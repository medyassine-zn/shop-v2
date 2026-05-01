import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from '../../components/common/States'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Remplissez tous les champs')
      return
    }
    setLoading(true)
    try {
      const result = await login(form.username, form.password)
      if (result.success) {
        toast.success('Connexion réussie !')
        navigate('/admin')
      } else {
        toast.error(result.message || 'Identifiants incorrects')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-ink-400 text-sm mt-1">Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-ink-300">Nom d'utilisateur</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="admin"
              autoFocus
              className="input bg-white/5 border-white/10 text-white placeholder-ink-500 focus:border-accent"
            />
          </div>

          <div>
            <label className="label text-ink-300">Mot de passe</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="input bg-white/5 border-white/10 text-white placeholder-ink-500 focus:border-accent pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 justify-center mt-2">
            {loading ? <><Spinner size="sm" /> Connexion...</> : 'Se connecter'}
          </button>
        </form>

        <p className="text-xs text-ink-600 text-center mt-6">
          Identifiants par défaut : admin / admin123
        </p>
      </div>
    </div>
  )
}

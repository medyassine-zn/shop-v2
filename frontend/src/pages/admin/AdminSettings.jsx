import React, { useState, useEffect } from 'react'
import {
  Store, Phone, Mail, MapPin, MessageCircle, Bell, Globe,
  DollarSign, Lock, Eye, EyeOff, Save
} from 'lucide-react'
import API from '../../utils/api'
import { useSettings } from '../../context/SettingsContext'
import { Spinner } from '../../components/common/States'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { setSettings } = useSettings()
  const [form, setForm] = useState({
    storeName: '', storeDescription: '', contactPhone: '',
    contactEmail: '', address: '', whatsappNumber: '', notificationEmail: '',
    currency: '', currencySymbol: '', freeShippingThreshold: '',
    socialLinks: { facebook: '', instagram: '', twitter: '' },
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Password change
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await API.get('/api/settings')
      const s = res.data.settings

      setForm({
        storeName: s.storeName || '',
        storeDescription: s.storeDescription || '',
        contactPhone: s.contactPhone || '',
        contactEmail: s.contactEmail || '',
        address: s.address || '',
        whatsappNumber: s.whatsappNumber || '',
        notificationEmail: s.notificationEmail || '',
        currency: s.currency || 'EUR',
        currencySymbol: s.currencySymbol || '€',
        freeShippingThreshold: s.freeShippingThreshold?.toString() || '0',
        socialLinks: {
          facebook: s.socialLinks?.facebook || '',
          instagram: s.socialLinks?.instagram || '',
          twitter: s.socialLinks?.twitter || '',
        },
      })

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  fetchSettings()
}, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('social_')) {
      const key = name.replace('social_', '')
      setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: value } }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await API.put('/api/settings', {
        ...form,
        freeShippingThreshold: parseFloat(form.freeShippingThreshold) || 0,
      })
      if (res.data.success) {
        setSettings(res.data.settings)
        toast.success('Paramètres sauvegardés !')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (passForm.newPassword.length < 6) {
      toast.error('Mot de passe trop court (minimum 6 caractères)')
      return
    }
    setSavingPass(true)
    try {
      await API.put('/api/admin/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      })
      toast.success('Mot de passe modifié !')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally {
      setSavingPass(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const Section = React.memo(({ icon: Icon, title, children }) => (
    <div className="card p-6 space-y-4">
      <h2 className="font-semibold text-ink-800 flex items-center gap-2">
        <Icon className="w-4 h-4 text-accent" /> {title}
      </h2>
      {children}
    </div>
  ))

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Paramètres</h1>
        <p className="text-ink-500 text-sm mt-1">Configuration de votre boutique</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Section icon={Store} title="Informations de la boutique">
          <div>
            <label className="label">Nom de la boutique</label>
            <input name="storeName" value={form.storeName} onChange={handleChange} className="input" placeholder="MyShop" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} rows={2} className="input resize-none" />
          </div>
        </Section>

        <Section icon={Phone} title="Contact">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Téléphone</label>
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="input" placeholder="+33 1 23 45 67 89" />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp</label>
              <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="input" placeholder="+33612345678" />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email contact</label>
              <input name="contactEmail" value={form.contactEmail} onChange={handleChange} type="email" className="input" placeholder="contact@shop.com" />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-amber-500" /> Email notifications</label>
              <input name="notificationEmail" value={form.notificationEmail} onChange={handleChange} type="email" className="input" placeholder="admin@shop.com" />
              <p className="text-xs text-ink-400 mt-1">Reçoit les emails de nouvelles commandes</p>
            </div>
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Adresse</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="input resize-none" placeholder="123 Rue du Commerce, Paris" />
          </div>
        </Section>

        <Section icon={DollarSign} title="Devise & Livraison">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Devise</label>
              <input name="currency" value={form.currency} onChange={handleChange} className="input" placeholder="EUR" />
            </div>
            <div>
              <label className="label">Symbole</label>
              <input name="currencySymbol" value={form.currencySymbol} onChange={handleChange} className="input" placeholder="€" />
            </div>
            <div>
              <label className="label">Livraison gratuite dès (0 = jamais)</label>
              <input name="freeShippingThreshold" type="number" min="0" value={form.freeShippingThreshold} onChange={handleChange} className="input" />
            </div>
          </div>
        </Section>

        <Section icon={Globe} title="Réseaux sociaux">
          <div className="space-y-3">
            {['facebook', 'instagram', 'twitter'].map(net => (
              <div key={net}>
                <label className="label capitalize">{net}</label>
                <input name={`social_${net}`} value={form.socialLinks[net]} onChange={handleChange} className="input" placeholder={`https://${net}.com/votre-page`} />
              </div>
            ))}
          </div>
        </Section>

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3.5">
          {saving ? <><Spinner size="sm" /> Sauvegarde...</> : <><Save className="w-4 h-4" /> Sauvegarder les paramètres</>}
        </button>
      </form>

      {/* Password change */}
      <form onSubmit={handleChangePassword} className="card p-6 space-y-4">
        <h2 className="font-semibold text-ink-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-accent" /> Changer le mot de passe
        </h2>
        <div className="space-y-3">
          {[
            { name: 'currentPassword', label: 'Mot de passe actuel' },
            { name: 'newPassword', label: 'Nouveau mot de passe' },
            { name: 'confirmPassword', label: 'Confirmer le nouveau mot de passe' },
          ].map(field => (
            <div key={field.name}>
              <label className="label">{field.label}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name={field.name}
                  value={passForm[field.name]}
                  onChange={e => setPassForm(f => ({ ...f, [field.name]: e.target.value }))}
                  className="input pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="submit" disabled={savingPass} className="btn-secondary w-full justify-center">
          {savingPass ? <><Spinner size="sm" /> Mise à jour...</> : <><Lock className="w-4 h-4" /> Modifier le mot de passe</>}
        </button>
      </form>
    </div>
  )
}

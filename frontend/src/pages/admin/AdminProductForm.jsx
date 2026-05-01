import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, X, ImagePlus, Loader2 } from 'lucide-react'
import API from '../../utils/api'
import { Spinner } from '../../components/common/States'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || ''

const INITIAL_FORM = {
  name: '', description: '', price: '', originalPrice: '',
  category: '', stock: '0', isPopular: false, isFeatured: false,
  rating: '0', reviewCount: '0', tags: '', sku: '',
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(INITIAL_FORM)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    API.get(`/api/products/${id}`)
      .then(res => {
        const p = res.data.product
        setForm({
          name: p.name,
          description: p.description,
          price: p.price.toString(),
          originalPrice: p.originalPrice?.toString() || '',
          category: p.category,
          stock: p.stock.toString(),
          isPopular: p.isPopular,
          isFeatured: p.isFeatured,
          rating: p.rating.toString(),
          reviewCount: p.reviewCount.toString(),
          tags: p.tags?.join(', ') || '',
          sku: p.sku || '',
        })
        setImages(p.images || [])
      })
      .catch(() => toast.error('Erreur chargement produit'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('images', f))
      const res = await API.post('/api/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        setImages(prev => [...prev, ...res.data.urls])
        toast.success('Images uploadées !')
      }
    } catch (err) {
      toast.error('Erreur upload: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx) => setImages(imgs => imgs.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) {
      toast.error('Remplissez les champs obligatoires')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stock: parseInt(form.stock),
        rating: parseFloat(form.rating),
        reviewCount: parseInt(form.reviewCount),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images,
      }

      if (isEdit) {
        await API.put(`/api/products/${id}`, payload)
        toast.success('Produit modifié !')
      } else {
        await API.post('/api/products', payload)
        toast.success('Produit créé !')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-3xl animate-fade-in">
      <button onClick={() => navigate('/admin/products')} className="btn-ghost text-sm gap-2 mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Retour aux produits
      </button>

      <h1 className="font-display text-2xl font-bold text-ink-900 mb-6">
        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink-800">Informations de base</h2>

          <div>
            <label className="label">Nom du produit *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Mon super produit" required />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input resize-none" placeholder="Description détaillée du produit..." required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Catégorie *</label>
              <input name="category" value={form.category} onChange={handleChange} className="input" placeholder="Ex: Vêtements, Électronique..." required />
            </div>
            <div>
              <label className="label">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} className="input" placeholder="SKU-001" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink-800">Prix & Stock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Prix * (€)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} className="input" placeholder="29.99" required />
            </div>
            <div>
              <label className="label">Prix barré (€)</label>
              <input name="originalPrice" type="number" step="0.01" min="0" value={form.originalPrice} onChange={handleChange} className="input" placeholder="39.99" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input" placeholder="50" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink-800">Images</h2>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => {
                const url = img.startsWith('http') ? img : `${API_URL}${img}`
                return (
                  <div key={i} className="relative group w-20 h-20">
                    <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-ink-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1 rounded">Principale</span>}
                  </div>
                )
              })}
            </div>
          )}

          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-ink-200 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
            {uploading ? (
              <><Loader2 className="w-6 h-6 text-accent animate-spin" /><span className="text-sm text-ink-500">Upload en cours...</span></>
            ) : (
              <><ImagePlus className="w-6 h-6 text-ink-400" /><span className="text-sm text-ink-500">Cliquez pour ajouter des images</span><span className="text-xs text-ink-400">JPG, PNG, WebP — max 5MB</span></>
            )}
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Extra */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink-800">Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Note (0-5)</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Nombre d'avis</label>
              <input name="reviewCount" type="number" min="0" value={form.reviewCount} onChange={handleChange} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Tags (séparés par des virgules)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className="input" placeholder="nouveau, soldes, été" />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="isPopular" checked={form.isPopular} onChange={handleChange} className="w-4 h-4 rounded accent-accent" />
              <span className="text-sm font-medium text-ink-700">Produit populaire</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 rounded accent-accent" />
              <span className="text-sm font-medium text-ink-700">Mis en avant</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading} className="btn-primary flex-1 justify-center py-3.5">
            {saving ? <><Spinner size="sm" /> Sauvegarde...</> : isEdit ? 'Enregistrer les modifications' : 'Créer le produit'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary px-6">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

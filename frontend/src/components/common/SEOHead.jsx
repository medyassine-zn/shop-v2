import { useEffect } from 'react'
import { useSettings } from '../../context/SettingsContext'

export default function SEOHead({ title, description }) {
  const { settings } = useSettings()

  useEffect(() => {
    const base = settings.storeName || 'MyShop'
    document.title = title ? `${title} — ${base}` : base

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description || settings.storeDescription || ''
  }, [title, description, settings])

  return null
}

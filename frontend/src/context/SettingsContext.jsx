import { createContext, useContext, useEffect, useState } from 'react'
import API from '../utils/api'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'MyShop',
    storeDescription: 'Your one-stop shop for quality products',
    contactPhone: '',
    contactEmail: '',
    address: '',
    whatsappNumber: '',
    currencySymbol: '€',
    socialLinks: {},
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/api/settings')
      .then(res => { if (res.data.success) setSettings(res.data.settings) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

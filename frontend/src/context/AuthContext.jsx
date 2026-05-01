import { createContext, useContext, useState, useEffect } from 'react'
import API from '../utils/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      API.get('/api/admin/profile')
        .then(res => { if (res.data.success) setAdmin(res.data.admin) })
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const res = await API.post('/api/admin/login', { username, password })
    if (res.data.success) {
      localStorage.setItem('adminToken', res.data.token)
      setAdmin(res.data.admin)
    }
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

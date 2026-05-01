import { useState } from 'react'
import API from '../utils/api'

export default function useOrders() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createOrder = async (orderData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await API.post('/api/orders', orderData)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}

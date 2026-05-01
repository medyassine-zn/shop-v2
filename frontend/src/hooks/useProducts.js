import { useState, useEffect, useCallback } from 'react'
import API from '../utils/api'

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') query.set(key, val)
      })
      const res = await API.get(`/api/products?${query}`)
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, total, pages, loading, error, refetch: fetchProducts }
}

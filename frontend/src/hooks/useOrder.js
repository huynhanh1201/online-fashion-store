import { useState } from 'react'
import orderService from '~/services/orderService'

export function useOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const createOrder = async (orderData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await orderService.createOrder(orderData)
      setSuccess(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createOrder,
    loading,
    error,
    success,
  }
}

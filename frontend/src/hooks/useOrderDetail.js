import { useEffect, useState } from 'react'
import { getOrderById, getOrderItems } from '~/services/orderService'

export function useOrderDetail(orderId) {
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId || !/^[0-9a-fA-F]{24}$/.test(orderId)) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const orderData = await getOrderById(orderId)
        const itemData = await getOrderItems(orderId)
        setOrder(orderData)
        setItems(itemData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId])

  return { order, items, loading, error }
}

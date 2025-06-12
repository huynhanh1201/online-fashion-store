import { useState } from 'react'
import {
  getOrders,
  getOrderById,
  getOrderItems,
  getOrderHistories,
  updateOrder
} from '~/services/admin/orderService'

const useOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOrders = async (page = 1, limit = 10, filters) => {
    setLoading(true)
    const buildQuery = (input) => {
      const query = { page, limit, ...input }
      Object.keys(query).forEach((key) => {
        if (
          query[key] === '' ||
          query[key] === undefined ||
          query[key] === null
        ) {
          delete query[key]
        }
      })
      return query
    }
    try {
      const query = buildQuery(filters)
      const { orders, total } = await getOrders(query)
      setOrders(orders)
      setTotalPages(total)
    } catch (error) {
      console.error('Lỗi khi fetch đơn hàng:', error)
      setOrders([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const getOrderId = async (orderId) => {
    try {
      const order = await getOrderById(orderId)
      return order
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error)
      return null
    }
  }

  const getOrderDetailsByOrderId = async (orderId) => {
    try {
      const items = await getOrderItems(orderId)
      return items
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error)
      return []
    }
  }

  const getOrderHistoriesByOrderId = async (orderId) => {
    try {
      const histories = await getOrderHistories(orderId)
      return histories
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đơn hàng:', error)
      return []
    }
  }

  const updateOrderById = async (orderId, updateData) => {
    try {
      const updatedOrder = await updateOrder(orderId, updateData)
      return updatedOrder
    } catch (error) {
      console.error('Lỗi khi cập nhật đơn hàng:', error)
      return null
    }
  }

  return {
    orders,
    loading,
    totalPages,
    fetchOrders,
    getOrderDetailsByOrderId,
    getOrderHistoriesByOrderId,
    updateOrderById,
    getOrderId
  }
}

export default useOrder

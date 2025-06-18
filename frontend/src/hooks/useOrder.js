import { useState, useCallback } from 'react'
import orderService from '~/services/orderService'

export function useOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [orderListLoading, setOrderListLoading] = useState(false)
  const [orderListError, setOrderListError] = useState(null)
  const [orderList, setOrderList] = useState([])

  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [orderDetailError, setOrderDetailError] = useState(null)
  const [orderDetail, setOrderDetail] = useState(null)

  // Tạo đơn hàng
  const createOrder = useCallback(async (orderData) => {
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
  }, [])

  // Lấy danh sách đơn hàng (có thể truyền params filter)
  const getOrders = useCallback(async (params) => {
    setOrderListLoading(true)
    setOrderListError(null)
    try {
      const data = await orderService.getOrders(params)
      setOrderList(data)
      return data
    } catch (err) {
      setOrderListError(err)
      throw err
    } finally {
      setOrderListLoading(false)
    }
  }, [])

  // Lấy chi tiết đơn hàng theo id
  const getOrderById = useCallback(async (orderId) => {
    setOrderDetailLoading(true)
    setOrderDetailError(null)
    try {
      const data = await orderService.getOrderById(orderId)
      setOrderDetail(data)
      return data
    } catch (err) {
      setOrderDetailError(err)
      throw err
    } finally {
      setOrderDetailLoading(false)
    }
  }, [])
  // Hủy đơn hàng
  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await orderService.updateOrder(orderId, {
        status: 'Cancelled', // hoặc 'user_cancelled' tùy theo API
    
      })
      setSuccess(data)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // trạng thái tạo đơn
    createOrder,
    loading,
    error,
    success,

    // trạng thái danh sách đơn hàng
    getOrders,
    orderListLoading,
    orderListError,
    orderList,

    // trạng thái chi tiết đơn hàng
    getOrderById,
    orderDetailLoading,
    orderDetailError,
    orderDetail,

    // hủy đơn
    cancelOrder,
  }
}

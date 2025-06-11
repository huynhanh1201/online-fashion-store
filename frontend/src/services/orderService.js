import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

const orderService = {
  createOrder: async ({ cartItems, shippingAddressId, total, couponId, couponCode, paymentMethod, note, shippingFee }) => {
    try {
      const payload = {
        cartItems, // giỏ hàng
        shippingAddressId,
        total,
        paymentMethod,
        note,
        shippingFee
      }

      if (couponCode && couponCode.trim() !== '') {
        payload.couponId = couponId
        payload.couponCode = couponCode
      }

      const response = await AuthorizedAxiosInstance.post(`${API_ROOT}/v1/orders`, payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message || 'Đặt hàng thất bại'
    }
  }
}

// ... phần còn lại giữ nguyên như bạn đã viết

export const getOrders = async (page = 1, limit = 10) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/orders?page=${page}&limit=${limit}`
    )
    const orders = response.data
    return {
      orders,
      total: orders.length
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error)
    return { orders: [], total: 0 }
  }
}

export const getOrderById = async (orderId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/orders/${orderId}`
    )
    return response.data
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết đơn hàng ${orderId}:`, error)
    return null
  }
}

export const getOrderItems = async (orderId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/order-items/${orderId}`
    )
    return response.data
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết sản phẩm đơn hàng ${orderId}:`, error)
    return []
  }
}

export const getOrderHistories = async (orderId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/order-status-histories/${orderId}`
    )
    return response.data
  } catch (error) {
    console.error(`Lỗi khi lấy lịch sử trạng thái đơn hàng ${orderId}:`, error)
    return []
  }
}

export const getProductById = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/products/${productId}`
    )
    return response.data
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin sản phẩm ${productId}:`, error)
    return null
  }
}

export const updateOrder = async (orderId, updateData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/orders/${orderId}`,
      updateData
    )
    return response.data
  } catch (error) {
    console.error(`Lỗi khi cập nhật đơn hàng ${orderId}:`, error)
    return null
  }
}

export const deleteOrderById = async (orderId) => {
  try {
    await AuthorizedAxiosInstance.delete(`${API_ROOT}/v1/orders/${orderId}`)
    return true
  } catch (error) {
    console.error(`Lỗi khi xoá đơn hàng ${orderId}:`, error)
    return false
  }
}

export default orderService

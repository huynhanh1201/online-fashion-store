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
  },
  updateOrder: async (orderId, updateData) => {
    const response = await AuthorizedAxiosInstance.patch(`${API_ROOT}/v1/orders/${orderId}`, updateData)
    return response.data
  }
}

// ... phần còn lại giữ nguyên như bạn đã viết
export const getOrders = async (userId, page = 1, limit = 10, status = '') => {
  // Sử dụng sort=updated để sắp xếp theo thời gian cập nhật thay vì tạo

  let url = `${API_ROOT}/v1/orders?sort=newest&userId=${userId}&page=${page}&limit=${limit}`
  if (status && status !== 'All') {
    url += `&status=${status}`
  }
  const response = await AuthorizedAxiosInstance.get(url)
  return response.data
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
    
    const product = response.data || {}
    
    // Filter sản phẩm ở client-side: chỉ lấy status = active và destroy = false
    if (product.status !== 'active' || product.destroy === true) {
      return null
    }
    
    return product
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin sản phẩm ${productId}:`, error)
    return null
  }
}


export const updateOrder = async (orderId, updateData) => {
  const response = await AuthorizedAxiosInstance.patch(`${API_ROOT}/v1/orders/${orderId}`, updateData)
  return response.data
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

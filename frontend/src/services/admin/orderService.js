import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách đơn hàng (có phân trang)
export const getOrders = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/orders?${query}`
    )
    return {
      orders: response.data.data || [],
      total: response.data.meta.total || 0
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error)
    return { orders: [], total: 0 }
  }
}

// Lấy chi tiết đơn hàng theo orderId (bao gồm info, items, địa chỉ, lịch sử)
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

// Lấy danh sách sản phẩm trong đơn hàng
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

// Lấy lịch sử trạng thái của đơn hàng
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
// Cập nhật một số trường của đơn hàng
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
// Xoá đơn hàng theo orderId
export const deleteOrderById = async (orderId) => {
  try {
    await AuthorizedAxiosInstance.delete(`${API_ROOT}/v1/orders/${orderId}`)
    return true
  } catch (error) {
    console.error(`Lỗi khi xoá đơn hàng ${orderId}:`, error)
    return false
  }
}

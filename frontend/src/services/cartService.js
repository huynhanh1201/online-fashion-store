import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy giỏ hàng
export const getCart = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(`${API_ROOT}/v1/carts`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error)
    return null
  }
}

// Thêm sản phẩm vào giỏ hàng
// Đảm bảo gửi đúng format { productId: string, color, size, quantity }
export const addToCart = async ({ productId, color, size, quantity }) => {
  try {
    const payload = { productId, color, size, quantity }
    console.log('Thêm sản phẩm vào giỏ:', payload)
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/carts`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ:', error)
    return null
  }
}

// Cập nhật sản phẩm trong giỏ hàng
// Giữ nguyên endpoint PATCH /v1/carts/items, payload gồm { productId, color, size, quantity }
export const updateCartItem = async (updateData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/carts/items`,
      updateData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm trong giỏ:', error)
    return null
  }
}
// Cập nhật trạng thái selected của tất cả sản phẩm
export const updateAllSelection = async (selected) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/carts/items`,
      { selected }
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái chọn của tất cả sản phẩm:', error)
    return null
  }
}

// Xóa một sản phẩm khỏi giỏ hàng theo productId
export const deleteCartItem = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/carts/items/${productId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá sản phẩm khỏi giỏ:', error)
    return null
  }
}

// Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/carts`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá toàn bộ giỏ hàng:', error)
    return null
  }
}

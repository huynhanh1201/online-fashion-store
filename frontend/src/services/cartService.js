import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

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
export const addToCart = async (product) => {
  try {
    console.log('Thêm sản phẩm vào giỏ:', product)
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/carts`,
      product
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ:', error)
    return null
  }
}

// Cập nhật sản phẩm trong giỏ
export const updateCartItem = async (productId, updateData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/carts/items/${productId}`,
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

// Xoá một sản phẩm khỏi giỏ
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

// Xoá toàn bộ giỏ hàng
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

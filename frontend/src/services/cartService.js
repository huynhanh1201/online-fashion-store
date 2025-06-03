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
export const addToCart = async ({ variant, quantity }) => {
  try {
    const payload = { variantId: variant._id, quantity }  // gửi variantId thay vì object variant
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

// Xóa một sản phẩm khỏi giỏ hàng theo variantId và quantity
export const deleteCartItem = async ({ variantId, quantity }) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/carts/items`,
      {
        data: { variantId, quantity }
      }
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

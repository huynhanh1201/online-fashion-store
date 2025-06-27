import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy tất cả biến thể của một sản phẩm
export const getProductVariants = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/products/${productId}/variants`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy biến thể sản phẩm:', error)
    throw new Error(
      error.response?.data?.message || 'Không thể lấy danh sách biến thể.'
    )
  }
}

// Cập nhật discountPrice cho tất cả biến thể của một sản phẩm
export const updateProductVariantsDiscountPrice = async (productId, discountPrice) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/variants/product/${productId}/discount-price`,
      { discountPrice }
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật discountPrice cho biến thể:', error)
    throw new Error(
      error.response?.data?.message || 'Không thể cập nhật giá giảm cho biến thể.'
    )
  }
}

// Cập nhật discountPrice cho một biến thể cụ thể
export const updateVariantDiscountPrice = async (variantId, discountPrice) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/variants/${variantId}`,
      { discountPrice }
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật discountPrice cho biến thể:', error)
    throw new Error(
      error.response?.data?.message || 'Không thể cập nhật giá giảm cho biến thể.'
    )
  }
}

// Khôi phục discountPrice về giá ban đầu cho tất cả biến thể của một sản phẩm
export const restoreProductVariantsOriginalDiscountPrice = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/variants/product/${productId}/restore-discount-price`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi khôi phục discountPrice cho biến thể:', error)
    throw new Error(
      error.response?.data?.message || 'Không thể khôi phục giá giảm cho biến thể.'
    )
  }
} 
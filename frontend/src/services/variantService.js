import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getProductVariants = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants?productId=${productId}&status=active&destroy=false`
    )
    
    let variants = response.data.data || []
    
    // Filter variants ở client-side: chỉ lấy status = active và destroy = false
    variants = variants.filter(variant => 
      variant.status === 'active' && variant.destroy === false
    )
    
    return variants
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Không thể lấy danh sách biến thể.'
    )
  }
}

export const getVariantById = async (variantId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants/${variantId}`
    )
    
    const variant = response.data || {}
    
    // Filter variant ở client-side: chỉ lấy status = active và destroy = false
    if (variant.status !== 'active' || variant.destroy === true) {
      return null
    }
    
    return variant
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Không thể lấy thông tin biến thể.'
    )
  }
}

import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getVariants = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants?${params}`
    )
    // Đảm bảo return dạng { variants, total }
    return {
<<<<<<< HEAD
      variants: response.data.data || response.data.data || [],
      total: response.data.length || response.data.meta.total || 0
=======
      variants: response.data.data || [],
      total: response.data.meta.total || 0
>>>>>>> 558e39daa0c4449a00fc224edd8a7e9cf50964ad
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách biến thể:', error)
    return { variants: [], total: 0 }
  }
}

export const getVariantById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants?productId=${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết biến thể:', error)
    return null
  }
}

export const createVariant = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/variants`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo biến thể:', error)
    return null
  }
}

export const updateVariant = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/variants/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật biến thể:', error)
    return null
  }
}

export const deleteVariant = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/variants/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá biến thể:', error)
    return null
  }
}

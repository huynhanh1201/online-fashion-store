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
      variants: response.data.data || [],
      total: response.data.meta.total || 0
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
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết biến thể:', error)
    return null
  }
}

export const getVariantId = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants/${id}`
    )
    console.log('Lấy biến thể theo ID:', response.data)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy biến thể theo productId:', error)
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

import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getSizes = async (page = 1, limit = 10) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/sizes?page=${page}&limit=${limit}`
    )
    return {
      sizes: response.data || [],
      total: response.data.total || response.data.length
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kích thước:', error)
    return { sizes: [], total: 0 }
  }
}

export const getSizeById = async (sizeId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/sizes/${sizeId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin kích thước:', error)
    return null
  }
}

export const addSize = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/sizes`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm kích thước:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    return null
  }
}

export const updateSize = async (sizeId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/sizes/${sizeId}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật kích thước:', error)
    return null
  }
}

export const deleteSize = async (sizeId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/sizes/${sizeId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá kích thước:', error)
    return null
  }
}

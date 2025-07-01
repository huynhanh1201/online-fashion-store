import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getSizes = async (filter) => {
  const queryString = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/sizes?${queryString}`
    )
    return {
      sizes: response.data.data || [],
      total: response.data.meta.total || 0
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

export const restoreSize = async (sizeId) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/colors/restore/${sizeId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi khôi phục kích thước:', error)
    return null
  }
}

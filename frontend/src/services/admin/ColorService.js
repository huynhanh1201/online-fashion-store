import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getColors = async (filter) => {
  const queryString = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/colors?${queryString}`
    )
    return {
      colors: response.data.data || [],
      total: response.data.meta.total || 0
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách màu:', error)
    return { colors: [], total: 0 }
  }
}

export const getColorById = async (colorId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/colors/${colorId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin màu:', error)
    return null
  }
}

export const updateColor = async (colorId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/colors/${colorId}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật màu:', error)
    return null
  }
}

export const deleteColor = async (colorId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/colors/${colorId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá màu:', error)
    return null
  }
}

export const addColor = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/colors`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm màu:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    return null
  }
}

export const restoreColor = async (colorId) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/colors/restore/${colorId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi khôi phục màu:', error)
    return null
  }
}

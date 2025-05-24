import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getColors = async (page = 1, limit = 10) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/colors?page=${page}&limit=${limit}`
    )
    return {
      colors: response.data || response.data,
      total: response.data.total || response.data.length
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

import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getColorPalettes = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/color-palettes`
    )
    return response.data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách màu:', error)
    return []
  }
}

export const createColorPalette = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/color-palettes`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo màu mới:', error)
    throw error
  }
}

export const getColorPaletteById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/color-palettes/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy màu theo ID:', error)
    return null
  }
}

export const updateColorPalette = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/color-palettes/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật màu:', error)
    return null
  }
}

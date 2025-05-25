import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const BASE_URL = `${API_ROOT}/v1/color-palettes`

export const getColorPalettes = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}?productId=${productId}`)
    const data = await res.json()
    return {
      colors: data?.colors || [],
      paletteId: data?._id || null
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách màu:', error)
    return { colors: [], paletteId: null }
  }
}

export const createColorPalette = async (productId, data) => {
  try {
    const res = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/color-palettes?productId=${productId}`,
      data
    )
    return res.data
  } catch (error) {
    console.error('Lỗi khi tạo màu mới:', error)
    throw error
  }
}

export const getColorPaletteById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy màu theo ID:', error)
    return null
  }
}

export const updateColorPalette = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${BASE_URL}/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật màu:', error)
    throw error
  }
}

export const deleteColorPalette = async (id) => {
  try {
    await AuthorizedAxiosInstance.delete(`${BASE_URL}/${id}`)
    return true
  } catch (error) {
    console.error('Lỗi khi xóa màu:', error)
    throw error
  }
}

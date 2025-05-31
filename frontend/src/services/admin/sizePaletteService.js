import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const BASE_URL = `${API_ROOT}/v1/size-palettes`
export const getSizePalettes = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}?productId=${productId}`)
    const data = await res.json()
    // Trả thêm _id của bản ghi chính (dùng cho edit toàn bộ nếu cần)
    return {
      sizes: data?.sizes || [],
      paletteId: data?._id || null
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kích thước:', error)
    return { sizes: [], paletteId: null }
  }
}
export const createSizePalette = async (productId, data) => {
  try {
    const res = await AuthorizedAxiosInstance.post(
      `${BASE_URL}?productId=${productId}`, // chỉ đường dẫn tương đối với API_ROOT đã định nghĩa
      data
    )
    return res.data
  } catch (error) {
    console.error('Lỗi khi tạo kích thước mới:', error)
    throw error
  }
}
export const getSizePaletteById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy kích thước theo ID:', error)
    return null
  }
}
export const updateSizePalette = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${BASE_URL}/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật kích thước:', error)
    throw error
  }
}
export const deleteSizePalette = async (id) => {
  try {
    await AuthorizedAxiosInstance.delete(`${BASE_URL}/${id}`)
    return true
  } catch (error) {
    console.error('Lỗi khi xóa kích thước:', error)
    throw error
  }
}

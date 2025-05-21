// import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
// import { API_ROOT } from '~/utils/constants'
//
// export const getColorPalettes = async (productId) => {
//   try {
//     const response = await AuthorizedAxiosInstance.get(
//       `${API_ROOT}/v1/color-palettes`,
//       { params: { productId } }
//     )
//     // Đảm bảo trả về mảng
//     return Array.isArray(response.data) ? response.data : []
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách màu:', error)
//     return []
//   }
// }
//
// // Các hàm khác giữ nguyên
// export const createColorPalette = async (data) => {
//   try {
//     const response = await AuthorizedAxiosInstance.post(
//       `${API_ROOT}/v1/color-palettes`,
//       { name: data.name, description: data.description || '' }
//     )
//     return response.data
//   } catch (error) {
//     console.error('Lỗi khi tạo màu mới:', error)
//     throw error
//   }
// }
//
// export const getColorPaletteById = async (id) => {
//   try {
//     const response = await AuthorizedAxiosInstance.get(
//       `${API_ROOT}/v1/color-palettes/${id}`
//     )
//     return response.data
//   } catch (error) {
//     console.error('Lỗi khi lấy màu theo ID:', error)
//     return null
//   }
// }
//
// export const updateColorPalette = async (id, data) => {
//   try {
//     const response = await AuthorizedAxiosInstance.patch(
//       `${API_ROOT}/v1/color-palettes/${id}`,
//       { name: data.name, description: data.description || '' }
//     )
//     return response.data
//   } catch (error) {
//     console.error('Lỗi khi cập nhật màu:', error)
//     return null
//   }
// }
//
// export const deleteColorPalette = async (id) => {
//   try {
//     await AuthorizedAxiosInstance.delete(`${API_ROOT}/v1/color-palettes/${id}`)
//     return true
//   } catch (error) {
//     console.error('Lỗi khi xóa màu:', error)
//     throw error
//   }
// }

import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const BASE_URL = `${API_ROOT}/v1/color-palettes`

export const getColorPalettes = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}?productId=${productId}`)
    const data = await res.json()
    // Trả thêm _id của bản ghi chính (dùng cho edit toàn bộ nếu cần)
    return {
      colors: data?.colors || [],
      paletteId: data?._id || null
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách màu:', error)
    return { colors: [], paletteId: null }
  }
}

export const createColorPalette = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(BASE_URL, data)
    return response.data
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

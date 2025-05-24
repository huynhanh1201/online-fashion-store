// src/apis/sizeService.js

import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const BASE_URL = `${API_ROOT}/v1/size-palettes`

export const getSizePalettes = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}?productId=${productId}`)
    const data = await res.json()
    return {
      sizes: data?.sizes || [],
      paletteId: data?._id || null
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách size:', error)
    return { sizes: [], paletteId: null }
  }
}

export const createSizePalette = async (productId, data) => {
  try {
    const res = await AuthorizedAxiosInstance.post(
      `${BASE_URL}?productId=${productId}`,
      data
    )
    return res.data
  } catch (error) {
    console.error('Lỗi khi tạo size mới:', error)
    throw error
  }
}

export const getSizePaletteById = async (id) => {
  try {
    const res = await AuthorizedAxiosInstance.get(`${BASE_URL}/${id}`)
    return res.data
  } catch (error) {
    console.error('Lỗi khi lấy size theo ID:', error)
    return null
  }
}

export const updateSizePalette = async (id, data) => {
  try {
    const res = await AuthorizedAxiosInstance.patch(`${BASE_URL}/${id}`, data)
    return res.data
  } catch (error) {
    console.error('Lỗi khi cập nhật size:', error)
    throw error
  }
}

export const deleteSizePalette = async (id) => {
  try {
    await AuthorizedAxiosInstance.delete(`${BASE_URL}/${id}`)
    return true
  } catch (error) {
    console.error('Lỗi khi xóa size:', error)
    throw error
  }
}

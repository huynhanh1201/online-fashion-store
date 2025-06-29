import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy collection theo slug
export const getCollectionBySlug = async (slug) => {
  try {
    if (!slug) {
      throw new Error('Slug không được để trống')
    }
    
    const response = await AuthorizedAxiosInstance.get(`${API_ROOT}/v1/website-configs/collections/slug/${slug}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy collection theo slug:', error)
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin collection')
  }
}

// Lấy danh sách collections
export const getCollections = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString()
    const response = await AuthorizedAxiosInstance.get(`${API_ROOT}/v1/website-configs?${queryString}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách collections:', error)
    return { collections: [], total: 0, totalPages: 1 }
  }
} 
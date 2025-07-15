import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const buildQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  return query ? `?${query}` : ''
}

export const getProducts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/products?${queryString}`
    )
    return {
      products: response.data.data || [],
      total: response.data.meta?.total || 0,
      totalPages: response.data.meta?.totalPages || 1
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error)
    return { products: [], total: 0, totalPages: 1 }
  }
}

export const getProductById = async (productId) => {
  try {
    if (typeof productId !== 'string' || !productId) {
      throw new Error('productId phải là chuỗi không rỗng')
    }
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/products/${productId}`
    )
    return response.data || []
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error.response?.data || error)
    return []
  }
}

// Cập nhật sản phẩm
export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/products/${productId}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error(
      'Lỗi khi cập nhật sản phẩm:',
      error.response ? error.response.data : error
    )
    return null
  }
}

// Xoá sản phẩm
export const deleteProduct = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/products/${productId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá sản phẩm:', error)
    return null
  }
}

// Thêm sản phẩm mới
export const addProduct = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/products`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm mới:', error)
    return null
  }
}

export const RestoreProduct = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/products/restore/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi khôi phục sản phẩm:', error)
    return null
  }
}

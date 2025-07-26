/* eslint-disable no-console */
// services/productService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách sản phẩm (phân trang)
export const getProducts = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 1000,
      sort = '',
      filterTypeDate = '',
      filters = {} // thêm filters nếu cần mở rộng sau này
    } = params

    // Tạo query string cho lọc
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(sort && { sort }),
      ...(filterTypeDate && { filterTypeDate }),
      destroy: false,
      status: 'active',
      ...filters // cho phép mở rộng lọc thêm nếu cần
    })

    const url = `${API_ROOT}/v1/products?${queryParams.toString()}`

    const response = await AuthorizedAxiosInstance.get(url)

    const products = response.data.data || []
    const total = response.data.meta?.total || 0
    const totalPages = response.data.meta?.totalPages || 1

    return {
      products,
      total,
      totalPages
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error)
    return { products: [], total: 0, totalPages: 1 }
  }
}

// Lấy danh sách sản phẩm theo danh mục
export const getProductsByCategory = async (
  categoryId,
  page = 1,
  limit = 10
) => {
  try {
    if (typeof categoryId !== 'string' || !categoryId) {
      throw new Error('categoryId phải là chuỗi không rỗng')
    }
    const url = `${API_ROOT}/v1/products/category/${categoryId}?page=${page}&limit=${limit}`
    const response = await AuthorizedAxiosInstance.get(url)
    console.log(
      `API getProductsByCategory response (${categoryId}):`,
      response.data
    )

    // Xử lý response là mảng trực tiếp hoặc object
    let products = Array.isArray(response.data)
      ? response.data
      : response.data.products || response.data || []

    // Filter sản phẩm ở client-side: chỉ lấy status = active và destroy = false
    products = products.filter(product => 
      product.status === 'active' && product.destroy === false
    )

    const total = products.length
    return {
      products,
      total
    }
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryId}:`, error)
    return { products: [], total: 0 }
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

    const product = response.data || {}

    // Filter sản phẩm ở client-side: chỉ lấy status = active và destroy = false
    if (product.status !== 'active' || product.destroy === true) {
      return {}
    }

    return product
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error.response?.data || error)
    return {}
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
    console.log('data', data)
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/products`,
      data
    )
    return response.data
  } catch (error) {
    return error
  }
}

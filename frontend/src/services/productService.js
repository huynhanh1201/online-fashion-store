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
      ...filters
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
  limit = 10,
  sort = ''
) => {
  try {
    if (typeof categoryId !== 'string' || !categoryId) {
      throw new Error('categoryId phải là chuỗi không rỗng')
    }
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (sort) {
      params.append('sort', sort)
    }
    
    const url = `${API_ROOT}/v1/products/category/${categoryId}?${params.toString()}`
    const response = await AuthorizedAxiosInstance.get(url)
    console.log(
      `API getProductsByCategory response (${categoryId}):`,
      response.data
    )

    // Backend đã trả về object với products, total, totalPages
    const { products = [], total = 0, totalPages = 1, currentPage = 1 } = response.data

    return {
      products,
      total,
      totalPages,
      currentPage
    }
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryId}:`, error)
    return { products: [], total: 0, totalPages: 1, currentPage: 1 }
  }
}

// Lấy danh sách sản phẩm theo nhiều danh mục (parent + children)
export const getProductsByMultipleCategories = async (
  categoryIds,
  page = 1,
  limit = 10
) => {
  try {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      throw new Error('categoryIds phải là mảng không rỗng')
    }

    // Lấy tất cả sản phẩm từ tất cả category (không phân trang ở API level)
    const allPromises = categoryIds.map(categoryId => 
      getProductsByCategory(categoryId, 1, 1000) // Lấy tất cả sản phẩm từ mỗi category
    )

    const allResults = await Promise.all(allPromises)
    
    // Merge tất cả sản phẩm và loại bỏ duplicate
    const allProducts = []
    const seenProductIds = new Set()
    
    allResults.forEach(result => {
      result.products.forEach(product => {
        if (!seenProductIds.has(product._id)) {
          seenProductIds.add(product._id)
          allProducts.push(product)
        }
      })
    })

    // Tính toán pagination cho toàn bộ danh sách
    const total = allProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = allProducts.slice(startIndex, endIndex)

    return {
      products: paginatedProducts,
      total,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm theo nhiều danh mục:`, error)
    return { products: [], total: 0, totalPages: 1, currentPage: page }
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

    // Backend đã filter destroy: false, không cần filter client-side
    return response.data || {}
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

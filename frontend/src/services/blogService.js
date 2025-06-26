/* eslint-disable no-console */
// services/blogService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách blogs công khai (không cần admin privilege)
export const getPublicBlogs = async (params = {}) => {
  try {
    const { page = 1, limit = 10, sort = '' } = params
    const url = `${API_ROOT}/v1/blogs?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}&status=published`

    const response = await AuthorizedAxiosInstance.get(url)
    console.log('API getPublicBlogs response:', response.data)

    // Xử lý response là mảng trực tiếp hoặc object
    const blogs = response.data.data || response.data.blogs || []
    const total = response.data.meta?.total || blogs.length
    const totalPages = response.data.meta?.totalPages || Math.ceil(total / limit)

    return {
      data: blogs,
      meta: {
        total,
        totalPages,
        currentPage: response.data.meta?.currentPage || page
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách blog:', error)
    return { data: [], meta: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

// Lấy thông tin chi tiết một blog công khai
export const getPublicBlogById = async (blogId) => {
  try {
    if (typeof blogId !== 'string' || !blogId) {
      throw new Error('blogId phải là chuỗi không rỗng')
    }
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs/${blogId}`
    )
    console.log(`API getBlogById response (${blogId}):`, response.data)
    return response.data || {}
  } catch (error) {
    console.error('Lỗi khi lấy thông tin blog:', error.response?.data || error)
    return {}
  }
}

// Lấy blogs mới nhất
export const getLatestBlogs = async (limit = 10) => {
  try {
    const url = `${API_ROOT}/v1/blogs?limit=${limit}&sort=-createdAt&status=published`
    const response = await AuthorizedAxiosInstance.get(url)
    console.log('API getLatestBlogs response:', response.data)

    // Xử lý response là mảng trực tiếp hoặc object
    const blogs = response.data.data || response.data.blogs || []
    const total = response.data.meta?.total || blogs.length

    return {
      data: blogs,
      meta: {
        total
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy blog mới nhất:', error)
    return { data: [], meta: { total: 0 } }
  }
}

// Lấy blogs theo category
export const getBlogsByCategory = async (categoryId, page = 1, limit = 10) => {
  try {
    if (typeof categoryId !== 'string' || !categoryId) {
      throw new Error('categoryId phải là chuỗi không rỗng')
    }
    const url = `${API_ROOT}/v1/blogs/category/${categoryId}?page=${page}&limit=${limit}&status=published`
    const response = await AuthorizedAxiosInstance.get(url)
    console.log(`API getBlogsByCategory response (${categoryId}):`, response.data)

    // Xử lý response là mảng trực tiếp hoặc object
    const blogs = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.blogs || []
    const total = Array.isArray(response.data)
      ? response.data.length
      : response.data.meta?.total || response.data.total || 0

    return {
      data: blogs,
      meta: {
        total,
        totalPages: response.data.meta?.totalPages || Math.ceil(total / limit),
        currentPage: response.data.meta?.currentPage || page
      }
    }
  } catch (error) {
    console.error(`Lỗi khi lấy blog theo category ${categoryId}:`, error)
    return { data: [], meta: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}
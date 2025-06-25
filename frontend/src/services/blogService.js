// services/blogService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách blogs công khai (không cần admin privilege)
export const getPublicBlogs = async (page = 1, limit = 10) => {
  try {
   
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs?page=${page}&limit=${limit}`
    )

    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách blog:', error)
    return { data: [], meta: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

// Lấy thông tin chi tiết một blog công khai
export const getPublicBlogById = async (blogId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs/${blogId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin blog:', error)
    return null
  }
}

// Lấy blogs mới nhất
export const getLatestBlogs = async (page = 1, limit = 10) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs`
    )

    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy blog mới nhất:', error)
    return { data: [], meta: { total: 0 } }
  }
}

// Lấy blogs theo category
export const getBlogsByCategory = async (category) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs`
    )

    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy blog theo category:', error)
    return { data: [], meta: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}
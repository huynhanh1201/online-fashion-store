// services/blogService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách blogs với phân trang
export const getBlogs = async (filter) => {
  try {
    const queryString = new URLSearchParams(filter).toString()

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs?${queryString}`
    )
    return {
      blogs: response.data.data || [],
      total: response.data.meta.total || 0,
      totalPages: response.data.totalPages || 0,
      currentPage: response.data.currentPage || 1
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách blog:', error)
    return { blogs: [], total: 0, totalPages: 0, currentPage: 1 }
  }
}

// Lấy thông tin chi tiết một blog
export const getBlogById = async (blogId) => {
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

// Tạo blog mới
export const createBlog = async (blogData) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs`,
      blogData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo blog:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    throw error
  }
}

// Cập nhật blog
export const updateBlog = async (blogId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/blogs/${blogId}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật blog:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    throw error
  }
}

// Xóa blog
export const deleteBlog = async (blogId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/blogs/${blogId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xóa blog:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    throw error
  }
}

// Upload ảnh cho blog
export const uploadBlogImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error)
    throw error
  }
}

export const RestoreBlog = async (blogId) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/blogs/restore/${blogId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi khôi phục blog:', error)
    throw error
  }
}

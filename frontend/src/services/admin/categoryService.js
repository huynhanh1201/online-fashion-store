// services/categoryService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getCategories = async (filter) => {
  const queryString = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/categories?${queryString}`
    )
    return {
      categories: response.data.data,
      total: response.data.meta.total
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error)
    return { categories: [], total: 0 }
  }
}

export const getCategoriesWithProducts = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/categories/with-products`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục có sản phẩm:', error)
    return []
  }
}

export const getCategoryById = async (categoryId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/categories/${categoryId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin danh mục:', error)
    return null
  }
}

export const updateCategory = async (categoryId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/categories/${categoryId}`, // Đảm bảo rằng categoryId được truyền chính xác
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error)
    return null
  }
}
export const deleteCategory = async (categoryId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/categories/${categoryId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá danh mục:', error)
    return null
  }
}
export const addCategory = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/categories`, // API POST tạo mới danh mục
      data // Dữ liệu gửi lên server (name, description)
    )
    return response.data // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error('Lỗi khi thêm danh mục:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    return null // Nếu có lỗi, trả về null
  }
}

export const RestoreCategory = async (categoryId) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/categories/restore/${categoryId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi khôi phục danh mục:', error)
    return null
  }
}

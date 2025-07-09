import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách policies với phân trang (sử dụng API blog với filter type=policy)
export const getPolicies = async (filter) => {
  try {
    const queryString = new URLSearchParams({
      ...filter,
      type: 'policy' // Filter để chỉ lấy blogs có type=policy
    }).toString()

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs?${queryString}`
    )
    return {
      policies: response.data.data || [],
      total: response.data.meta.total || 0,
      totalPages: response.data.totalPages || 0,
      currentPage: response.data.currentPage || 1
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách policy:', error)
    return { policies: [], total: 0, totalPages: 0, currentPage: 1 }
  }
}

// Lấy thông tin chi tiết một policy (sử dụng API blog)
export const getPolicyById = async (policyId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs/${policyId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin policy:', error)
    return null
  }
}

// Tạo policy mới (sử dụng API blog với type=policy)
export const createPolicy = async (policyData) => {
  try {
    const blogData = {
      ...policyData,
      type: 'policy' // Đánh dấu đây là policy
    }
    
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs`,
      blogData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo policy:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    throw error
  }
}

// Cập nhật policy (sử dụng API blog)
export const updatePolicy = async (policyId, updatedData) => {
  try {
    const blogData = {
      ...updatedData,
      type: 'policy' // Đảm bảo type vẫn là policy
    }
    
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/blogs/${policyId}`,
      blogData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật policy:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    throw error
  }
}

// Xóa policy (sử dụng API blog)
export const deletePolicy = async (policyId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/blogs/${policyId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xóa policy:', error)
    console.log('Chi tiết lỗi:', error.response?.data)
    throw error
  }
}

// Upload ảnh cho policy (sử dụng API blog)
export const uploadPolicyImage = async (imageFile) => {
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

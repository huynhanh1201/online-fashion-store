import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const createReview = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(`${API_ROOT}/v1/reviews`, data)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message || 'Gửi đánh giá thất bại'
  }
}

export const getReviews = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/reviews?productId=${productId}`
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message || 'Không lấy được đánh giá'
  }
}
export const getUserReviews = async (userId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/reviews?userId=${userId}`
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message || 'Không lấy được đánh giá người dùng'
  }
}


export const updateReview = async (reviewId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(`${API_ROOT}/v1/reviews/${reviewId}`, updatedData)
    return response.data
  } catch (error) {
    console.error('Lỗi cập nhật đánh giá:', error)
    throw error
  }
}

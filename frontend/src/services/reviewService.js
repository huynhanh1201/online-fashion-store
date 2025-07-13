import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const createReview = async (data, config = {}) => {
  try {
    const response = await AuthorizedAxiosInstance.post(`${API_ROOT}/v1/reviews`, data, config)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message || 'Gửi đánh giá thất bại'
  }
}

export const getReviews = async (productId, page = 1, limit = 5) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/reviews?sort=newest&destroy=false&page=${page}&limit=${limit}&productId=${productId}&moderationStatus=approved`
    )
    // Trả về cả data và meta để xử lý pagination
    return {
      data: response.data.data,
      meta: response.data.meta
    }
  } catch (error) {
    throw error.response?.data || error.message || 'Không lấy được đánh giá'
  }
}
export const getUserReviews = async (userId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/reviews?userId=${userId}`
    )
    return response.data.data
  } catch (error) {
    throw error.response?.data || error.message || 'Không lấy được đánh giá người dùng'
  }
}

export const getUserReviewForProduct = async (userId, productId, orderId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/reviews?userId=${userId}&productId=${productId}&orderId=${orderId}`
    )
    return response.data.data
  } catch (error) {
    throw error.response?.data || error.message || 'Không lấy được đánh giá của sản phẩm'
  }
}


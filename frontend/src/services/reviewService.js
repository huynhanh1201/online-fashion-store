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



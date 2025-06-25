import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getReviews = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/reviews?${query}`
    )
    return {
      data: response.data || [],
      total: response.data.lenght || 0
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error)
    throw error
  }
}

export const updateReview = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/reviews/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật đánh giá:', error)
    throw error
  }
}
export const deleteReview = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/reviews/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá đánh giá:', error)
    throw error
  }
}

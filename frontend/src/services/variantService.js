import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getProductVariants = async (productId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants?productId=${productId}`
    )
    return response.data.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Không thể lấy danh sách biến thể.'
    )
  }
}

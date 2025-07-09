import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const validateCoupon = async (cartTotal, couponCode) => {
  try {
    const response = await AuthorizedAxiosInstance.post(`${API_ROOT}/v1/coupons/validate`, {
      cartTotal,
      couponCode
    })
    return response.data
  } catch (error) {
    let errorMessage = 'Lỗi không xác định'
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    console.error('Lỗi khi kiểm tra mã giảm giá:', errorMessage)
    throw new Error(errorMessage) // Ném ra lỗi có message rõ ràng
  }
}

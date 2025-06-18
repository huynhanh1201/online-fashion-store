// services/discountService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách mã giảm giá
export const getDiscounts = async (filter) => {
  const queryParams = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/coupons?${queryParams}`
    )
    return {
      discounts: response.data.data || [],
      total: response.data.meta.total || 0
    } // vì API trả về mảng
  } catch (error) {
    console.error('Lỗi khi lấy danh sách mã giảm:', error)
    return { discounts: [], total: 0 }
  }
}

// Lấy chi tiết mã giảm theo ID hoặc mã code
export const getDiscountById = async (idOrCode) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/coupons/${idOrCode}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin mã giảm:', error)
    return []
  }
}

// Thêm mới mã giảm
export const addDiscount = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/coupons`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm mã giảm:', error)
    return null
  }
}

// Cập nhật mã giảm
export const updateDiscount = async (couponId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/coupons/${couponId}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật mã giảm:', error)
    return null
  }
}

// Xoá mã giảm (hoặc set isActive=false)
export const deleteDiscount = async (couponId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/coupons/${couponId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá mã giảm:', error)
    return null
  }
}

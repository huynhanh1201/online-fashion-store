import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

/**
 * Lấy danh sách địa chỉ giao hàng
 * @returns {Promise<Object>} Object chứa danh sách địa chỉ và tổng số
 */
export const getShippingAddresses = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/shipping-addresses`
    )
    return {
      addresses: response.data.addresses || response.data || [],
      total: response.data.total || response.data.length || 0
    }
  } catch (error) {
    console.error(
      'Lỗi khi lấy danh sách địa chỉ:',
      error.response?.data || error
    )
    return { addresses: [], total: 0 }
  }
}

/**
 * Thêm địa chỉ giao hàng mới
 * @param {Object} addressData - Dữ liệu địa chỉ: { fullName, phone, address, ward, district, city }
 * @returns {Promise<Object>} Địa chỉ vừa thêm
 */
export const addShippingAddress = async (addressData) => {
  try {
    console.log('API addShippingAddress data:', addressData)
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/shipping-addresses`,
      addressData
    )
    console.log('API addShippingAddress response:', response.data)
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error.response?.data || error)
    throw new Error(error.response?.data?.message || 'Không thể thêm địa chỉ')
  }
}

/**
 * Sửa địa chỉ giao hàng
 * @param {string} addressId - ID của địa chỉ cần sửa
 * @param {Object} addressData - Dữ liệu địa chỉ: { fullName, phone, address, ward, district, city }
 * @returns {Promise<Object>} Địa chỉ đã sửa
 */
export const updateShippingAddress = async (addressId, addressData) => {
  try {
    if (typeof addressId !== 'string' || !addressId) {
      throw new Error('addressId phải là chuỗi không rỗng')
    }
    console.log('API updateShippingAddress data:', addressData)
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/shipping-addresses/${addressId}`,
      addressData
    )
    console.log('API updateShippingAddress response:', response.data)
    return response.data
  } catch (error) {
    console.error('Lỗi khi sửa địa chỉ:', error.response?.data || error)
    throw new Error(error.response?.data?.message || 'Không thể sửa địa chỉ')
  }
}

/**
 * Xóa địa chỉ giao hàng
 * @param {string} addressId - ID của địa chỉ cần xóa
 * @returns {Promise<Object|null>} Phản hồi từ API hoặc null nếu lỗi
 */
export const deleteShippingAddress = async (addressId) => {
  try {
    if (typeof addressId !== 'string' || !addressId) {
      throw new Error('addressId phải là chuỗi không rỗng')
    }
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/shipping-addresses/${addressId}`
    )
    console.log('API deleteShippingAddress response:', response.data)
    return response.data
  } catch (error) {
    console.error('Lỗi khi xóa địa chỉ:', error.response?.data || error)
    return null
  }
}

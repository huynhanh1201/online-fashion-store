import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getProfile = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/users/profile`
    )
    return response.data // chỉ trả về object người dùng
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error)
    return null
  }
}
export const updateProfile = async (updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/users/profile`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật hồ sơ:', error)
    return null
  }
}

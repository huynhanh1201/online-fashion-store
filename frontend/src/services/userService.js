// gọi API
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/users?page=${page}&limit=${limit}`
    )
    return { users: response.data, total: response.data.length }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error)
    return { users: [], total: 0 }
  }
}
// lấy api profile
export const getProfileUser = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/users/profile`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin hồ sơ người dùng:', error)
    return null
  }
}

export const getUserById = async (userId) => {
  const response = await AuthorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/${userId}`
  )
  return response.data
}
export const deleteUser = async (id) => {
  try {
    await AuthorizedAxiosInstance.delete(`${API_ROOT}/v1/users/${id}`)
    return true
  } catch (error) {
    console.error('Lỗi khi xoá người dùng:', error)
    return false
  }
}
export const updateProfile = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/users/profile`,
      data,
      {
        headers: {
          'Content-Type': 'application/json' // Luôn gửi JSON để kiểm tra
        }
      }
    )
    console.log('Phản hồi từ API:', response.data)
    return response.data
  } catch (error) {
    const errorData = error?.response?.data || { message: 'Lỗi không xác định' }
    console.error('Lỗi khi cập nhật profile:', errorData)
    return { error: errorData }
  }
}
export const changePassword = async ({
  oldPassword,
  newPassword,
  confirmNewPassword
}) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/users/password`,
      { oldPassword, newPassword, confirmNewPassword },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    const errorData = error?.response?.data || { message: 'Lỗi không xác định' }
    console.error('Lỗi khi đổi mật khẩu:', errorData)
    return { error: errorData }
  }
}

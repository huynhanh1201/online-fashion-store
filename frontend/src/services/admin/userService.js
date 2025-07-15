// gọi API
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getUsers = async (filter) => {
  const queryString = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/users?${queryString}`
    )
    return { users: response.data.data, total: response.data.meta.total }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error)
    return { users: [], total: 0 }
  }
}

export const getUserById = async (userId) => {
  const response = await AuthorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/${userId}`
  )
  return response.data
}

export const updateUser = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/users/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error)
    throw error
  }
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

export const CreateUser = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/auth/register`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo người dùng:', error)
    throw error
  }
}

export const RestoreUser = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/users/restore/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi khôi phục người dùng:', error)
    throw error
  }
}

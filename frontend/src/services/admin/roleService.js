// services/roleService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getRoles = async (filter) => {
  try {
    const queryString = new URLSearchParams(filter).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/roles?${queryString}`
    )
    return {
      data: response.data.data,
      total: response.data.meta.total
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vai trò:', error)
    return []
  }
}

export const getRoleById = async (roleId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/roles/${roleId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy vai trò:', error)
    return null
  }
}

export const addRole = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/roles`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm vai trò:', error)
    return null
  }
}

export const updateRole = async (roleId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/roles/${roleId}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật vai trò:', error)
    return null
  }
}

export const deleteRole = async (roleId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/roles/${roleId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá vai trò:', error)
    return null
  }
}
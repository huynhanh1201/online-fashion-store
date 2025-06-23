import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getPermissions = async (page, limit) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/permissions?page=${page}&limit=${limit}&sort=newest`
    )
    return {
      data: response.data.data,
      total: response.data.meta.total
    }
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return []
  }
}
export const getPermissionById = async (permissionId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/permissions/${permissionId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching permission:', error)
    return null
  }
}
export const addPermission = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/permissions`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error adding permission:', error)
    return null
  }
}
export const updatePermission = async (permissionId, updatedData) => {
  try {
    const response = await AuthorizedAxiosInstance.put(
      `${API_ROOT}/v1/permissions/${permissionId}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Error updating permission:', error)
    return null
  }
}

export const deletePermission = async (permissionId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/permissions/${permissionId}`
    )
    return response.data
  } catch (error) {
    console.error('Error deleting permission:', error)
    return null
  }
}
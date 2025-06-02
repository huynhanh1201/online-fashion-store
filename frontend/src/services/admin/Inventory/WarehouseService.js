import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getWarehouses = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = new URLSearchParams({ page, limit, ...filters }).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/warehouses?${params}`
    )
    return {
      warehouses: response.data,
      total: response.data.totalPages
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho:', error)
    return { warehouses: [], total: 0 }
  }
}

export const getWarehouseById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/warehouses/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết kho:', error)
    return null
  }
}

export const createWarehouse = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/warehouses`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo kho:', error)
    return null
  }
}

export const updateWarehouse = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/warehouses/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật kho:', error)
    return null
  }
}

export const deleteWarehouse = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/warehouses/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá kho:', error)
    return null
  }
}

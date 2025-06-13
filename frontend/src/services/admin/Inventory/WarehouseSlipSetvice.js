import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getWarehouseSlips = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/warehouse-slips?${params}`
    )
    return {
      warehouseSlips: response.data,
      total: response.data.totalPages
    }
  } catch (error) {
    console.error('Error fetching warehouse slips:', error)
    return { warehouseSlips: [], total: 0 }
  }
}
export const getWarehouseSlipById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/warehouse-slips/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching warehouse slip by ID:', error)
    return null
  }
}

export const createWarehouseSlip = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/warehouse-slips`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error creating warehouse slip:', error)
    return null
  }
}

export const updateWarehouseSlip = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/warehouse-slips/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error updating warehouse slip:', error)
    return null
  }
}

export const deleteWarehouseSlip = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/warehouse-slips/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Error deleting warehouse slip:', error)
    return null
  }
}

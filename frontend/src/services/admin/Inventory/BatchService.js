import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getBatches = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/batches?${params}`
    )
    return { batches: response.data, total: response.data.length }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lô hàng:', error)
    return []
  }
}

export const getBatchById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/batches/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết lô:', error)
    return null
  }
}

export const getBatchesByVariant = async (variantId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants/${variantId}/batches`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy lô theo biến thể:', error)
    return []
  }
}

export const getBatchesByWarehouse = async (warehouseId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/warehouses/${warehouseId}/batches`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy lô theo kho:', error)
    return []
  }
}

export const createBatch = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/batches`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo lô hàng:', error)
    return null
  }
}

export const updateBatch = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.put(
      `${API_ROOT}/v1/batches/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật lô hàng:', error)
    return null
  }
}

export const deleteBatch = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/batches/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá lô hàng:', error)
    return null
  }
}

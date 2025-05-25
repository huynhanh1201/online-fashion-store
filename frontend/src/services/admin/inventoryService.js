import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getInventories = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = new URLSearchParams({ page, limit, ...filters }).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/inventories?${params}`
    )
    return {
      inventories: response.data,
      total: response.data.totalPages
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho:', error)
    return { inventories: [], total: 0 }
  }
}
// Cập nhật một phần thông tin kho
export const updateInventory = async (inventoryId, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/inventories/${inventoryId}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật kho:', error)
    return null
  }
}

// Xoá mềm kho
export const deleteInventory = async (inventoryId) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/inventories/${inventoryId}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi xoá kho:', error)
    return null
  }
}

export const createInventory = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/inventories`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo biến thể kho:', error)
    return null
  }
}

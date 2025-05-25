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
export const importInventory = async (inventoryId, quantity) => {
  const response = await AuthorizedAxiosInstance.post(
    `${API_ROOT}/v1/inventories/${inventoryId}/in`,
    { quantity }
  )
  return response.data
}
export const exportInventory = async (inventoryId, quantity) => {
  const response = await AuthorizedAxiosInstance.post(
    `${API_ROOT}/v1/inventories/${inventoryId}/out`,
    { quantity }
  )
  return response.data
}

export const getInventoryLogs = async ({ page, limit }) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/inventory-logs`,
      {
        params: {
          page,
          limit
        }
      }
    )
    console.log('Inventory logs response:', response.data)
    return {
      logs: response.data, // bọc lại
      totalPages: 1 // nếu chưa có phân trang thật
    }
  } catch (error) {
    console.error('Lỗi khi lấy lịch xử kho:', error)
    return {
      logs: [],
      totalPages: 1
    }
  }
}

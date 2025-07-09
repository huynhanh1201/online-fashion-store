import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getInventories = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/inventories?${params}`
    )
    return {
      inventories: response.data.data,
      total: response.data.meta?.total || 0
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho:', error)
    return { inventories: [], total: 0 }
  }
}

export const getInventoryById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/inventories/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy tồn kho theo ID:', error)
    return null
  }
}

export const getInventoryByWarehouse = async (warehouseId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/warehouses/${warehouseId}/inventory`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy tồn kho theo kho:', error)
    return []
  }
}

export const getInventoryByVariant = async (variantId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/variants/${variantId}/inventory`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy tồn kho theo biến thể:', error)
    return []
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

export const getInventoryLogs = async (filters) => {
  const params = new URLSearchParams(filters).toString()
  const response = await AuthorizedAxiosInstance.get(
    `${API_ROOT}/v1/inventory-logs?${params}`
  )
  console.log('Response data:', response.data.data)
  return {
    logs: response.data.data,
    totalPages: response.data.meta?.totalPages,
    total: response.data.meta?.total
  }
}
export const getInventoryLogDetail = async (logId) => {
  const response = await AuthorizedAxiosInstance.get(
    `${API_ROOT}/v1/inventory-logs/${logId}`
  )
  return response.data
}

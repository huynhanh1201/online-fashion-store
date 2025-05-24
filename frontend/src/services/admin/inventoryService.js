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

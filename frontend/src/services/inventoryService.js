import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

const fetchInventory = async (variantId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(`${API_ROOT}/v1/inventories?variantId=${variantId}`)
    const result = response.data
    const inventoryList = result.data || []
    const inventory = Array.isArray(inventoryList) ? inventoryList[0] : inventoryList
    return inventory
  } catch (error) {
    console.error('Lỗi lấy kho:', error)
    throw error
  }
}

const inventoryService = {
  fetchInventory
}

export default inventoryService

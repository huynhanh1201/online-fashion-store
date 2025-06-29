import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getInventoryStatistics = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/statistics/inventory`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching inventory statistics:', error)
    return []
  }
}

export const getProductsStatistics = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/statistics/product`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching products statistics:', error)
    return []
  }
}

export const getOrderStatistics = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/statistics/order`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching order statistics:', error)
    return []
  }
}

export const getAccountStatistics = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/statistics/user`
    )
    return response.data.userStats
  } catch (error) {
    console.error('Error fetching account statistics:', error)
    return []
  }
}

export const finaceStatistics = async (year) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/statistics/finance?year=${year}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching finance statistics:', error)
    return []
  }
}

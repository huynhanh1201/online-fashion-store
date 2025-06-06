import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

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

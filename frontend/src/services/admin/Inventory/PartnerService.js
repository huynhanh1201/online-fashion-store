import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const getPartners = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString()
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/partners?${params}`
    )
    return { partners: response.data, total: response.data.length }
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export const getPartnerById = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/partners/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching partner by ID:', error)
    return null
  }
}
export const createPartner = async (data) => {
  try {
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/partners`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error creating partner:', error)
    return null
  }
}
export const updatePartner = async (id, data) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/partners/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error updating partner:', error)
    return null
  }
}
export const deletePartner = async (id) => {
  try {
    const response = await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/partners/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Error deleting partner:', error)
    return null
  }
}

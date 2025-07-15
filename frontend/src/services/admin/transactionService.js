import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

// ✅ Lấy tất cả giao dịch (không truyền orderId)
export const getAllTransactions = async (filter) => {
  const queryParams = new URLSearchParams(filter).toString()
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/payment-transactions?${queryParams}`
    )
    return {
      transactions: response.data.data || [],
      total: response.data.meta.total || 0
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách giao dịch:', error)
    return {
      transactions: []
    }
  }
}

// ✅ Lấy chi tiết giao dịch theo ID
export const getTransactionById = async (transactionId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/payment-transactions/${transactionId}`
    )
    return response.data
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết giao dịch ${transactionId}:`, error)
    return null
  }
}

// ✅ Cập nhật giao dịch
export const updateTransactionById = async (transactionId, updateData) => {
  try {
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/payment-transactions/${transactionId}`,
      updateData
    )
    return response.data
  } catch (error) {
    console.error(`Lỗi khi cập nhật giao dịch ${transactionId}:`, error)
    return null
  }
}

// ✅ Xoá giao dịch
export const deleteTransactionById = async (transactionId) => {
  try {
    await AuthorizedAxiosInstance.delete(
      `${API_ROOT}/v1/payment-transactions/${transactionId}`
    )
    return true
  } catch (error) {
    console.error(`Lỗi khi xoá giao dịch ${transactionId}:`, error)
    return false
  }
}

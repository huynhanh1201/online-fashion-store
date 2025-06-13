import { useState } from 'react'
import {
  getAllTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById
} from '~/services/admin/transactionService'

const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(false)

  // ✅ Không cần truyền orderId nếu gọi toàn bộ
  const fetchTransactions = async (page = 1, limit = 10, filter) => {
    setLoading(true)
    const buildQuery = (input) => {
      const query = { page, limit, ...input }
      Object.keys(query).forEach((key) => {
        if (
          query[key] === '' ||
          query[key] === undefined ||
          query[key] === null
        ) {
          delete query[key]
        }
      })
      return query
    }
    try {
      const query = buildQuery(filter)
      const { transactions, total } = await getAllTransactions(query)
      setTransactions(transactions)
      setTotalPages(total)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giao dịch:', error)
    }
    setLoading(false)
  }

  const getTransactionDetail = async (transactionId) => {
    return await getTransactionById(transactionId)
  }

  const updateTransaction = async (transactionId, data) => {
    return await updateTransactionById(transactionId, data)
  }

  const deleteTransaction = async (transactionId) => {
    return await deleteTransactionById(transactionId)
  }

  return {
    transactions,
    totalPages,
    loading,
    fetchTransactions,
    getTransactionDetail,
    updateTransaction,
    deleteTransaction
  }
}

export default useTransactions

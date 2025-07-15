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
    try {
      const updatedTransaction = await updateTransactionById(
        transactionId,
        data
      )
      if (updatedTransaction) {
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction._id === transactionId ? updatedTransaction : transaction
          )
        )
        return updatedTransaction
      } else {
        console.error('Cập nhật giao dịch thất bại')
        return null
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật giao dịch:', error)
      return null
    }
  }

  const deleteTransaction = async (transactionId) => {
    try {
      const response = await deleteTransactionById(transactionId)
      if (response) {
        setTransactions((prev) =>
          prev.filter((transaction) => transaction._id !== transactionId)
        )
        setTotalPages((prev) => prev - 1)
        return true
      } else {
        console.error('Xoá giao dịch thất bại')
        return false
      }
    } catch (error) {
      console.error('Lỗi khi xoá giao dịch:', error)
      return false
    }
  }

  const Save = (data) => {
    setTransactions((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }

  return {
    transactions,
    totalPages,
    loading,
    fetchTransactions,
    getTransactionDetail,
    updateTransaction,
    deleteTransaction,
    Save
  }
}

export default useTransactions

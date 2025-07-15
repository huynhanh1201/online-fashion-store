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

  const updateTransaction = async (transactionId, newData) => {
    try {
      const oldTransaction = transactions.find(
        (transaction) => transaction._id === transactionId
      )
      if (!oldTransaction) return null

      const noteChanged = newData.note !== oldTransaction.note
      const statusChanged = newData.status !== oldTransaction.status

      // Nếu không có gì thay đổi thì bỏ qua
      if (!noteChanged && !statusChanged) {
        console.log('Không có thay đổi, bỏ qua cập nhật.')
        return oldTransaction
      }

      // Luôn gửi cả 2 nếu có 1 thay đổi
      const changedData = {
        note: newData.note,
        status: newData.status
      }

      // Gửi request cập nhật
      await updateTransactionById(transactionId, changedData)

      // Cập nhật lại trong state
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === transactionId
            ? {
                ...transaction,
                ...changedData
              }
            : transaction
        )
      )

      return {
        ...oldTransaction,
        ...changedData
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

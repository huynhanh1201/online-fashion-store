import { useState } from 'react'
import {
  getAllTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById
} from '~/services/admin/transactionService'

const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  // ✅ Không cần truyền orderId nếu gọi toàn bộ
  const fetchTransactions = async () => {
    setLoading(true)
    const data = await getAllTransactions()
    setTransactions(data)
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
    loading,
    fetchTransactions,
    getTransactionDetail,
    updateTransaction,
    deleteTransaction
  }
}

export default useTransactions

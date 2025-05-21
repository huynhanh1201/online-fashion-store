import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import TransactionTable from './TransactionTable'
import TransactionPagination from './TransactionPagination'
import ViewTransactionModal from './modal/ViewTransactionModal'
import EditTransactionModal from './modal/EditTransactionModal'
import DeleteTransactionModal from './modal/DeleteTransactionModal'
import useTransactions from '~/hooks/admin/useTransactions'
// import useOrder from '~/hook/useOrder.js'

const TransactionManagement = () => {
  const [page, setPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const {
    transactions,
    loading,
    fetchTransactions,
    getTransactionDetail,
    updateTransaction,
    deleteTransaction
  } = useTransactions()

  useEffect(() => {
    fetchTransactions()
  }, [page])

  const handleOpenView = async (transaction) => {
    const detail = await getTransactionDetail(transaction._id)
    setSelectedTransaction(detail)
    setOpenView(true)
  }

  const handleOpenEdit = async (transaction) => {
    const detail = await getTransactionDetail(transaction._id)
    setSelectedTransaction(detail)
    setOpenEdit(true)
  }

  const handleOpenDelete = async (transaction) => {
    const detail = await getTransactionDetail(transaction._id)
    setSelectedTransaction(detail)
    setOpenDelete(true)
  }

  const handleUpdateTransaction = async (transactionId, data) => {
    await updateTransaction(transactionId, data)
    fetchTransactions()
    setOpenEdit(false)
  }

  const handleDeleteTransaction = async (transactionId) => {
    await deleteTransaction(transactionId)
    fetchTransactions()
    setOpenDelete(false)
  }

  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Quản lý giao dịch
      </Typography>

      <TransactionTable
        transactions={transactions}
        loading={loading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <TransactionPagination
        page={page}
        totalPages={1}
        onPageChange={setPage}
      />

      {selectedTransaction && (
        <ViewTransactionModal
          open={openView}
          onClose={() => setOpenView(false)}
          transaction={selectedTransaction}
        />
      )}

      {selectedTransaction && (
        <EditTransactionModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          transaction={selectedTransaction}
          onUpdate={handleUpdateTransaction}
          loading={loading}
        />
      )}

      {selectedTransaction && (
        <DeleteTransactionModal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          transaction={selectedTransaction}
          onDelete={handleDeleteTransaction}
          loading={loading}
        />
      )}
    </>
  )
}

export default TransactionManagement

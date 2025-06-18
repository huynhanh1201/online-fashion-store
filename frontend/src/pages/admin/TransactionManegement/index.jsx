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
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState({})
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const {
    totalPages,
    transactions,
    loading,
    fetchTransactions,
    getTransactionDetail,
    updateTransaction,
    deleteTransaction,
    Save
  } = useTransactions()

  useEffect(() => {
    fetchTransactions(page, limit, filters)
  }, [page, limit, filters])

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
    try {
      const response = await updateTransaction(transactionId, data)
      if (response) {
        const update = await getTransactionDetail(transactionId)
        if (update) {
          Save(update)
          setOpenEdit(false)
        }
      } else {
        console.log('Câp nhật giao dịch thất bại')
      }
    } catch (error) {
      console.error('Cập nhật giao dịch thất bại:', error)
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await deleteTransaction(transactionId)
      if (response) {
        const remove = await getTransactionDetail(transactionId)
        if (remove) {
          Save(remove)
          setOpenDelete(false)
        }
      } else {
        console.log('Xoá giao dịch thất bại')
      }
    } catch (error) {
      console.error('Xoá giao dịch thất bại:', error)
    }
  }

  const handleChangePage = (event, value) => setPage(value)

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
    }
  }
  return (
    <>
      <TransactionTable
        transactions={transactions}
        loading={loading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onFilter={handleFilter}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
        fetchTransactions={fetchTransactions}
      />

      {/*<TransactionPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={1}*/}
      {/*  onPageChange={setPage}*/}
      {/*/>*/}

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

import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import TransactionTable from './TransactionTable'
import TransactionPagination from './TransactionPagination'
import ViewTransactionModal from './modal/ViewTransactionModal'
import EditTransactionModal from './modal/EditTransactionModal'
import DeleteTransactionModal from './modal/DeleteTransactionModal'
import useTransactions from '~/hooks/admin/useTransactions'
import usePermissions from '~/hooks/usePermissions'
import { RouteGuard, PermissionWrapper } from '~/components/PermissionGuard'
// import useOrder from '~/hook/useOrder.js'

const TransactionManagement = () => {
  const { hasPermission } = usePermissions()
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
    if (!hasPermission('payment:read')) return

    const detail = await getTransactionDetail(transaction._id)
    setSelectedTransaction(detail)
    setOpenView(true)
  }

  const handleOpenEdit = async (transaction) => {
    if (!hasPermission('payment:update')) return

    const detail = await getTransactionDetail(transaction._id)
    setSelectedTransaction(detail)
    setOpenEdit(true)
  }

  const handleOpenDelete = async (transaction) => {
    if (!hasPermission('payment:delete')) return

    const detail = await getTransactionDetail(transaction._id)
    setSelectedTransaction(detail)
    setOpenDelete(true)
  }

  const handleUpdateTransaction = async (transactionId, data) => {
    try {
      await updateTransaction(transactionId, data)
      setOpenEdit(false)
    } catch (error) {
      console.error('Cập nhật giao dịch thất bại:', error)
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId)
      setOpenDelete(false)
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
    <RouteGuard requiredPermissions={['admin:access', 'payment:read']}>
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
        permissions={{
          canView: hasPermission('payment:read'),
          canEdit: hasPermission('payment:update'),
          canDelete: hasPermission('payment:delete')
        }}
      />

      {/*<TransactionPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={1}*/}
      {/*  onPageChange={setPage}*/}
      {/*/>*/}

      <PermissionWrapper requiredPermissions={['payment:read']}>
        {selectedTransaction && (
          <ViewTransactionModal
            open={openView}
            onClose={() => setOpenView(false)}
            transaction={selectedTransaction}
          />
        )}
      </PermissionWrapper>

      <PermissionWrapper requiredPermissions={['payment:update']}>
        {selectedTransaction && (
          <EditTransactionModal
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            transaction={selectedTransaction}
            onUpdate={handleUpdateTransaction}
            loading={loading}
          />
        )}
      </PermissionWrapper>

      <PermissionWrapper requiredPermissions={['payment:delete']}>
        {selectedTransaction && (
          <DeleteTransactionModal
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            transaction={selectedTransaction}
            onDelete={handleDeleteTransaction}
            loading={loading}
          />
        )}
      </PermissionWrapper>
    </RouteGuard>
  )
}

export default TransactionManagement

import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import InventoryLogTable from './InventoryLogTable'
import InventoryLogPagination from './InventoryLogPagination'
import useInventoryLogs from '~/hooks/admin/Inventory/useInventoryLogs'
import ViewInventoryLogModal from '~/pages/admin/InventoryLogManagement/modal/ViewInventoryLogModal.jsx'
const InventoryLogPage = () => {
  const [page, setPage] = useState(1)
  const { logs, totalPages, loading, fetchLogs } = useInventoryLogs(page)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [selectedLogId, setSelectedLogId] = useState(null)
  useEffect(() => {
    fetchLogs(page)
  }, [page])

  const handleOpenModal = (type, logId) => {
    if (type === 'view') {
      setSelectedLogId(logId)
      setOpenViewModal(true)
    }
  }
  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Nhật ký nhập xuất kho
      </Typography>

      <InventoryLogTable
        logs={logs}
        loading={loading}
        onViewLog={handleOpenModal}
      />
      <React.Suspense fallback={<></>}>
        <ViewInventoryLogModal
          open={openViewModal}
          onClose={() => setOpenViewModal(false)}
          logId={selectedLogId}
        />
      </React.Suspense>
      <InventoryLogPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(e, val) => setPage(val)}
      />
    </>
  )
}

export default InventoryLogPage

import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import InventoryLogTable from './InventoryLogTable'
import InventoryLogPagination from './InventoryLogPagination'
import useInventoryLogs from '~/hooks/admin/useInventoryLogs'

const InventoryLogPage = () => {
  const [page, setPage] = useState(1)
  const { logs, totalPages, loading, fetchLogs } = useInventoryLogs(page)

  useEffect(() => {
    fetchLogs(page)
  }, [page])
  console.log('Inventory logs index:', logs)
  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Nhật ký nhập xuất kho
      </Typography>

      <InventoryLogTable logs={logs} loading={loading} />

      <InventoryLogPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(e, val) => setPage(val)}
      />
    </>
  )
}

export default InventoryLogPage

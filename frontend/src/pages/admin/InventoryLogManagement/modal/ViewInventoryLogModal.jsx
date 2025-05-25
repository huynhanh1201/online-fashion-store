import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress
} from '@mui/material'
import { getInventoryLogDetail } from '~/services/admin/inventoryService'

const ViewInventoryLogModal = ({ open, onClose, logId }) => {
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && logId) {
      setLoading(true)
      getInventoryLogDetail(logId)
        .then((data) => setLog(data))
        .finally(() => setLoading(false))
    }
  }, [open, logId])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết nhật ký kho</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : log ? (
          <>
            <Typography>
              <strong>SKU:</strong> {log.variant?.sku}
            </Typography>
            <Typography>
              <strong>Màu:</strong> {log.variant?.color.name}
            </Typography>
            <Typography>
              <strong>Size:</strong> {log.variant?.size.name}
            </Typography>
            <Typography>
              <strong>Loại:</strong> {log.type}
            </Typography>
            <Typography>
              <strong>Số lượng:</strong> {log.amount}
            </Typography>
            <Typography>
              <strong>Giá nhập:</strong> {log.importPrice}
            </Typography>
            <Typography>
              <strong>Giá bán:</strong> {log.exportPrice}
            </Typography>
            <Typography>
              <strong>Ghi chú:</strong> {log.note || '-'}
            </Typography>
            <Typography>
              <strong>Ngày tạo:</strong>{' '}
              {new Date(log.createdAt).toLocaleString()}
            </Typography>
          </>
        ) : (
          <Typography>Không tìm thấy log.</Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewInventoryLogModal

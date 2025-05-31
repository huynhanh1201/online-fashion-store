// modal/InventoryLog/ViewInventoryLogModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box
} from '@mui/material'

const ViewInventoryLogModal = ({
  open,
  onClose,
  log,
  variants,
  warehouses
}) => {
  if (!log) return null

  // Ánh xạ variantId và warehouseId sang tên
  const variant = variants.find((v) => v.id === log.variantId)
  const warehouse = warehouses.find((w) => w.id === log.warehouseId)

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết lịch sử biến động kho</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='subtitle1'>
            <strong>Mã phiếu:</strong> {log.source || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Biến thể:</strong>{' '}
            {log.variantName || variant?.name || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Kho:</strong> {log.warehouse || warehouse?.name || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Loại:</strong>{' '}
            <Chip
              label={log.typeLabel || (log.type === 'in' ? 'Nhập' : 'Xuất')}
              color={log.type === 'in' ? 'success' : 'warning'}
              size='small'
            />
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Số lượng:</strong> {log.amount || 0}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Giá nhập:</strong>{' '}
            {log.importPrice
              ? log.importPrice.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })
              : 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Giá xuất:</strong>{' '}
            {log.exportPrice
              ? log.exportPrice.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })
              : 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Ghi chú:</strong> {log.note || 'Không có'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Người thực hiện:</strong>{' '}
            {log.createdByName || log.createdBy?.name || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Ngày thực hiện:</strong>{' '}
            {log.createdAtFormatted ||
              new Date(log.createdAt).toLocaleString('vi-VN') ||
              'N/A'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryLogModal

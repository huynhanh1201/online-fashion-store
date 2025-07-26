// Chart/InventoryLog/ViewInventoryLogModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider
} from '@mui/material'

const ViewInventoryLogModal = ({ open, onClose, log }) => {
  if (!log) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      sx={{ width: '100%', minWidth: '600px' }}
    >
      <DialogTitle>
        Thông tin lịch sử phiếu {log.type === 'in' ? 'nhập' : 'xuất'} kho
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>
                  Mã phiếu {log.type === 'in' ? 'nhập' : 'xuất'} kho
                </strong>
              </TableCell>
              <TableCell>{log.source || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>Tên sản phẩm</strong>
              </TableCell>
              <TableCell>
                {log.inventoryId?.variantId?.name
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || 'Không có dữ liệu'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>Kho hàng</strong>
              </TableCell>
              <TableCell>
                {log.inventoryId?.warehouseId?.name
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || 'Không có dữ liệu'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>Loại phiếu</strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={log.typeLabel || (log.type === 'in' ? 'Nhập' : 'Xuất')}
                  color={log.type === 'in' ? 'success' : 'error'}
                  size='large'
                  sx={{
                    width: '120px',
                    fontWeight: '800',
                    backgroundColor: log.type === 'in' && '#4CAF50'
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>Số lượng</strong>
              </TableCell>
              <TableCell>
                {log.amount
                  ? `${Number(log.amount).toLocaleString('vi-VN')}`
                  : 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>Giá nhập</strong>
              </TableCell>
              <TableCell>
                {log.importPrice
                  ? `${Number(log.importPrice).toLocaleString('vi-VN')}₫`
                  : '0₫'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>Giá xuất</strong>
              </TableCell>
              <TableCell>
                {log.exportPrice
                  ? `${Number(log.exportPrice).toLocaleString('vi-VN')}₫`
                  : '0₫'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong sx={{ minWidth: 200 }}>Ghi chú</strong>
              </TableCell>
              <TableCell>{log.note || 'Không có'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>Người thực hiện</strong>
              </TableCell>
              <TableCell>
                {log?.createdBy?.name
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderBottom: 0, minWidth: 200 }}>
                <strong>Ngày tạo phiếu</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                {log.createdAtFormatted ||
                  (log.createdAt
                    ? new Date(log.createdAt).toLocaleString('vi-VN')
                    : 'N/A')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          variant='outlined'
          color='error'
          sx={{
            textTransform: 'none'
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryLogModal

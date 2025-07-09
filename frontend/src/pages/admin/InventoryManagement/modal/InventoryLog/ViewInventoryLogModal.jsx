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
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        Thông tin lịch sử phiếu {log.type === 'in' ? 'nhập' : 'xuất'} kho
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>
                  Mã phiếu {log.type === 'in' ? 'nhập' : 'xuất'} kho
                </strong>
              </TableCell>
              <TableCell>{log.source || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
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
              <TableCell>
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
              <TableCell>
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
                    backgroundColor: log.type === 'in' && 'var(--primary-color)'
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Số lượng</strong>
              </TableCell>
              <TableCell>
                {log.amount
                  ? `${Number(log.amount).toLocaleString('vi-VN')}`
                  : 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá nhập</strong>
              </TableCell>
              <TableCell>
                {log.importPrice
                  ? `${Number(log.importPrice).toLocaleString('vi-VN')}₫`
                  : '0₫'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
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
                <strong>Ghi chú</strong>
              </TableCell>
              <TableCell>{log.note || 'Không có'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
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
              <TableCell sx={{ borderBottom: 0 }}>
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

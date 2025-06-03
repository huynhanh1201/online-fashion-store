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
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

const ViewInventoryLogModal = ({ open, onClose, log }) => {
  if (!log) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết lịch sử biến động kho</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Mã phiếu</strong>
              </TableCell>
              <TableCell>{log.source || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Biến thể</strong>
              </TableCell>
              <TableCell>
                {log.inventoryId?.variantId?.name || 'Không có dữ liệu'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Kho</strong>
              </TableCell>
              <TableCell>
                {log.inventoryId?.warehouseId?.name || 'Không có dữ liệu'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Loại</strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={log.typeLabel || (log.type === 'in' ? 'Nhập' : 'Xuất')}
                  color={log.type === 'in' ? 'success' : 'warning'}
                  size='small'
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Số lượng</strong>
              </TableCell>
              <TableCell>{log.amount || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá nhập</strong>
              </TableCell>
              <TableCell>
                {log.importPrice
                  ? log.importPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá xuất</strong>
              </TableCell>
              <TableCell>
                {log.exportPrice
                  ? log.exportPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'N/A'}
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
                {log.createdByName || log.createdBy?.name || 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ngày thực hiện</strong>
              </TableCell>
              <TableCell>
                {log.createdAtFormatted ||
                  (log.createdAt
                    ? new Date(log.createdAt).toLocaleString('vi-VN')
                    : 'N/A')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='primary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryLogModal

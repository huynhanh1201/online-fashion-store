import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Divider
} from '@mui/material'

export default function ViewWarehouseModal({ open, onClose, warehouse }) {
  if (!warehouse) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ pl: 5 }}>Thông tin kho hàng</DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Mã kho hàng</strong>
              </TableCell>
              <TableCell>{warehouse.code || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tên kho hàng</strong>
              </TableCell>
              <TableCell>
                {warehouse.name
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || '-'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Địa chỉ</strong>
              </TableCell>
              <TableCell>{warehouse.address || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Phường</strong>
              </TableCell>
              <TableCell>{warehouse.ward || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Quận</strong>
              </TableCell>
              <TableCell>{warehouse.district || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Thành phố</strong>
              </TableCell>
              <TableCell>{warehouse.city || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ngày tạo</strong>
              </TableCell>
              <TableCell>{formatDate(warehouse.createdAt)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderBottom: 0 }}>
                <strong>Ngày cập nhật</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                {formatDate(warehouse.updatedAt)}
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
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

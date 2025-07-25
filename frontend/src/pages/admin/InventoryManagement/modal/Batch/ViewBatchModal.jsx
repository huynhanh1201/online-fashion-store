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
  Divider
} from '@mui/material'

const ViewBatchModal = ({ open, onClose, batch }) => {
  if (!batch) return null
  const variantName = batch?.variantId?.name || 'Không có dữ liệu'

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      sx={{ width: '100%', minWidth: '600px' }}
    >
      <DialogTitle>Thông tin lô Hàng</DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Mã lô hàng</strong>
              </TableCell>
              <TableCell>{batch.batchCode || 'Không có dữ liệu'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tên sản phẩm</strong>
              </TableCell>
              <TableCell>
                {variantName
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Số lượng sản phẩm</strong>
              </TableCell>
              <TableCell>{batch.quantity ?? 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá nhập</strong>
              </TableCell>
              <TableCell>
                {batch.importPrice
                  ? `${Number(batch.importPrice).toLocaleString('vi-VN')}₫`
                  : '0₫'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ngày sản xuất</strong>
              </TableCell>
              <TableCell>
                {formatDate(batch.manufactureDate) || 'Không có thông tin'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ngày tạo</strong>
              </TableCell>
              <TableCell>{formatDate(batch.createdAt)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderBottom: 0 }}>
                <strong>Ngày cập nhật</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                {formatDate(batch.updatedAt)}
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
          sx={{ textTransform: 'none' }}
          color='error'
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewBatchModal

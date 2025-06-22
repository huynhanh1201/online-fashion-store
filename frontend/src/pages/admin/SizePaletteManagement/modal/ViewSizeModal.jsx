import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import dayjs from 'dayjs'
import Chip from '@mui/material/Chip'

const ViewSizeModal = ({ open, onClose, size }) => {
  if (!size) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Xem chi tiết kích thước</DialogTitle>
      <DialogContent dividers sx={{ py: 0 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {/* Cột phải: bảng thông tin */}
          <Box sx={{ flex: 1 }}>
            <Table size='small'>
              <TableBody>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Tên sản phẩm</strong>
                  </TableCell>
                  <TableCell>
                    {size?.product?.name || 'Không xác định'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Tên kích thước</strong>
                  </TableCell>
                  <TableCell>{size.name || 'Không xác định'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={size.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      color={size.isActive ? 'success' : 'error'}
                      size='medium'
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>
                    {size.createdAt
                      ? dayjs(size.createdAt).format('HH:mm DD/MM/YYYY')
                      : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head' sx={{ borderBottom: 0 }}>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 0 }}>
                    {size.updatedAt
                      ? dayjs(size.updatedAt).format('HH:mm DD/MM/YYYY')
                      : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewSizeModal

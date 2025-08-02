import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@mui/material'

const getPartnerTypeLabel = (type) => {
  switch (type) {
    case 'supplier':
      return (
        <Chip
          label='Nhà cung cấp'
          color='primary'
          size='large'
          sx={{ width: '120px', fontWeight: '800' }}
        />
      )
    case 'customer':
      return (
        <Chip
          label='Khách hàng'
          color='success'
          size='large'
          sx={{ width: '120px', fontWeight: '800' }}
        />
      )
    case 'both':
      return (
        <Chip
          label='Khách hàng & NCC'
          color='warning'
          size='large'
          sx={{ width: '137px', fontWeight: '800' }}
        />
      )
    default:
      return (
        <Chip
          label='Không xác định'
          size='large'
          sx={{ width: '120px', fontWeight: '800' }}
        />
      )
  }
}

const formatDateTime = (dateString) => {
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

export default function ViewPartnerModal({ open, onClose, partner }) {
  if (!partner) return null
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      sx={{
        '& .MuiDialog-paper': {
          width: 'auto', // Chiều rộng theo nội dung
          maxWidth: 'md', // Giới hạn không vượt quá md
          minWidth: 500 // (tuỳ chọn) đảm bảo không quá nhỏ
        }
      }}
    >
      <DialogTitle>Thông tin đối tác</DialogTitle>
      <DialogContent dividers sx={{ py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Tên đối tác</strong>
              </TableCell>
              <TableCell>
                {partner.name
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || '---'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Kiểu đối tác</strong>
              </TableCell>
              <TableCell>{getPartnerTypeLabel(partner.type)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Số điện thoại</strong>
              </TableCell>
              <TableCell>{partner.contact?.phone || '---'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                {partner.contact?.email || 'Không có dữ liệu'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ngày tạo</strong>
              </TableCell>
              <TableCell>{formatDateTime(partner.createdAt)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderBottom: 0 }}>
                <strong>Ngày cập nhật</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                {formatDateTime(partner.updatedAt)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none' }}
          color='error'
          variant='outlined'
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

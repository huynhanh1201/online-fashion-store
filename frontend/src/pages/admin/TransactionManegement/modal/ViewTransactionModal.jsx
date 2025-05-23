import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewTransactionModal = ({ open, onClose, transaction }) => {
  const statusLabel = {
    Pending: 'Chờ xử lý',
    Completed: 'Thành công',
    Failed: 'Thất bại'
  }

  if (!transaction) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Chi tiết giao dịch</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label='Mã giao dịch'
            value={transaction.transactionId || '(Thanh toán COD)'}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Mã đơn hàng'
            value={
              typeof transaction.orderId === 'object'
                ? transaction.orderId._id
                : transaction.orderId
            }
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Phương thức thanh toán'
            value={transaction.method}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Trạng thái'
            value={statusLabel[transaction.status] || 'Không xác định'}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Số tiền'
            value={
              transaction.orderId.total
                ? `${transaction.orderId.total.toLocaleString()} VNĐ`
                : 'Không có thông tin'
            }
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Ngày tạo'
            value={new Date(transaction.createdAt).toLocaleString()}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Ghi chú'
            value={transaction.note || ' '}
            multiline
            rows={3}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewTransactionModal

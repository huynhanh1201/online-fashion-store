import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

export default function CancelOrderModal({ open, onClose, order, onCancel }) {
  if (!order) return null

  const handleConfirmCancel = () => {
    onCancel(order)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Huỷ đơn hàng</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn huỷ đơn hàng <strong>{order.id}</strong> không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Không</Button>
        <Button onClick={handleConfirmCancel} color='error'>
          Xác nhận huỷ
        </Button>
      </DialogActions>
    </Dialog>
  )
}

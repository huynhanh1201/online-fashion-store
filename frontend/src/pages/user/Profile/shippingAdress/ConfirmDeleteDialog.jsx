import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

function ConfirmDeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa địa chỉ này?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color='error'
          sx={{ textTransform: 'none' }}
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog

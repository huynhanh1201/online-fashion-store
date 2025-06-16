import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const DeleteBatchModal = ({ open, onClose, onSave, batch }) => {
  if (!batch) return null

  const handleDelete = () => {
    onSave(batch._id)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Ẩn Lô Hàng</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn ẩn lô hàng <strong>{batch.batchCode}</strong>{' '}
          không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          sx={{ textTransform: 'none' }}
        >
          Huỷ
        </Button>
        <Button
          onClick={handleDelete}
          color='error'
          variant='contained'
          sx={{ textTransform: 'none' }}
        >
          Ẩn
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteBatchModal

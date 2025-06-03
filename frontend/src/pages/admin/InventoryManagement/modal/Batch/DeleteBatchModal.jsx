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
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Xoá Lô Hàng</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xoá lô <strong>{batch.batchCode}</strong> không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleDelete} color='error' variant='contained'>
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteBatchModal

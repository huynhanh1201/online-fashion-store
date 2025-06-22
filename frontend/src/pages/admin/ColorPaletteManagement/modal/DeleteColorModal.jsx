import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const DeleteColorModal = ({ open, onClose, color, onDelete }) => {
  const handleDelete = () => {
    onDelete(color._id, 'delete')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xoá màu: <b>{color?.name}</b> không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none' }}
          color='inherit'
        >
          Huỷ
        </Button>
        <Button
          onClick={handleDelete}
          color='error'
          variant='contained'
          sx={{ textTransform: 'none' }}
        >
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteColorModal

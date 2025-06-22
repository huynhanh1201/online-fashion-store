import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const DeleteSizeModal = ({ open, onClose, size, onDelete }) => {
  const handleDelete = () => {
    onDelete(size._id, 'delete')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xoá kích thước: <b>{size?.name}</b> không?
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

export default DeleteSizeModal

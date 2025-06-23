import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const DeleteRoleModal = ({ open, onClose, role, onSubmit }) => {
  const handleDelete = () => {
    if (role?._id) {
      onSubmit(role._id, 'delete')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Xoá vai trò</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xoá vai trò <strong>{role?.label}</strong>{' '}
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
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteRoleModal

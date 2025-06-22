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
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Xoá vai trò</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xoá vai trò "{role?.label}" không?
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

export default DeleteRoleModal

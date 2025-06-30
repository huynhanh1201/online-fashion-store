import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const RestoreRoleModal = ({ open, onClose, role, onSubmit }) => {
  const handleRestore = () => {
    if (role?._id) {
      onSubmit(role._id, 'restore')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Khôi phục vai trò</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn <strong>khôi phục</strong> vai trò{' '}
          <strong>{role?.label}</strong> không?
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
          onClick={handleRestore}
          color='primary'
          variant='contained'
          sx={{ textTransform: 'none' }}
        >
          Khôi phục
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RestoreRoleModal

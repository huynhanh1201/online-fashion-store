import React, { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider
} from '@mui/material'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const DeleteUserModal = ({ open, onClose, user, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(user._id, 'delete')
      onClose()
    } catch (error) {
      console.error('Xoá người dùng thất bại:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Xoá người dùng</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        Bạn có chắc chắn muốn xoá người dùng{' '}
        <strong>{user?.name || user?.email || 'Không xác định'}</strong> không?
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          disabled={isDeleting}
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          color='error'
          variant='contained'
          disabled={isDeleting}
          sx={{ textTransform: 'none' }}
        >
          {isDeleting ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUserModal

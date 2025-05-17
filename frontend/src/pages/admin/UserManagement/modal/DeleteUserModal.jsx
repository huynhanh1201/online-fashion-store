import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography
} from '@mui/material'
import { dialogTitleStyle, cancelButtonStyle } from './StyleModal.js'
import styleAdmin from '~/components/StyleAdmin.jsx'

const DeleteUserModal = React.memo(({ open, onClose, user, onDelete }) => {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!user?._id) return
    setIsDeleting(true)
    try {
      await onDelete(user._id)
      onClose()
    } catch (error) {
      console.error('Xóa người dùng thất bại:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      BackdropProps={{
        sx: styleAdmin.OverlayModal
      }}
    >
      <DialogTitle sx={dialogTitleStyle}>Xác nhận xóa người dùng</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xóa người dùng{' '}
          <strong>
            {user?.name
              ?.toLowerCase()
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ') || ''}
          </strong>{' '}
          không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          color='inherit'
          onClick={onClose}
          disabled={isDeleting}
          sx={cancelButtonStyle}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : null}
        >
          {isDeleting ? 'Đang xóa' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default DeleteUserModal

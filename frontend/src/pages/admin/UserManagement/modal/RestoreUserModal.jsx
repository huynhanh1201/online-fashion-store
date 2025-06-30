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

const RestoreUserModal = ({ open, onClose, user, onRestore }) => {
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestore = async () => {
    setIsRestoring(true)
    try {
      await onRestore(user._id, 'restore')
      onClose()
    } catch (error) {
      console.error('Khôi phục người dùng thất bại:', error)
    } finally {
      setIsRestoring(false)
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
      <DialogTitle>Khôi phục khách hàng</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        Bạn có chắc chắn muốn <strong>khôi phục</strong> khách hàng{' '}
        <strong>{user?.name || user?.email || 'Không xác định'}</strong> không?
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          disabled={isRestoring}
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleRestore}
          color='primary'
          variant='contained'
          disabled={isRestoring}
          sx={{ textTransform: 'none' }}
        >
          {isRestoring ? 'Đang khôi phục...' : 'Khôi phục'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RestoreUserModal

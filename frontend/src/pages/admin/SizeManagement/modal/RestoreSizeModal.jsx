import React, { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const RestoreSizeModal = ({ open, onClose, size, onRestored }) => {
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestore = async () => {
    setIsRestoring(true)
    console.log('Khôi phục kích thước:', size._id)
    try {
      await onRestored(size._id, 'restore')
      onClose()
    } catch (error) {
      console.error('Khôi phục kích thước thất bại:', error)
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
      <DialogTitle>Khôi phục kích thước</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        Bạn có chắc chắn muốn khôi phục kích thước <strong>{size?.name}</strong>{' '}
        này không?
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

export default RestoreSizeModal

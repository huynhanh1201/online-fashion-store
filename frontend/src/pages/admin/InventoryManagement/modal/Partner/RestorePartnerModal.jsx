import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

export default function RestorePartnerModal({
  open,
  onClose,
  partner,
  restorePartner
}) {
  if (!partner) return null

  const handleRestore = async () => {
    try {
      await restorePartner(partner._id, 'restore')
      onClose()
    } catch (error) {
      console.error('Khôi phục đối tác thất bại:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Khôi phục đối tác</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn khôi phục đối tác{' '}
          <strong>{partner.name}</strong> này không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          sx={{ textTransform: 'none' }}
        >
          Hủy
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

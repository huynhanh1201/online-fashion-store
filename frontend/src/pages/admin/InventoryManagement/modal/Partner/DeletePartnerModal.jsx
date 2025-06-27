import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

export default function DeletePartnerModal({
  open,
  onClose,
  partner,
  deletePartner
}) {
  if (!partner) return null
  const handleDelete = () => {
    deletePartner(partner._id, 'delete')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Xóa đối tác</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xóa đối tác <strong>{partner.name}</strong> này
          không?
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
          onClick={handleDelete}
          color='error'
          variant='contained'
          sx={{ textTransform: 'none' }}
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}

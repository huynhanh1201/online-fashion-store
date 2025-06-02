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
  console.log('DeletePartnerModal rendered with partner:', partner)
  const handleDelete = () => {
    deletePartner(partner._id)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>Xóa đối tác</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xóa đối tác <strong>{partner.name}</strong>{' '}
          không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Hủy
        </Button>
        <Button onClick={handleDelete} color='error' variant='contained'>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}

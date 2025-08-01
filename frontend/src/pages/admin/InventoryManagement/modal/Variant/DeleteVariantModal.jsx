// Chart/Variant/DeleteVariantModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider
} from '@mui/material'
import { toast } from 'react-toastify'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const DeleteVariantModal = ({ open, onClose, variant, deleteVariant }) => {
  const handleDelete = async () => {
    try {
      await deleteVariant(variant._id, 'delete')
      onClose()
    } catch (error) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      sx={{ padding: '16px 24px' }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Xóa biến thể</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xóa biến thể
          <strong> {variant?.name || 'N/A'}</strong> không?
        </Typography>
      </DialogContent>
      <Divider />
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

export default DeleteVariantModal

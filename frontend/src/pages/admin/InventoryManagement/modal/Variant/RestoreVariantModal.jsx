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

const RestoreVariantModal = ({ open, onClose, variant, restoreVariant }) => {
  const handleRestore = async () => {
    try {
      await restoreVariant(variant._id, 'restore')
      onClose()
    } catch (error) {
      toast.error(
        `Khôi phục biến thể thất bại: ${error?.message || 'Đã xảy ra lỗi không xác định'}`
      )
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ padding: '16px 24px' }}
      maxWidth='sm'
      fullWidth
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Khôi phục biến thể</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          Bạn có chắc muốn khôi phục biến thể
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

export default RestoreVariantModal

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const RestoreReviewModal = ({ open, onClose, review, onRestore }) => {
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestore = async () => {
    setIsRestoring(true)
    try {
      await onRestore(review._id, 'restore')
      onClose()
    } catch (error) {
      console.error('Khôi phục đánh giá thất bại:', error)
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
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Khôi phục đánh giá</DialogTitle>
      <Divider />
      <DialogContent>
        Bạn có chắc chắn muốn khôi phục đánh giá của sản phẩm{' '}
        <strong>{review?.productId?.name || 'Không rõ'}</strong> không?
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='inherit' disabled={isRestoring}>
          Hủy
        </Button>
        <Button
          onClick={handleRestore}
          color='primary'
          variant='contained'
          disabled={isRestoring}
        >
          {isRestoring ? 'Đang khôi phục...' : 'Khôi phục'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RestoreReviewModal

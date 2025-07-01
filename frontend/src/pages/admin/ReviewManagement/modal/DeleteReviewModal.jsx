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

const DeleteReviewModal = ({ open, onClose, review, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(review._id, 'delete')
      onClose()
    } catch (error) {
      console.error('Xoá đánh giá thất bại:', error)
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
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Xoá đánh giá</DialogTitle>
      <Divider />
      <DialogContent>
        Bạn có chắc chắn muốn xoá đánh giá của sản phẩm{' '}
        <strong>
          {review?.productId?.name || review?.productId?._id || 'Không rõ'}
        </strong>{' '}
        không?
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='inherit' disabled={isDeleting}>
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          color='error'
          variant='contained'
          disabled={isDeleting}
        >
          {isDeleting ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteReviewModal

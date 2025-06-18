import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material'

const DeleteReviewModal = ({ open, onClose, review, onDelete }) => {
  if (!review) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Xác nhận xoá đánh giá</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xoá đánh giá của{' '}
          <strong>{review.user.fullName}</strong> cho sản phẩm{' '}
          <strong>{review.productId}</strong> không?
        </Typography>
        <Typography variant='body2' color='text.secondary' mt={1}>
          "{review.comment}"
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button
          onClick={() => onDelete(review.id)}
          variant='contained'
          color='error'
        >
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteReviewModal

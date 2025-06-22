import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const DeleteBlogModal = ({ open, onClose, post, onDelete }) => {
  const handleDelete = () => {
    if (post?._id) {
      onDelete(post._id, 'delete')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xoá bài viết: <strong>{post?.title}</strong>{' '}
          không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='inherit'>
          Huỷ
        </Button>
        <Button onClick={handleDelete} variant='contained' color='error'>
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteBlogModal

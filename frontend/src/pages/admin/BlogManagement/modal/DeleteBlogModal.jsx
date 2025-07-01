import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

const DeleteBlogModal = ({ open, onClose, onConfirm, blog }) => {
  if (!blog) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Xóa bài viết
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          <Typography variant='body1'>
            Bạn có chắc chắn muốn xóa bài viết <strong>{blog?.title}</strong>{' '}
            không?
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color='error'
          sx={{ textTransform: 'none' }}
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteBlogModal

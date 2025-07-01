import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material'

const RestoreBlogModal = ({ open, onClose, onConfirm, blog }) => {
  if (!blog) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Khôi phục bài viết
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          <Typography variant='body1'>
            Bạn có chắc chắn muốn khôi phục bài viết{' '}
            <strong>{blog?.title}</strong> này không?
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
          color='primary'
          sx={{ textTransform: 'none' }}
        >
          Khôi phục
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RestoreBlogModal

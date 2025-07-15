import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import styleAdmin from '~/assets/StyleAdmin.jsx'

const DeleteOrderModal = ({ open, onClose, onConfirm, order }) => {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!order?._id) return
    setIsDeleting(true)
    try {
      await onConfirm(order._id)
      onClose()
    } catch (error) {
      console.error('Xoá đơn hàng thất bại:', error)
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
      BackdropProps={{
        sx: styleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Xác nhận ẩn đơn hàng</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn ẩn đơn hàng <strong>{order?._id || ''}</strong>{' '}
          không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button color='inherit' onClick={onClose} disabled={isDeleting}>
          Huỷ
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          sx={{ textTransform: 'none' }}
        >
          {isDeleting ? 'Đang xoá' : 'Xoá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteOrderModal

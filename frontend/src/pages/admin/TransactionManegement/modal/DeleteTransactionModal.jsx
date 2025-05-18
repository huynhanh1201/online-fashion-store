import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography
} from '@mui/material'

const DeleteTransactionModal = ({
  open,
  onClose,
  transaction,
  onDelete,
  loading
}) => {
  const handleDelete = async () => {
    await onDelete(transaction._id)
    onClose()
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: 0
        }
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: 20,
          padding: '16px 24px'
        }}
      >
        Xác nhận xoá giao dịch
      </DialogTitle>

      <DialogContent dividers sx={{ padding: '16px 24px' }}>
        <Typography>
          Bạn có chắc chắn muốn xoá giao dịch có mã{' '}
          <strong>{transaction?._id}</strong> không?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button color='inherit' onClick={onClose} disabled={loading}>
          Huỷ
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Đang xoá' : 'Xoá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteTransactionModal

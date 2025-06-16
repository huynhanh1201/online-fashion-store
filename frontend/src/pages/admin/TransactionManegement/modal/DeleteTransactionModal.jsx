import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

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
          padding: 0
        }
      }}
    >
      <DialogTitle>Ẩn giao dịch</DialogTitle>

      <DialogContent dividers sx={{ padding: '16px 24px' }}>
        <Typography>
          Bạn có chắc chắn muốn ẩn giao dịch
          <strong> {transaction?._id}</strong> không?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          color='inherit'
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: 'none'
          }}
        >
          Huỷ
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={loading}
          sx={{
            textTransform: 'none'
          }}
        >
          {loading ? 'Đang ẩn' : 'Ẩn'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteTransactionModal

// modal/Variant/DeleteVariantModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'

const DeleteVariantModal = ({ open, onClose, variant, deleteVariant }) => {
  const handleDelete = async () => {
    try {
      await deleteVariant(variant._id)
      toast.success('Xóa biến thể thành công')
      onClose()
    } catch (error) {
      toast.error('Xóa biến thể thất bại')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa biến thể</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xóa biến thể "
          <strong>{variant?.name || 'N/A'}</strong>"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleDelete} color='error'>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteVariantModal

// modal/Inventory/DeleteInventoryModal.jsx
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

const DeleteInventoryModal = ({ open, onClose, inventory, onSave }) => {
  const handleDelete = async () => {
    try {
      await onSave(inventory._id)
      toast.success('Xóa tồn kho thành công')
      onClose()
    } catch {
      toast.error('Xóa tồn kho thất bại')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa tồn kho</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc muốn xóa bản ghi tồn kho này?</Typography>
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

export default DeleteInventoryModal

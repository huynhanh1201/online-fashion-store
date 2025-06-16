// modal/Inventory/DeleteInventoryModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider
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
  console.log('inventory', inventory)
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Ẩn tồn kho</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          Bạn có chắc muốn ẩn bản ghi tồn kho{' '}
          <strong>
            {inventory?.warehouseId?.name && inventory?.variantId?.name
              ? `${inventory.warehouseId.name} - ${inventory.variantId.name}`
              : 'Thông tin không đầy đủ'}
          </strong>{' '}
          này?
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          color='error'
          variant='contained'
          sx={{ textTransform: 'none' }}
        >
          Ẩn
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteInventoryModal

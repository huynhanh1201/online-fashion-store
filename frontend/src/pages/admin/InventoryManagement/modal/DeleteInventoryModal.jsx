import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography
} from '@mui/material'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import useInventories from '~/hooks/admin/useInventories.js'
const DeleteInventoryModal = ({ open, onClose, inventory, onDelete }) => {
  const { deleteInventoryById } = useInventories()
  const handleDelete = async (id) => {
    try {
      const result = await deleteInventoryById(id)
      if (result) {
        onDelete(id)
        onClose()
      } else {
        alert('Xoá kho không thành công')
      }
    } catch (error) {
      console.error('Xoá kho thất bại:', error)
    }
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Xác nhận xoá kho</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xoá biến thể sản phẩm này không?
        </Typography>
        <Typography variant='body2' color='text.secondary' mt={1}>
          SKU: <strong>{inventory?.variant?.sku}</strong>
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button
          onClick={() => handleDelete(inventory._id)}
          color='error'
          variant='contained'
        >
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteInventoryModal

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
const DeleteInventoryModal = ({ open, onClose, inventory, onDelete }) => {
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
          onClick={() => onDelete(inventory._id)}
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

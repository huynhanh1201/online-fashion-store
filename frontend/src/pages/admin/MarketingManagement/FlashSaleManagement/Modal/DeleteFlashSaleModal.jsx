import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

const DeleteFlashSaleModal = ({ open, onClose, product, onDelete }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Xác nhận xóa</DialogTitle>
    <DialogContent>
      <Typography>Bạn có chắc chắn muốn xóa Flash Sale cho sản phẩm <b>{product?.productName}</b>?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Hủy</Button>
      <Button onClick={() => onDelete(product)} color="error" variant="contained">Xóa</Button>
    </DialogActions>
  </Dialog>
)

export default DeleteFlashSaleModal 
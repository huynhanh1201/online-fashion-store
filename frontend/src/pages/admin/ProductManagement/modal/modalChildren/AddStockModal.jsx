import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'

const AddStockModal = ({ open, onClose, onSave }) => {
  const [quantity, setQuantity] = useState('')

  const handleSave = () => {
    const qty = Number(quantity)
    if (isNaN(qty) || qty <= 0) {
      alert('Vui lòng nhập số lượng hợp lệ (> 0)')
      return
    }
    onSave(qty)
    setQuantity('')
    onClose()
  }

  const handleClose = () => {
    setQuantity('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Nhập số lượng</DialogTitle>
      <DialogContent>
        <TextField
          label='Số lượng'
          type='number'
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mt: 2 }}
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button variant='contained' onClick={handleSave}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddStockModal

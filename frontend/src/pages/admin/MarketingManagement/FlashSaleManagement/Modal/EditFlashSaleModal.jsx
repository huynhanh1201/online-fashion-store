import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material'

const EditFlashSaleModal = ({ open, onClose, product, onSave }) => {
  const [flashPrice, setFlashPrice] = useState(product?.flashPrice || '')

  useEffect(() => {
    setFlashPrice(product?.flashPrice || '')
  }, [product])

  const handleSave = () => {
    if (!flashPrice || isNaN(flashPrice) || Number(flashPrice) <= 0) return
    onSave({ ...product, flashPrice: Number(flashPrice) })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Chỉnh sửa Flash Sale</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            label="Tên sản phẩm"
            value={product?.productName || ''}
            fullWidth
            disabled
            margin="dense"
          />
          <TextField
            label="Giá gốc"
            value={product?.originalPrice?.toLocaleString() || ''}
            fullWidth
            disabled
            margin="dense"
          />
          <TextField
            label="Giá Flash Sale"
            value={flashPrice}
            onChange={e => setFlashPrice(e.target.value)}
            fullWidth
            margin="dense"
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditFlashSaleModal 
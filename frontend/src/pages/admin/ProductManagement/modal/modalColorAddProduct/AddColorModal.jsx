import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material'

const AddColorModal = ({ open, onClose, onSave }) => {
  const [colorName, setColorName] = useState('')
  const [colorImage, setColorImage] = useState('')

  const handleSave = () => {
    if (!colorName.trim() || !colorImage.trim()) {
      alert('Vui lòng nhập đầy đủ tên và ảnh màu')
      return
    }
    onSave({ name: colorName, image: colorImage })
    setColorName('')
    setColorImage('')
    onClose()
  }

  const handleClose = () => {
    setColorName('')
    setColorImage('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Thêm màu mới</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label='Tên màu'
              fullWidth
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='URL ảnh màu'
              fullWidth
              value={colorImage}
              onChange={(e) => setColorImage(e.target.value)}
              placeholder='https://example.com/image.png'
            />
          </Grid>
        </Grid>
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

export default AddColorModal

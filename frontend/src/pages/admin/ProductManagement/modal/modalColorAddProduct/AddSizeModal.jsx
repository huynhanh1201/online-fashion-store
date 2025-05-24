import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'

const AddSizeModal = ({ open, onClose, onSave }) => {
  const [sizeName, setSizeName] = useState('')

  const handleSave = () => {
    if (!sizeName.trim()) {
      alert('Vui lòng nhập tên kích thước')
      return
    }
    onSave({ name: sizeName }) // Trả về object thay vì string
    setSizeName('')
    onClose()
  }

  const handleClose = () => {
    setSizeName('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Thêm kích thước mới</DialogTitle>
      <DialogContent>
        <TextField
          label='Tên kích thước'
          fullWidth
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)}
          sx={{ mt: 2 }}
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

export default AddSizeModal

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'
import useSizePalettes from '~/hooks/admin/useSizePalettes.js'
const AddSizeModal = ({ open, onClose, product }) => {
  const [sizeName, setSizeName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { addSizePalette } = useSizePalettes()
  const handleSave = async () => {
    const trimmed = sizeName.trim()
    if (!trimmed) {
      alert('Vui lòng nhập tên kích thước')
      return
    }

    setIsSaving(true)
    try {
      console.log('Adding size palette:', trimmed)
      console.log('Product ID:', product._id)
      await addSizePalette(product._id, { name: trimmed })
      setSizeName('')
      onClose()
    } catch (error) {
      alert('Thêm kích thước thất bại. Vui lòng thử lại!')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
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
          disabled={isSaving}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSaving}>
          Hủy
        </Button>
        <Button variant='contained' onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSizeModal

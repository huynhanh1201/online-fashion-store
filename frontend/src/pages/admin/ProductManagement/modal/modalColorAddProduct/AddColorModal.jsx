import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material'
import useColors from '~/hooks/admin/useColor'
import AddColorModal from '~/pages/admin/ColorManagement/modal/AddColorModal.jsx'
const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const CloudinaryColor = 'color_upload'

const uploadToCloudinary = async (file, folder = CloudinaryColor) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', folder)

  const res = await fetch(URI, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('Upload thất bại')

  const data = await res.json()
  return data.secure_url
}

const AddColorbyProductModal = ({ open, onClose, onSave }) => {
  const { colors, fetchColors } = useColors()
  const [selectedColorId, setSelectedColorId] = useState('')
  const [colorFile, setColorFile] = useState(null)
  const [colorPreview, setColorPreview] = useState('')
  const [isAddingColor, setIsAddingColor] = useState(false)
  const [openAddColorModal, setOpenAddColorModal] = useState(false)
  const fileInputRef = useRef()

  useEffect(() => {
    fetchColors()
  }, [])

  const handleColorFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setColorFile(file)
      setColorPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    if (!selectedColorId) {
      alert('Vui lòng chọn màu')
      return
    }
    if (!colorFile) {
      alert('Vui lòng chọn ảnh màu')
      return
    }

    setIsAddingColor(true)
    try {
      const imageUrl = await uploadToCloudinary(colorFile, CloudinaryColor)
      const selectedColor = colors.find(
        (color) => color._id === selectedColorId
      )
      const colorData = {
        name: selectedColor.name,
        image: imageUrl
      }
      onSave(colorData)
      setSelectedColorId('')
      setColorFile(null)
      setColorPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      alert('Upload ảnh màu thất bại, vui lòng thử lại')
      console.error(err)
    } finally {
      setIsAddingColor(false)
    }
  }

  const handleClose = () => {
    setSelectedColorId('')
    setColorFile(null)
    setColorPreview('')
    fetchColors()
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }

  const handleCloseAddColorModal = () => {
    setOpenAddColorModal(false)
    fetchColors()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  const handleColorAdded = async (newColorId) => {
    try {
      await fetchColors()
      if (newColorId) {
        setSelectedColorId(newColorId)
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật danh sách màu:', error)
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm màu mới</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Chọn màu</InputLabel>
            <Select
              value={selectedColorId}
              label='Chọn màu'
              onChange={(e) => setSelectedColorId(e.target.value)}
            >
              {colors.map((color) => (
                <MenuItem key={color._id} value={color._id}>
                  {color.name}
                </MenuItem>
              ))}
              <MenuItem
                value='add_new'
                onClick={() => setOpenAddColorModal(true)}
              >
                Thêm màu mới
              </MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Button
              variant='outlined'
              component='label'
              disabled={isAddingColor}
            >
              Chọn ảnh màu
              <input
                type='file'
                accept='image/*'
                hidden
                ref={fileInputRef}
                onChange={handleColorFileChange}
              />
            </Button>
          </Box>

          {colorPreview && (
            <Box sx={{ mb: 2 }}>
              <Typography variant='body2' sx={{ mb: 1 }}>
                Xem trước ảnh:
              </Typography>
              <img
                src={colorPreview}
                alt='Color Preview'
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 4,
                  border: '1px solid #ccc'
                }}
              />
            </Box>
          )}
        </Box>
        <AddColorModal
          open={openAddColorModal}
          onClose={handleCloseAddColorModal}
          onSave={handleColorAdded}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='outlined' color='error'>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant='contained'
          disabled={isAddingColor}
        >
          {isAddingColor ? 'Đang tải...' : 'Thêm màu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddColorbyProductModal

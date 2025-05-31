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
  FormControl,
  IconButton,
  Grid,
  Paper
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import useColors from '~/hooks/admin/useColor'
import AddColorModal from '~/pages/admin/ColorManagement/modal/AddColorModal.jsx'
import useColorPalettes from '~/hooks/admin/useColorPalettes.js'
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

const AddColorbyProductModal = ({ open, onClose, product }) => {
  const { colors, fetchColors } = useColors()
  const { addColorPalette } = useColorPalettes()

  const [selectedColorId, setSelectedColorId] = useState('')
  const [colorFile, setColorFile] = useState(null)
  const [colorPreview, setColorPreview] = useState('')
  const [isAddingColor, setIsAddingColor] = useState(false)
  const [openAddColorModal, setOpenAddColorModal] = useState(false)

  // Dùng để hiển thị các màu đã thêm (có thể là mảng màu vừa gửi API thành công)
  const [addedColorsDisplay, setAddedColorsDisplay] = useState([])

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

  // Hàm này gọi API ngay sau khi upload ảnh thành công
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
      // Upload ảnh lên Cloudinary
      const imageUrl = await uploadToCloudinary(colorFile, CloudinaryColor)

      // Tìm color object trong colors theo id đã chọn
      const selectedColor = colors.find(
        (color) => color._id === selectedColorId
      )
      if (!selectedColor) {
        alert('Màu không hợp lệ')
        setIsAddingColor(false)
        return
      }

      // Tạo object để gửi API
      const colorDataToSend = {
        name: selectedColor.name,
        image: imageUrl
      }

      // Gọi API add màu cho product ngay lập tức
      await addColorPalette(product._id, colorDataToSend) // Lưu ý: API nhận mảng màu

      // Cập nhật thêm màu vừa thêm vào danh sách hiển thị
      setAddedColorsDisplay((prev) => [
        ...prev,
        {
          id: Date.now(), // key React, hoặc dùng giá trị khác nếu backend trả id
          name: selectedColor.name,
          image: imageUrl
        }
      ])

      // Reset form chọn màu, file
      setSelectedColorId('')
      setColorFile(null)
      setColorPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''

      alert('Thêm màu thành công')
    } catch (err) {
      alert('Upload ảnh hoặc thêm màu thất bại, vui lòng thử lại')
      console.error(err)
    } finally {
      setIsAddingColor(false)
    }
  }

  const handleDeleteColor = (id) => {
    // Xóa màu khỏi danh sách hiển thị (nếu bạn muốn có xóa offline)
    setAddedColorsDisplay((prev) => prev.filter((color) => color.id !== id))
    // Nếu cần gọi API xóa trên backend thì bạn bổ sung ở đây
  }

  const handleClose = () => {
    setSelectedColorId('')
    setColorFile(null)
    setColorPreview('')
    setAddedColorsDisplay([])
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
      <DialogTitle>Thêm màu mới cho sản phẩm</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Chọn màu</InputLabel>
            <Select
              value={selectedColorId}
              label='Chọn màu'
              onChange={(e) => {
                if (e.target.value === 'add_new') {
                  setOpenAddColorModal(true)
                } else {
                  setSelectedColorId(e.target.value)
                }
              }}
            >
              {colors.map((color) => (
                <MenuItem key={color._id} value={color._id}>
                  {color.name}
                </MenuItem>
              ))}
              <MenuItem value='add_new'>Thêm màu mới</MenuItem>
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

          <Button
            onClick={handleSave}
            variant='contained'
            disabled={isAddingColor}
            sx={{ mb: 3 }}
          >
            {isAddingColor ? 'Đang tải...' : 'Thêm màu vào sản phẩm'}
          </Button>

          {/* Hiển thị danh sách màu đã thêm */}
          {addedColorsDisplay.length > 0 && (
            <>
              <Typography variant='h6' sx={{ mb: 1 }}>
                Danh sách màu đã thêm
              </Typography>
              <Grid container spacing={2}>
                {addedColorsDisplay.map(({ id, name, image }) => (
                  <Grid item xs={6} sm={4} md={3} key={id}>
                    <Paper
                      variant='outlined'
                      sx={{
                        p: 1,
                        position: 'relative',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <img
                        src={image}
                        alt={name}
                        style={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 4,
                          marginBottom: 8
                        }}
                      />
                      <Typography noWrap>{name}</Typography>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => handleDeleteColor(id)}
                        sx={{ position: 'absolute', top: 4, right: 4 }}
                        aria-label='Xóa màu'
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
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
          Đóng
        </Button>
        {/* Bỏ nút Lưu tất cả nếu không cần nữa */}
      </DialogActions>
    </Dialog>
  )
}

export default AddColorbyProductModal

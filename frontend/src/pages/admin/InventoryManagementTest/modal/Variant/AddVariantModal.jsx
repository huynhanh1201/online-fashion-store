import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Box
} from '@mui/material'
import useColors from '~/hooks/admin/useColor'
import useSizes from '~/hooks/admin/useSize'
import useColorPalettes from '~/hooks/admin/useColorPalettes'
import useSizePalettes from '~/hooks/admin/useSizePalettes'

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

const AddVariantModal = ({ open, onClose, addVariant, products }) => {
  const [variantData, setVariantData] = useState({
    productId: '',
    color: '',
    colorImage: '',
    size: '',
    importPrice: '',
    exportPrice: '',
    overridePrice: false
  })

  const { colors, fetchColors } = useColors()
  const { sizes, fetchSizes } = useSizes()
  const { addColorPalette } = useColorPalettes(variantData.productId)
  const { addSizePalette } = useSizePalettes(variantData.productId)
  useEffect(() => {
    fetchColors()
    fetchSizes()
  }, [])
  const handleChange = (field, value) => {
    setVariantData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadToCloudinary(file, 'color_upload')
      handleChange('colorImage', url)
    } catch {
      alert('Lỗi khi upload ảnh!')
    }
  }

  const handleSave = async () => {
    const {
      productId,
      color,
      colorImage,
      size,
      importPrice,
      exportPrice,
      overridePrice
    } = variantData

    if (
      !productId ||
      !color ||
      !colorImage ||
      !size ||
      !importPrice ||
      !exportPrice
    ) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }

    try {
      await addColorPalette(productId, { name: color, image: colorImage })
      await addSizePalette(productId, { name: size })

      const finalVariant = {
        productId,
        color: { name: color, image: colorImage },
        size: { name: size },
        importPrice: Number(importPrice),
        exportPrice: Number(exportPrice),
        overridePrice
      }

      await addVariant(finalVariant)
      handleClose()
    } catch (err) {
      console.error(err)
      alert('Lỗi khi thêm biến thể')
    }
  }

  const handleClose = () => {
    setVariantData({
      productId: '',
      color: '',
      colorImage: '',
      size: '',
      importPrice: '',
      exportPrice: '',
      overridePrice: false
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm biến thể sản phẩm</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
      >
        {/* Sản phẩm */}
        <FormControl fullWidth>
          <InputLabel>Sản phẩm</InputLabel>
          <Select
            value={variantData.productId}
            onChange={(e) => handleChange('productId', e.target.value)}
            label='Sản phẩm'
          >
            {products.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Ảnh màu */}
        <Box display='flex' alignItems='center' gap={2}>
          <Button variant='outlined' component='label'>
            Chọn ảnh màu
            <input
              hidden
              accept='image/*'
              type='file'
              onChange={handleUploadImage}
            />
          </Button>
          {variantData.colorImage && (
            <img
              src={variantData.colorImage}
              alt='color'
              width={50}
              height={50}
            />
          )}
        </Box>

        {/* Màu sắc */}
        <FormControl fullWidth>
          <InputLabel>Màu sắc</InputLabel>
          <Select
            value={variantData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            label='Màu sắc'
          >
            {colors.map((c) => (
              <MenuItem key={c.name} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Kích thước */}
        <FormControl fullWidth>
          <InputLabel>Kích thước</InputLabel>
          <Select
            value={variantData.size}
            onChange={(e) => handleChange('size', e.target.value)}
            label='Kích thước'
          >
            {sizes.map((s) => (
              <MenuItem key={s.name} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Giá nhập */}
        <TextField
          label='Giá nhập'
          type='number'
          value={variantData.importPrice}
          onChange={(e) => handleChange('importPrice', e.target.value)}
          fullWidth
        />

        {/* Giá bán */}
        <TextField
          label='Giá bán'
          type='number'
          value={variantData.exportPrice}
          onChange={(e) => handleChange('exportPrice', e.target.value)}
          fullWidth
        />

        {/* Ghi đè giá */}
        <FormControlLabel
          control={
            <Checkbox
              checked={variantData.overridePrice}
              onChange={(e) => handleChange('overridePrice', e.target.checked)}
            />
          }
          label='Ghi đè giá mặc định'
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button variant='contained' onClick={handleSave}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddVariantModal

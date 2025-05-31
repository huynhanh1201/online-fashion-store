// modal/Variant/AddVariantModal.jsx
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
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import useColors from '~/hooks/admin/useColor'
import useSizes from '~/hooks/admin/useSize'
import useColorPalettes from '~/hooks/admin/useColorPalettes'
import useSizePalettes from '~/hooks/admin/useSizePalettes'
import AddColorModal from '~/pages/admin/ColorManagement/modal/AddColorModal.jsx'
import AddSizeModal from '~/pages/admin/SizeManagement/modal/AddSizeModal.jsx'

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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      productId: '',
      color: '',
      colorImage: '',
      size: '',
      importPrice: '',
      exportPrice: '',
      overridePrice: false
    }
  })

  const { colors, fetchColors } = useColors()
  const { sizes, fetchSizes } = useSizes()
  const { addColorPalette } = useColorPalettes(watch('productId'))
  const { addSizePalette } = useSizePalettes(watch('productId'))
  const [openColorModal, setOpenColorModal] = useState(false)
  const [openSizeModal, setOpenSizeModal] = useState(false)

  const overridePrice = watch('overridePrice') // Theo dõi overridePrice
  const colorImage = watch('colorImage') // Theo dõi colorImage để hiển thị preview
  const productId = watch('productId') // Theo dõi productId để lấy giá sản phẩm

  useEffect(() => {
    fetchColors()
    fetchSizes()
  }, [])

  const handleOpenColorModal = () => {
    setOpenColorModal(true)
  }

  const handleCloseColorModal = () => {
    setOpenColorModal(false)
    fetchColors()
  }

  const handleOpenSizeModal = () => {
    setOpenSizeModal(true)
  }

  const handleCloseSizeModal = () => {
    setOpenSizeModal(false)
    fetchSizes()
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadToCloudinary(file, 'color_upload')
      setValue('colorImage', url)
      toast.success('Upload ảnh thành công')
    } catch {
      toast.error('Lỗi khi upload ảnh')
    }
  }

  const onSubmit = async (data) => {
    const {
      productId,
      color,
      colorImage,
      size,
      importPrice,
      exportPrice,
      overridePrice
    } = data

    // Tìm sản phẩm được chọn để lấy importPrice và exportPrice
    const selectedProduct = products.find((p) => p._id === productId)
    const productImportPrice = selectedProduct?.importPrice || 0
    const productExportPrice = selectedProduct?.exportPrice || 0

    try {
      await addColorPalette(productId, { name: color, image: colorImage })
      await addSizePalette(productId, { name: size })

      const finalVariant = {
        productId,
        color: { name: color, image: colorImage },
        size: { name: size },
        importPrice: overridePrice ? Number(importPrice) : productImportPrice,
        exportPrice: overridePrice ? Number(exportPrice) : productExportPrice,
        overridePrice
      }

      await addVariant(finalVariant)
      toast.success('Thêm biến thể thành công')
      handleClose()
    } catch (err) {
      console.error(err)
      toast.error('Lỗi khi thêm biến thể')
    }
  }

  const handleClose = () => {
    setValue('productId', '')
    setValue('color', '')
    setValue('colorImage', '')
    setValue('size', '')
    setValue('importPrice', '')
    setValue('exportPrice', '')
    setValue('overridePrice', false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm biến thể sản phẩm</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          {/* Sản phẩm */}
          <FormControl fullWidth error={!!errors.productId}>
            <InputLabel>Sản phẩm</InputLabel>
            <Select
              {...register('productId', { required: 'Vui lòng chọn sản phẩm' })}
              label='Sản phẩm'
            >
              {products.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
            {errors.productId && (
              <p style={{ color: 'red', fontSize: '0.75rem' }}>
                {errors.productId.message}
              </p>
            )}
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
            {colorImage && (
              <img src={colorImage} alt='color' width={50} height={50} />
            )}
          </Box>
          <TextField
            sx={{ display: 'none' }} // Ẩn TextField nhưng vẫn giữ để validate
            label='URL hình ảnh màu'
            fullWidth
            {...register('colorImage', {
              required: 'Vui lòng nhập URL hình ảnh',
              pattern: {
                value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/,
                message: 'Vui lòng nhập URL hợp lệ'
              }
            })}
            error={!!errors.colorImage}
            helperText={errors.colorImage?.message}
          />

          {/* Màu sắc */}
          <FormControl fullWidth error={!!errors.color}>
            <InputLabel>Màu sắc</InputLabel>
            <Select
              {...register('color', { required: 'Vui lòng chọn màu sắc' })}
              label='Màu sắc'
            >
              {colors.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
              <MenuItem onClick={handleOpenColorModal}>
                <em>Thêm màu mới</em>
              </MenuItem>
            </Select>
            {errors.color && (
              <p style={{ color: 'red', fontSize: '0.75rem' }}>
                {errors.color.message}
              </p>
            )}
          </FormControl>

          {/* Kích thước */}
          <FormControl fullWidth error={!!errors.size}>
            <InputLabel>Kích thước</InputLabel>
            <Select
              {...register('size', { required: 'Vui lòng chọn kích thước' })}
              label='Kích thước'
            >
              {sizes.map((s) => (
                <MenuItem key={s.name} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
              <MenuItem onClick={handleOpenSizeModal}>
                <em>Thêm kích thước mới</em>
              </MenuItem>
            </Select>
            {errors.size && (
              <p style={{ color: 'red', fontSize: '0.75rem' }}>
                {errors.size.message}
              </p>
            )}
          </FormControl>

          {/* Ghi đè giá */}
          <FormControlLabel
            control={
              <Checkbox
                {...register('overridePrice')}
                checked={watch('overridePrice')}
                onChange={(e) => setValue('overridePrice', e.target.checked)}
              />
            }
            label='Ghi đè giá mặc định'
          />

          {/* Giá nhập */}
          <TextField
            label='Giá nhập'
            type='number'
            disabled={!overridePrice} // Vô hiệu hóa nếu overridePrice là false
            {...register('importPrice', {
              required: overridePrice ? 'Vui lòng nhập giá nhập' : false,
              valueAsNumber: true,
              min: overridePrice
                ? { value: 0, message: 'Giá nhập không được âm' }
                : undefined
            })}
            error={!!errors.importPrice}
            helperText={errors.importPrice?.message}
            fullWidth
          />

          {/* Giá bán */}
          <TextField
            label='Giá bán'
            type='number'
            disabled={!overridePrice} // Vô hiệu hóa nếu overridePrice là false
            {...register('exportPrice', {
              required: overridePrice ? 'Vui lòng nhập giá bán' : false,
              valueAsNumber: true,
              min: overridePrice
                ? { value: 0, message: 'Giá bán không được âm' }
                : undefined
            })}
            error={!!errors.exportPrice}
            helperText={errors.exportPrice?.message}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button type='submit' variant='contained'>
            Thêm
          </Button>
        </DialogActions>
      </form>
      <AddColorModal open={openColorModal} onClose={handleCloseColorModal} />
      <AddSizeModal open={openSizeModal} onClose={handleCloseSizeModal} />
    </Dialog>
  )
}

export default AddVariantModal

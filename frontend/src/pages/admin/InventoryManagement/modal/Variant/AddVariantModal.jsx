// modal/Variant/AddVariantModal.jsx
import React, { useState, useEffect, useRef } from 'react'
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
  Box,
  IconButton,
  Typography,
  Autocomplete
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import useColorPalettes from '~/hooks/admin/useColorPalettes'
import useSizePalettes from '~/hooks/admin/useSizePalettes'
import { getVariantById } from '~/services/admin/Inventory/VariantService.js'
import AddColorModal from '~/pages/admin/ColorManagement/modal/AddColorModal'
import AddSizeModal from '~/pages/admin/SizeManagement/modal/AddSizeModal'

import { URI, CloudinaryColor } from '~/utils/constants'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

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

const AddVariantModal = ({
  open,
  onClose,
  addVariant,
  products,
  formatCurrency,
  parseCurrency,
  colors,
  sizes,
  fetchSizes,
  fetchColors
}) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const { addColorPalette } = useColorPalettes(watch('productId'))
  const { addSizePalette } = useSizePalettes(watch('productId'))
  const [openColorModal, setOpenColorModal] = useState(false)
  const [openSizeModal, setOpenSizeModal] = useState(false)

  const [existingVariants, setExistingVariants] = useState([])
  const fileInputRef = useRef(null)
  const [colorImage, setColorImage] = useState(null)
  const overridePrice = watch('overridePrice')
  const productId = watch('productId') // Theo dõi productId để lấy giá sản phẩm

  useEffect(() => {
    if (!productId) return

    const selectedProduct = products.find((p) => p._id === productId)

    if (selectedProduct) {
      // Reset các trường liên quan khi đổi sản phẩm
      setValue('color', '')
      setValue('size', '')
      setExistingVariants([])

      // Gán giá mặc định từ sản phẩm
      setValue('importPrice', selectedProduct.importPrice || 0)
      setValue('exportPrice', selectedProduct.exportPrice || 0)

      // Lấy ảnh đầu tiên làm ảnh màu nếu có
      const firstImage = Array.isArray(selectedProduct.image)
        ? selectedProduct.image[0]
        : selectedProduct.image

      if (firstImage) {
        setValue('colorImage', firstImage)
      }
    }

    // Gọi API lấy danh sách biến thể đã có
    const fetchVariants = async () => {
      try {
        const variants = await getVariantById(productId)
        setExistingVariants(variants || [])
      } catch (err) {
        console.error('Lỗi khi lấy biến thể:', err)
        toast.error('Lỗi khi lấy biến thể')
      }
    }

    fetchVariants()
  }, [productId])

  // rồi đồng bộ lại với react-hook-form
  useEffect(() => {
    setColorImage(watch('colorImage'))
  }, [watch('colorImage')])
  // const selectedColor = useWatch({ control, name: 'color' })
  // const selectedSize = useWatch({ control, name: 'size' })

  const normalize = (str) => str?.toString().trim().toLowerCase()

  const isSizeDisabled = (color, size) => {
    return existingVariants.some(
      (variant) =>
        normalize(variant.color?.name) === normalize(color) &&
        normalize(variant.size?.name) === normalize(size)
    )
  }

  const isColorDisabled = (size, color) => {
    return existingVariants.some(
      (variant) =>
        normalize(variant.size?.name) === normalize(size) &&
        normalize(variant.color?.name) === normalize(color)
    )
  }

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
    reset({
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
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>Thêm biến thể sản phẩm</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            mt: 1
          }}
        >
          {/* Khung ảnh bên trái */}
          <Box
            sx={{
              position: 'relative',
              width: 403,
              height: 403,
              border: '1px dashed #ccc',
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onClick={() => !colorImage && fileInputRef.current?.click()}
          >
            {/* Input ẩn để chọn ảnh */}
            <input
              type='file'
              accept='image/*'
              hidden
              ref={fileInputRef}
              onChange={handleUploadImage}
            />

            {/* Nếu có ảnh thì hiển thị ảnh và icon chỉnh sửa/xoá */}
            {colorImage ? (
              <>
                <Box
                  component='img'
                  src={colorImage}
                  alt='Ảnh màu'
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <IconButton
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation() // chỉ ngăn tại icon, không ngăn toàn bộ Box
                      fileInputRef.current?.click()
                    }}
                    sx={{ backgroundColor: '#fff', boxShadow: 1 }}
                  >
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => {
                      setColorImage(null)
                      setValue('colorImage', '')
                    }}
                    sx={{ backgroundColor: '#fff', boxShadow: 1 }}
                  >
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', color: '#888' }}>
                <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
                <Typography variant='caption'>Thêm ảnh màu</Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {/* Sản phẩm */}
            <FormControl fullWidth error={!!errors.productId}>
              <InputLabel>Sản phẩm</InputLabel>
              <Controller
                name='productId'
                control={control}
                rules={{ required: 'Vui lòng chọn sản phẩm' }}
                render={({ field }) => (
                  <Select {...field} label='Sản phẩm'>
                    {products.map((p) => (
                      <MenuItem key={p._id} value={p._id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.productId && (
                <p style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.productId.message}
                </p>
              )}
            </FormControl>
            {/* Màu sắc */}
            <FormControl fullWidth error={!!errors.color}>
              <InputLabel>Màu sắc</InputLabel>
              <Controller
                name='color'
                control={control}
                rules={{
                  required: 'Vui lòng chọn màu sắc',
                  validate: (selectedColor) => {
                    const selectedSize = watch('size')
                    if (!selectedSize) return true
                    const isExisted = existingVariants.some(
                      (variant) =>
                        variant.color?.name === selectedColor &&
                        variant.size?.name === selectedSize
                    )
                    return isExisted
                      ? 'Đã có biến thể này, vui lòng chọn màu khác'
                      : true
                  }
                }}
                render={({ field }) => (
                  <Select {...field} label='Màu sắc'>
                    {colors.map((c) => {
                      const disabled =
                        watch('size') && isColorDisabled(watch('size'), c.name)
                      return (
                        <MenuItem
                          key={c.name}
                          value={c.name}
                          disabled={disabled}
                        >
                          {c.name} {disabled ? ' (đã tồn tại)' : ''}
                        </MenuItem>
                      )
                    })}
                    <MenuItem onClick={handleOpenColorModal}>
                      <em>Thêm màu mới</em>
                    </MenuItem>
                  </Select>
                )}
              />
              {errors.color && (
                <p style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.color.message}
                </p>
              )}
            </FormControl>

            {/* Kích thước */}
            <FormControl fullWidth error={!!errors.size}>
              <InputLabel>Kích thước</InputLabel>
              <Controller
                name='size'
                control={control}
                rules={{
                  required: 'Vui lòng chọn kích thước',
                  validate: (selectedSize) => {
                    const selectedColor = watch('color')
                    if (!selectedColor) return true
                    const isExisted = existingVariants.some(
                      (variant) =>
                        variant.size?.name === selectedSize &&
                        variant.color?.name === selectedColor
                    )
                    return isExisted
                      ? 'Đã có biến thể này, vui lòng chọn kích thước khác'
                      : true
                  }
                }}
                render={({ field }) => (
                  <Select {...field} label='Kích thước'>
                    {sizes.map((s) => {
                      const disabled =
                        watch('color') && isSizeDisabled(watch('color'), s.name)
                      return (
                        <MenuItem
                          key={s.name}
                          value={s.name}
                          disabled={disabled}
                        >
                          {s.name} {disabled ? ' (đã tồn tại)' : ''}
                        </MenuItem>
                      )
                    })}
                    <MenuItem onClick={handleOpenSizeModal}>
                      <em>Thêm kích thước mới</em>
                    </MenuItem>
                  </Select>
                )}
              />
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
              label='Đặt giá riêng cho biến thể'
            />
            {/* Giá nhập */}
            <Controller
              name='importPrice'
              control={control}
              rules={{
                required: overridePrice ? 'Vui lòng nhập giá nhập' : false,
                validate: (val) =>
                  overridePrice && Number(val) < 0
                    ? 'Giá nhập không được âm'
                    : true
              }}
              render={({ field }) => (
                <TextField
                  label='Giá nhập'
                  disabled={!overridePrice}
                  type='text'
                  fullWidth
                  value={formatCurrency(field.value)}
                  onChange={(e) =>
                    field.onChange(parseCurrency(e.target.value))
                  }
                  error={!!errors.importPrice}
                  helperText={errors.importPrice?.message}
                  InputProps={{
                    endAdornment: <span style={{ marginLeft: 4 }}>₫</span>,
                    inputMode: 'numeric'
                  }}
                />
              )}
            />
            {/* Giá bán */}
            <Controller
              name='exportPrice'
              control={control}
              rules={{
                required: overridePrice ? 'Vui lòng nhập giá bán' : false,
                validate: (val) =>
                  overridePrice && Number(val) < 0
                    ? 'Giá bán không được âm'
                    : true
              }}
              render={({ field }) => (
                <TextField
                  label='Giá bán'
                  disabled={!overridePrice}
                  type='text'
                  fullWidth
                  value={formatCurrency(field.value)}
                  onChange={(e) =>
                    field.onChange(parseCurrency(e.target.value))
                  }
                  error={!!errors.exportPrice}
                  helperText={errors.exportPrice?.message}
                  InputProps={{
                    endAdornment: <span style={{ marginLeft: 4 }}>₫</span>,
                    inputMode: 'numeric'
                  }}
                />
              )}
            />
          </Box>
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

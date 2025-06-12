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
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import useColorPalettes from '~/hooks/admin/useColorPalettes'
import useSizePalettes from '~/hooks/admin/useSizePalettes'
import { getVariantById } from '~/services/admin/Inventory/VariantService.js'
import AddColorModal from '~/pages/admin/ColorManagement/modal/AddColorModal'
import AddSizeModal from '~/pages/admin/SizeManagement/modal/AddSizeModal'

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

const AddVariantModal = ({
  open,
  onClose,
  addVariant,
  products,
  formatCurrency,
  parseCurrency,
  colors,
  sizes
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

  const overridePrice = watch('overridePrice') // Theo dõi overridePrice
  const colorImage = watch('colorImage') // Theo dõi colorImage để hiển thị preview
  const productId = watch('productId') // Theo dõi productId để lấy giá sản phẩm
  useEffect(() => {
    if (!productId) return
    if (productId) {
      const selectedProduct = products.find((p) => p._id === productId)
      if (selectedProduct) {
        setValue('importPrice', selectedProduct.importPrice || 0)
        setValue('exportPrice', selectedProduct.exportPrice || 0)

        // ✅ Chỉ lấy ảnh đầu tiên nếu image là mảng
        const firstImage = Array.isArray(selectedProduct.image)
          ? selectedProduct.image[0]
          : selectedProduct.image

        if (firstImage) {
          setValue('colorImage', firstImage)
        }
      }
    }

    const fetchVariants = async () => {
      try {
        const variants = await getVariantById(productId)
        setExistingVariants(variants)
      } catch (err) {
        console.error('Lỗi khi lấy biến thể:', err)
        toast.error('Lỗi khi lấy biến thể')
      }
    }
    fetchVariants()
  }, [])

  const isSizeDisabled = (color, size) => {
    return existingVariants.some(
      (variant) => variant.color.name === color && variant.size.name === size
    )
  }

  const isColorDisabled = (size, color) => {
    return existingVariants.some(
      (variant) => variant.size.name === size && variant.color.name === color
    )
  }
  const handleOpenColorModal = () => {
    setOpenColorModal(true)
  }

  const handleCloseColorModal = () => {
    setOpenColorModal(false)
  }

  const handleOpenSizeModal = () => {
    setOpenSizeModal(true)
  }

  const handleCloseSizeModal = () => {
    setOpenSizeModal(false)
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
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm biến thể sản phẩm</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
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
            <Controller
              name='color'
              control={control}
              rules={{ required: 'Đã có biến thể vui lòng chọn màu sắc khác' }}
              render={({ field }) => (
                <Select {...field} label='Màu sắc'>
                  {colors.map((c) => {
                    const selectedSize = watch('size')
                    const disabled =
                      selectedSize && isColorDisabled(selectedSize, c.name)
                    return (
                      <MenuItem key={c.name} value={c.name} disabled={disabled}>
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
            <Select
              {...register('size', {
                required: 'Đã có biến thể vui lòng chọn kích thước khác'
              })}
              label='Kích thước'
            >
              {sizes.map((s) => {
                const selectedColor = watch('color')
                const disabled =
                  selectedColor && isSizeDisabled(selectedColor, s.name)
                return (
                  <MenuItem key={s.name} value={s.name} disabled={disabled}>
                    {s.name} {disabled ? ' (đã tồn tại)' : ''}
                  </MenuItem>
                )
              })}
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
                onChange={(e) => field.onChange(parseCurrency(e.target.value))}
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
                onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                error={!!errors.exportPrice}
                helperText={errors.exportPrice?.message}
                InputProps={{
                  endAdornment: <span style={{ marginLeft: 4 }}>₫</span>,
                  inputMode: 'numeric'
                }}
              />
            )}
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

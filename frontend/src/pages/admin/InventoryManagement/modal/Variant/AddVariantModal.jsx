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
  Autocomplete,
  Divider,
  Tooltip,
  Grid,
  Chip
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import useColorPalettes from '~/hooks/admin/useColorPalettes'
import useSizePalettes from '~/hooks/admin/useSizePalettes'
import { getVariantById } from '~/services/admin/Inventory/VariantService.js'
import AddColorModal from '~/pages/admin/ColorManagement/modal/AddColorModal'
import AddSizeModal from '~/pages/admin/SizeManagement/modal/AddSizeModal'
import useColor from '~/hooks/admin/useColor.js'
import useSize from '~/hooks/admin/useSize.js'
import { URI, CloudinaryColor } from '~/utils/constants'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

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
      overridePrice: false,
      overridePackageSize: false,
      packageSize: {
        length: '',
        width: '',
        height: '',
        weight: ''
      }
    }
  })
  const { createNewColor } = useColor()
  const { createNewSize } = useSize()
  const { addColorPalette } = useColorPalettes(watch('productId'))
  const { addSizePalette } = useSizePalettes(watch('productId'))
  const [openColorModal, setOpenColorModal] = useState(false)
  const [openSizeModal, setOpenSizeModal] = useState(false)

  const [existingVariants, setExistingVariants] = useState([])
  const fileInputRef = useRef(null)
  const [colorImage, setColorImage] = useState(null)
  const overridePrice = watch('overridePrice')
  const productId = watch('productId') // Theo dõi productId để lấy giá sản phẩm
  const overridePackageSize = watch('overridePackageSize')
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
      setValue('packageSize.length', selectedProduct.packageSize?.length || '')
      setValue('packageSize.width', selectedProduct.packageSize?.width || '')
      setValue('packageSize.height', selectedProduct.packageSize?.height || '')
      setValue('packageSize.weight', selectedProduct.packageSize?.weight || '')
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

  const handleCloseColorModal = async () => {
    setOpenColorModal(false)
    await fetchColors()
  }

  const handleOpenSizeModal = () => {
    setOpenSizeModal(true)
  }

  const handleCloseSizeModal = async () => {
    setOpenSizeModal(false)
    await fetchSizes()
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

  const handleSaveColor = async (data) => {
    try {
      const newColor = await createNewColor(data)
      if (newColor?.name) {
        setValue('color', newColor.name) // ✅ gán tên màu mới vào field 'color'
      }
      toast.success('Thêm màu thành công')
    } catch (error) {
      console.error('Lỗi khi thêm màu:', error)
      toast.error('Lỗi khi thêm màu')
    }
  }

  const handleSaveSize = async (data) => {
    try {
      const newSize = await createNewSize(data)
      if (newSize?.name) {
        setValue('size', newSize.name) // ✅ gán tên size mới vào field 'size'
      }
      toast.success('Thêm kích thước thành công')
    } catch (error) {
      console.error('Lỗi khi thêm kích thước:', error)
      toast.error('Lỗi khi thêm kích thước')
    }
  }

  const onSubmit = async (data) => {
    const {
      productId,
      color,
      colorImage,
      size,
      status,
      importPrice,
      exportPrice,
      overridePrice,
      overridePackageSize,
      packageSize = {}
    } = data

    const selectedProduct = products.find((p) => p._id === productId)
    const productImportPrice = selectedProduct?.importPrice || 0
    const productExportPrice = selectedProduct?.exportPrice || 0
    const productPackageSize = selectedProduct?.packageSize || {
      length: 0,
      width: 0,
      height: 0,
      weight: 0
    }

    const finalPackageSize = overridePackageSize
      ? {
          length: Number(packageSize.length) || 0,
          width: Number(packageSize.width) || 0,
          height: Number(packageSize.height) || 0,
          weight: Number(packageSize.weight) || 0
        }
      : productPackageSize

    try {
      await addColorPalette(productId, { name: color, image: colorImage })
      await addSizePalette(productId, { name: size })

      const finalVariant = {
        productId,
        color: { name: color, image: colorImage },
        size: { name: size },
        importPrice: overridePrice ? Number(importPrice) : productImportPrice,
        exportPrice: overridePrice ? Number(exportPrice) : productExportPrice,
        overridePrice,
        overridePackageSize,
        status: status || 'draft',
        packageSize: finalPackageSize
      }

      await addVariant(finalVariant, 'add')
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
      status: 'draft',
      overridePrice: false,
      overridePackageSize: false,
      packageSize: {
        length: '',
        width: '',
        height: '',
        weight: ''
      }
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xl'
      fullWidth
      sx={{ padding: '16px 24px' }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Thêm biến thể mới</DialogTitle>
      <Divider />
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
              height: 548,
              minWidth: 403,
              minHeight: 403,
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
                  position='absolute'
                  top={4}
                  right={8}
                  display='flex'
                  gap={1}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 40,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 1
                    }}
                  >
                    <Tooltip title='Sửa'>
                      <IconButton
                        size='small'
                        onClick={(e) => {
                          e.stopPropagation() // chỉ ngăn tại icon, không ngăn toàn bộ Box
                          fileInputRef.current?.click()
                        }}
                      >
                        <EditIcon fontSize='small' color='warning' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 1
                    }}
                  >
                    <Tooltip title='Xoá'>
                      <IconButton
                        size='small'
                        onClick={() => {
                          setColorImage(null)
                          setValue('colorImage', '')
                        }}
                      >
                        <DeleteIcon fontSize='small' color='error' />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
                      <MenuItem
                        key={p._id}
                        value={p._id}
                        sx={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
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
                  <Select
                    {...field}
                    label='Màu sắc'
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 412, // ✅ Chiều cao tối đa của danh sách dropdown
                          overflowY: 'auto' // ✅ Hiển thị thanh cuộn dọc
                        }
                      }
                    }}
                  >
                    {colors.map((c) => {
                      const disabled =
                        watch('size') && isColorDisabled(watch('size'), c.name)
                      return (
                        <MenuItem
                          key={c.name}
                          value={c.name}
                          disabled={disabled}
                          sx={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
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
                  <Select
                    {...field}
                    label='Kích thước'
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 412, // ✅ Chiều cao tối đa của danh sách dropdown
                          overflowY: 'auto' // ✅ Hiển thị thanh cuộn dọc
                        }
                      }
                    }}
                  >
                    {sizes.map((s) => {
                      const disabled =
                        watch('color') && isSizeDisabled(watch('color'), s.name)
                      return (
                        <MenuItem
                          key={s.name}
                          value={s.name}
                          disabled={disabled}
                          sx={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Box
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
              >
                {/* Ghi đè giá */}
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register('overridePrice')}
                      checked={watch('overridePrice')}
                      onChange={(e) =>
                        setValue('overridePrice', e.target.checked)
                      }
                    />
                  }
                  sx={{ mb: 1 }}
                  label='Đặt giá riêng cho biến thể'
                />
                <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                  {/* Giá nhập */}
                  <Controller
                    name='importPrice'
                    control={control}
                    rules={{
                      required: overridePrice
                        ? 'Vui lòng nhập giá nhập'
                        : false,
                      validate: (val) =>
                        overridePrice && Number(val) < 0
                          ? 'Giá nhập không được âm'
                          : true
                    }}
                    render={({ field }) => (
                      <TextField
                        label='Giá nhập (đ)'
                        disabled={!overridePrice}
                        type='text'
                        fullWidth
                        value={formatCurrency(field.value)}
                        onChange={(e) =>
                          field.onChange(parseCurrency(e.target.value))
                        }
                        error={!!errors.importPrice}
                        helperText={errors.importPrice?.message}
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
                        label='Giá bán (đ)'
                        disabled={!overridePrice}
                        type='text'
                        fullWidth
                        value={formatCurrency(field.value)}
                        onChange={(e) =>
                          field.onChange(parseCurrency(e.target.value))
                        }
                        error={!!errors.exportPrice}
                        helperText={errors.exportPrice?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
              <Box sx={{ width: '100%' }}>
                {/* Ghi đè kích thước đóng gói */}
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register('overridePackageSize')}
                      checked={watch('overridePackageSize')}
                      onChange={(e) =>
                        setValue('overridePackageSize', e.target.checked)
                      }
                    />
                  }
                  sx={{ mb: 1 }}
                  label='Đặt kích thước đóng gói riêng cho biến thể'
                />
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '100%' }}>
                    {/* Dài */}
                    <Controller
                      name='packageSize.length'
                      control={control}
                      rules={{
                        required: overridePackageSize
                          ? 'Chiều dài là bắt buộc'
                          : false,
                        validate: (val) =>
                          overridePackageSize && Number(val) <= 0
                            ? 'Chiều dài phải lớn hơn 0'
                            : true
                      }}
                      render={({ field }) => (
                        <TextField
                          label='Chiều dài gói hàng (cm)'
                          type='number'
                          fullWidth
                          disabled={!overridePackageSize}
                          value={field.value}
                          onChange={field.onChange}
                          error={!!errors.packageSize?.length}
                          helperText={errors.packageSize?.length?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />

                    {/* Rộng */}
                    <Controller
                      name='packageSize.width'
                      control={control}
                      rules={{
                        required: overridePackageSize
                          ? 'Chiều rộng là bắt buộc'
                          : false,
                        validate: (val) =>
                          overridePackageSize && Number(val) <= 0
                            ? 'Chiều rộng phải lớn hơn 0'
                            : true
                      }}
                      render={({ field }) => (
                        <TextField
                          label='Chiều rộng gói hàng (cm)'
                          type='number'
                          fullWidth
                          disabled={!overridePackageSize}
                          value={field.value}
                          onChange={field.onChange}
                          error={!!errors.packageSize?.width}
                          helperText={errors.packageSize?.width?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    {/* Cao */}
                    <Controller
                      name='packageSize.height'
                      control={control}
                      rules={{
                        required: overridePackageSize
                          ? 'Chiều cao là bắt buộc'
                          : false,
                        validate: (val) =>
                          overridePackageSize && Number(val) <= 0
                            ? 'Chiều cao phải lớn hơn 0'
                            : true
                      }}
                      render={({ field }) => (
                        <TextField
                          sx={{ mb: 2 }}
                          label='Chiều cao gói hàng (cm)'
                          type='number'
                          fullWidth
                          disabled={!overridePackageSize}
                          value={field.value}
                          onChange={field.onChange}
                          error={!!errors.packageSize?.height}
                          helperText={errors.packageSize?.height?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />

                    {/* Khối lượng */}
                    <Controller
                      name='packageSize.weight'
                      control={control}
                      rules={{
                        required: overridePackageSize
                          ? 'Trọng lượng là bắt buộc'
                          : false,
                        validate: (val) =>
                          overridePackageSize && Number(val) <= 0
                            ? 'Trọng lượng phải lớn hơn 0'
                            : true
                      }}
                      render={({ field }) => (
                        <TextField
                          label='Trọng lượng gói hàng (gram)'
                          type='number'
                          fullWidth
                          disabled={!overridePackageSize}
                          value={field.value}
                          onChange={field.onChange}
                          error={!!errors.packageSize?.weight}
                          helperText={errors.packageSize?.weight?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            {/*Trạng thái sản phẩm*/}
            <Grid item size={12}>
              <Box>
                <Typography variant='h6'>Trạng thái biến thể</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {[
                    { label: 'Bản nháp', value: 'draft' },
                    { label: 'Hoạt động', value: 'active' },
                    { label: 'Không hoạt động', value: 'inactive' }
                  ].map((item) => {
                    const isSelected = watch('status') === item.value
                    return (
                      <Chip
                        key={item.value}
                        label={item.label}
                        onClick={() => setValue('status', item.value)}
                        variant={isSelected ? 'filled' : 'outlined'}
                        clickable
                        sx={{
                          ...(isSelected && {
                            backgroundColor: '#001f5d',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#001f5d'
                            }
                          })
                        }}
                      />
                    )
                  })}
                </Box>
              </Box>
            </Grid>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={handleClose}
            color='error'
            variant='outlined'
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            sx={{
              backgroundColor: '#001f5d',
              color: '#fff',
              textTransform: 'none'
            }}
          >
            Thêm
          </Button>
        </DialogActions>
      </form>
      <AddColorModal
        open={openColorModal}
        onClose={handleCloseColorModal}
        onSave={handleSaveColor}
      />
      <AddSizeModal
        open={openSizeModal}
        onClose={handleCloseSizeModal}
        onSave={handleSaveSize}
      />
    </Dialog>
  )
}

export default AddVariantModal

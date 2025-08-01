import React, { useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Grid,
  Chip
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { URI, CloudinaryColor } from '~/utils/constants'

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

const EditVariantModal = ({
  open,
  onClose,
  variant,
  onUpdateVariant,
  formatCurrency,
  parseCurrency
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      importPrice: '',
      exportPrice: '',
      overridePrice: false,
      overridePackageSize: false,
      colorImage: '',
      discountPrice: '0',
      status: 'draft',
      packageSize: {
        length: '',
        width: '',
        height: '',
        weight: ''
      }
    }
  })

  const fileInputRef = useRef(null)
  const overridePrice = watch('overridePrice')
  const colorImage = watch('colorImage')
  const overridePackageSize = watch('overridePackageSize')

  useEffect(() => {
    if (variant) {
      reset({
        importPrice: variant.importPrice || 0,
        exportPrice: variant.exportPrice || 0,
        overridePrice: variant.overridePrice || false,
        overridePackageSize: variant.overridePackageSize || false,
        colorImage: variant.color?.image || '',
        status: variant.status || 'draft',
        discountPrice: variant.discountPrice || 0,
        packageSize: {
          length: variant.packageSize?.length || '',
          width: variant.packageSize?.width || '',
          height: variant.packageSize?.height || '',
          weight: variant.packageSize?.weight || ''
        }
      })
    }
  }, [variant, reset])

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadToCloudinary(file)
      setValue('colorImage', url)
      toast.success('Upload ảnh thành công')
    } catch {
      toast.error('Lỗi khi upload ảnh')
    }
  }

  const onSubmit = async (data) => {
    try {
      const updatedVariant = {
        importPrice: Number(data.importPrice),
        exportPrice: Number(data.exportPrice),
        overridePrice: data.overridePrice,
        overridePackageSize: data.overridePackageSize,
        discountPrice: Number(data.discountPrice) || 0,
        color: {
          image: data.colorImage
        },
        status: data.status || 'draft',
        packageSize: data.overridePackageSize
          ? {
              length: Number(data.packageSize.length),
              width: Number(data.packageSize.width),
              height: Number(data.packageSize.height),
              weight: Number(data.packageSize.weight)
            }
          : variant.packageSize
      }
      if (!updatedVariant.color.image) {
        toast.error('Vui lòng thêm ảnh cho biến thể')
        return
      }
      await onUpdateVariant(updatedVariant, 'edit', variant._id)
      onClose()
    } catch (error) {
      console.error('Error updating variant:', error)
      toast.error('Lỗi khi cập nhật biến thể')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      fullWidth
      sx={{ padding: '16px 24px' }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Sửa thông tin biến thể</DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'row', gap: 3, mt: 1 }}
        >
          {/* Ảnh màu */}
          <Box
            sx={{
              position: 'relative',
              width: 403,
              height: 530,
              border: '1px dashed #ccc',
              backgroundColor: '#ccc',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
            onClick={() => !colorImage && fileInputRef.current?.click()}
          >
            <input
              type='file'
              accept='image/*'
              hidden
              ref={fileInputRef}
              onChange={handleUploadImage}
            />

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
                      borderRadius: '50%'
                    }}
                  >
                    <Tooltip title='Sửa'>
                      <IconButton
                        size='small'
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current.click()
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
                      borderRadius: '50%'
                    }}
                  >
                    <Tooltip title='Xoá'>
                      <IconButton
                        size='small'
                        onClick={(e) => {
                          e.stopPropagation()
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

          {/* Thông tin bên phải */}
          <Box
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label='Tên sản phẩm'
              value={variant?.name || '---'}
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label='Màu sắc'
                value={variant?.color?.name || '---'}
                fullWidth
                InputProps={{ readOnly: true }}
                disabled
              />

              <TextField
                label='Kích thước'
                value={variant?.size?.name || '---'}
                fullWidth
                InputProps={{ readOnly: true }}
                disabled
              />
            </Box>
            <Controller
              name='discountPrice'
              control={control}
              rules={{
                validate: (val) =>
                  Number(val) >= 0 ? true : 'Giảm giá không được âm'
              }}
              render={({ field }) => (
                <TextField
                  label='Giảm giá cho biến thể (đ)'
                  type='text'
                  fullWidth
                  value={formatCurrency(field.value)}
                  onChange={(e) =>
                    field.onChange(parseCurrency(e.target.value))
                  }
                  error={!!errors.discountPrice}
                  helperText={errors.discountPrice?.message}
                />
              )}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {/* Cột trái: Giá nhập / Giá bán */}
              <Box sx={{ width: '100%' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register('overridePrice')}
                      checked={overridePrice}
                      onChange={(e) =>
                        setValue('overridePrice', e.target.checked)
                      }
                    />
                  }
                  label='Đặt giá riêng cho biến thể'
                  sx={{ mb: 1 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
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

              {/* Cột phải: Kích thước đóng gói */}
              <Box sx={{ width: '100%' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register('overridePackageSize')}
                      checked={overridePackageSize}
                      onChange={(e) =>
                        setValue('overridePackageSize', e.target.checked)
                      }
                    />
                  }
                  label='Đặt kích thước đóng gói riêng cho biến thể'
                  sx={{ mb: 1 }}
                />

                <Box sx={{ gap: 2, display: 'flex', width: '100%' }}>
                  <Box sx={{ display: 'flex', gap: 2, width: '100% ' }}>
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
                  <Box sx={{ display: 'flex', gap: 2, width: '100% ' }}>
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
            <Grid item xs={12}>
              <Box>
                <Typography variant='h6'>Trạng thái biến thể</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {[
                    { label: 'Bản nháp', value: 'draft' },
                    { label: 'Hoạt động', value: 'active' },
                    { label: 'Không hoạt động', value: 'inactive' }
                  ]
                    .filter((item) => {
                      const currentStatus = watch('status')
                      return !(
                        currentStatus &&
                        currentStatus !== 'draft' &&
                        item.value === 'draft'
                      )
                    })
                    .map((item) => {
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
                              backgroundColor: 'var(--primary-color)',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: 'var(--primary-color)'
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
            onClick={onClose}
            variant='outlined'
            color='error'
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            variant='contained'
            sx={{
              backgroundColor: 'var(--primary-color)',
              color: '#fff',
              textTransform: 'none'
            }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditVariantModal

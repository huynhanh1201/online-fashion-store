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
  TextField
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

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
      colorImage: ''
    }
  })

  const fileInputRef = useRef(null)
  const overridePrice = watch('overridePrice')
  const colorImage = watch('colorImage')

  useEffect(() => {
    if (variant) {
      reset({
        importPrice: variant.importPrice || 0,
        exportPrice: variant.exportPrice || 0,
        overridePrice: variant.overridePrice || false,
        colorImage: variant.color?.image || ''
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
        color: {
          image: data.colorImage
        }
      }
      await onUpdateVariant(variant._id, updatedVariant)
      toast.success('Cập nhật biến thể thành công')
      onClose()
    } catch (error) {
      console.error('Error updating variant:', error)
      toast.error('Lỗi khi cập nhật biến thể')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Cập nhật biến thể</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'row', gap: 3, mt: 1 }}
        >
          {/* Ảnh màu */}
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
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                    sx={{ backgroundColor: '#fff', boxShadow: 1 }}
                  >
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation()
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

          {/* Thông tin bên phải */}
          <Box
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
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

            <Box>
              <label>
                <input
                  type='checkbox'
                  {...register('overridePrice')}
                  checked={overridePrice}
                  onChange={(e) => setValue('overridePrice', e.target.checked)}
                />{' '}
                Ghi đè giá sản phẩm
              </label>
            </Box>

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
                />
              )}
            />

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
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type='submit' variant='contained'>
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditVariantModal

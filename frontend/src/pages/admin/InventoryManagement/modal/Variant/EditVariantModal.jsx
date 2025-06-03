import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

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

const EditVariantModal = ({ open, onClose, variant, onUpdateVariant }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
    } catch (error) {
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
      console.log('Updated Variant:', updatedVariant)
      await onUpdateVariant(variant._id, updatedVariant)
      toast.success('Cập nhật biến thể thành công')
      onClose()
    } catch (error) {
      console.error('Error updating variant:', error)
      toast.error('Lỗi khi cập nhật biến thể')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Cập nhật biến thể</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          {/* Màu sắc và kích thước */}
          <Box display='flex' gap={3} alignItems='center'>
            <Typography variant='subtitle1'>
              <strong>Màu:</strong> {variant?.color?.name || '---'}
            </Typography>
            <Typography variant='subtitle1'>
              <strong>Kích thước:</strong> {variant?.size?.name || '---'}
            </Typography>
          </Box>

          {/* Upload ảnh màu */}
          <Box display='flex' alignItems='center' gap={2}>
            <Button variant='outlined' component='label'>
              Thay ảnh màu
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
            sx={{ display: 'none' }}
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

          {/* Ghi đè giá */}
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

          <TextField
            label='Giá nhập'
            type='number'
            disabled={!overridePrice}
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

          <TextField
            label='Giá bán'
            type='number'
            disabled={!overridePrice}
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

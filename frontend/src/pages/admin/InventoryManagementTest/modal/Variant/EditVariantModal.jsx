// modal/Variant/EditVariantModal.jsx
import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
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

const EditVariantModal = ({ open, onClose, variant, updateVariant }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm()

  const overridePrice = watch('overridePrice') // Theo dõi overridePrice
  const colorImage = watch('colorImage') // Theo dõi colorImage để hiển thị preview

  useEffect(() => {
    if (variant) {
      setValue('importPrice', variant.importPrice || 0)
      setValue('exportPrice', variant.exportPrice || 0)
      setValue('overridePrice', variant.overridePrice?.toString() || 'false')
      setValue('colorImage', variant.color?.image || '')
    }
  }, [variant, setValue])

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
    const payload = {
      importPrice:
        data.overridePrice === 'true'
          ? Number(data.importPrice)
          : variant.importPrice,
      exportPrice:
        data.overridePrice === 'true'
          ? Number(data.exportPrice)
          : variant.exportPrice,
      overridePrice: data.overridePrice === 'true',
      color: {
        image: data.colorImage
      }
    }

    try {
      await updateVariant(variant._id, payload)
      toast.success('Cập nhật biến thể thành công')
      onClose()
    } catch {
      toast.error('Cập nhật biến thể thất bại')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Cập nhật biến thể</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl fullWidth>
            <InputLabel>Override Price</InputLabel>
            <Select
              {...register('overridePrice', {
                required: 'Vui lòng chọn giá trị'
              })}
              defaultValue={variant?.overridePrice?.toString() || 'false'}
              error={!!errors.overridePrice}
            >
              <MenuItem value='true'>True</MenuItem>
              <MenuItem value='false'>False</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label='Giá nhập'
            fullWidth
            type='number'
            disabled={overridePrice !== 'true'} // Vô hiệu hóa nếu overridePrice không phải true
            {...register('importPrice', {
              required:
                overridePrice === 'true' ? 'Vui lòng nhập giá nhập' : false,
              valueAsNumber: true,
              min:
                overridePrice === 'true'
                  ? { value: 0, message: 'Giá nhập không được âm' }
                  : undefined
            })}
            error={!!errors.importPrice}
            helperText={errors.importPrice?.message}
          />
          <TextField
            label='Giá bán'
            fullWidth
            type='number'
            disabled={overridePrice !== 'true'} // Vô hiệu hóa nếu overridePrice không phải true
            {...register('exportPrice', {
              required:
                overridePrice === 'true' ? 'Vui lòng nhập giá bán' : false,
              valueAsNumber: true,
              min:
                overridePrice === 'true'
                  ? { value: 0, message: 'Giá bán không được âm' }
                  : undefined
            })}
            error={!!errors.exportPrice}
            helperText={errors.exportPrice?.message}
          />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type='submit' variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditVariantModal

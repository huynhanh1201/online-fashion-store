import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useForm } from 'react-hook-form'
import { CloudinaryCategory, URI } from '~/utils/constants'

const uploadToCloudinary = async (file, folder = CloudinaryCategory) => {
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

const EditColorModal = ({ open, onClose, color, onUpdated }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      status: 'draft'
    }
  })

  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef()

  // Load dữ liệu ban đầu khi mở Chart
  useEffect(() => {
    if (color) {
      reset({
        name: color.name || '',
        status: color.isActive ? 'active' : 'inactive'
      })
      setPreviewUrl(color.image || '')
    }
  }, [color, reset])

  const onSubmit = async (data) => {
    try {
      let imageUrl = previewUrl // giữ ảnh cũ mặc định

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile)
      }

      const payload = {
        name: data.name.trim(),
        image: imageUrl,
        isActive: data.status === 'active'
      }

      await onUpdated(payload, 'edit')
      handleClose()
    } catch (error) {
      console.error('Lỗi khi cập nhật màu sắc:', error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setPreviewUrl('')
  }

  const handleEditImage = () => {
    fileInputRef.current?.click()
  }

  const handleClose = () => {
    reset()
    setImageFile(null)
    setPreviewUrl('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>Chỉnh sửa màu sắc</DialogTitle>
      <DialogContent dividers>
        <Stack direction='row' spacing={3}>
          {/* Cột trái: ảnh */}
          <Box sx={{ width: 120 }}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: 128,
                height: 135,
                border: '1px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f9f9f9',
                cursor: 'pointer'
              }}
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    style={{
                      width: 100,
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <Tooltip title='Sửa ảnh'>
                      <IconButton onClick={handleEditImage} size='small'>
                        <EditIcon fontSize='small' color='warning' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Xoá ảnh'>
                      <IconButton onClick={handleImageRemove} size='small'>
                        <DeleteIcon fontSize='small' color='error' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              ) : (
                <Box textAlign='center' color='#999'>
                  <AddPhotoAlternateIcon fontSize='large' />
                  <Typography fontSize={14} mt={1}>
                    Thêm ảnh
                  </Typography>
                </Box>
              )}
            </Box>
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </Box>

          {/* Cột phải: Tên + Trạng thái */}
          <Box sx={{ flex: 1 }}>
            <TextField
              label='Tên màu'
              {...register('name', { required: 'Vui lòng nhập tên màu' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <Box mt={2}>
              <Typography fontWeight='bold' mb={1}>
                Trạng thái
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
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
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: 'none' }}
          color='error'
          variant='outlined'
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          sx={{
            backgroundColor: '#001f5d',
            color: '#fff',
            textTransform: 'none'
          }}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditColorModal

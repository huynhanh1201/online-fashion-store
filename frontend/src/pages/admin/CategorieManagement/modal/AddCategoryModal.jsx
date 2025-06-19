import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

import { useForm } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
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

const AddCategoryModal = ({ open, onClose, onAdded }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const onSubmit = async (data) => {
    try {
      let imageUrl = ''

      // Nếu có file mới upload ảnh
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile)
      }

      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        image: imageUrl || ''
      }

      await onAdded(payload, 'add')
      onClose()
      reset()
      setImageFile(null)
      // setPreviewUrl('')
      // if (result) {
      //   if (onSave) onSave()
      //   onClose()
      //   reset()
      //   setImageFile(null)
      //   setPreviewUrl('')
      // } else {
      //   console.log('Thêm danh mục thất bại. Vui lòng thử lại!')
      // }
    } catch (error) {
      console.log('Lỗi khi tải ảnh hoặc thêm danh mục!', error)
    }
  }

  const handleClose = () => {
    reset()
    setImageFile(null)
    setPreviewUrl('')
    onClose()
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

  const fileInputRef = React.useRef()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Thêm danh mục mới</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ minHeight: 300 }}>
          <Box
            display='flex'
            gap={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            {/* Vùng ảnh bên trái */}
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              border='2px dashed #ccc'
              borderRadius={2}
              p={2}
              position='relative'
              minHeight={200}
              sx={{
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                width: 350,
                height: 345,
                mt: '14px'
              }}
              onClick={() => !previewUrl && fileInputRef.current.click()}
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt='Ảnh danh mục'
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 8
                    }}
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
                        borderRadius: 1
                      }}
                    >
                      <Tooltip title='Xoá'>
                        <IconButton
                          size='small'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImageRemove()
                          }}
                        >
                          <DeleteIcon fontSize='small' color='error' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box textAlign='center' color='#999'>
                  <AddPhotoAlternateIcon fontSize='large' />
                  <Typography fontSize={14} mt={1}>
                    Thêm ảnh màu
                  </Typography>
                </Box>
              )}
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </Box>

            {/* Thông tin bên phải */}
            <Box flex={1}>
              <TextField
                label='Tên danh mục'
                fullWidth
                margin='normal'
                {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={StyleAdmin.InputCustom}
              />
              <TextField
                label='Mô tả (không bắt buộc)'
                fullWidth
                margin='normal'
                multiline
                rows={10}
                {...register('description')}
                sx={StyleAdmin.InputCustom}
              />
            </Box>
          </Box>
        </DialogContent>

        <Divider sx={{ my: 0 }} />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            color='error'
            variant='outlined'
            sx={{ textTransform: 'none' }}
            onClick={handleClose}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            variant='contained'
            sx={{
              backgroundColor: '#001f5d',
              color: '#fff',
              textTransform: 'none'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddCategoryModal

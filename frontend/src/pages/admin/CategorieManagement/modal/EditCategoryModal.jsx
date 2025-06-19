import React, { useEffect, useState, useRef } from 'react'
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

const EditCategoryModal = ({ open, onClose, category, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef()

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name || ''
      })
      setPreviewUrl(category.image || '')
      setImageFile(null)
    }
  }, [open, category, reset])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setPreviewUrl('')
  }

  const handleClose = () => {
    onClose()
    reset()
    setImageFile(null)
    setPreviewUrl('')
  }

  const onSubmit = async (data) => {
    try {
      let imageUrl = previewUrl

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile)
      }

      const payload = {
        name: data.name,
        description: data.description,
        image: imageUrl
      }

      await onSave(payload, 'edit', category._id)
      handleClose()
    } catch (error) {
      console.log('Lỗi khi lưu danh mục:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Sửa thông tin danh mục</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box
            display='flex'
            gap={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            {/* Ảnh bên trái */}
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
                    Thêm ảnh danh mục
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
            onClick={handleClose}
            sx={{ textTransform: 'none' }}
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
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditCategoryModal

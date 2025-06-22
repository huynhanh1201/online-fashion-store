import React, { useEffect, useState, useRef } from 'react'
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

const EditBlogModal = ({ open, onClose, post, onUpdated }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      status: 'draft'
    }
  })

  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef()

  useEffect(() => {
    if (post) {
      reset({
        title: post.title || '',
        content: post.content || '',
        status: post.isActive ? 'active' : 'inactive'
      })
      setPreviewUrl(post.image || '')
    }
  }, [post, reset])

  const onSubmit = async (data) => {
    const payload = {
      title: data.title.trim(),
      content: data.content.trim(),
      image: previewUrl,
      isActive: data.status === 'active'
    }
    await onUpdated(payload, 'edit')
    handleClose()
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
      <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
      <DialogContent dividers>
        <Stack direction='row' spacing={3}>
          <Box sx={{ width: 150 }}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: 150,
                height: 150,
                border: '1px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
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
                      width: '100%',
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
          <Box sx={{ flex: 1 }}>
            <TextField
              label='Tiêu đề'
              {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label='Nội dung'
              {...register('content', { required: 'Vui lòng nhập nội dung' })}
              error={!!errors.content}
              helperText={errors.content?.message}
              fullWidth
              multiline
              minRows={4}
              sx={{ mb: 2 }}
            />
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
                        color: '#fff'
                      })
                    }}
                  />
                )
              })}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='outlined' color='error'>
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          disabled={isSubmitting}
          sx={{ backgroundColor: '#001f5d', color: '#fff' }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditBlogModal

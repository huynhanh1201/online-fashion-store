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
  Tooltip,
  Autocomplete
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import useProducts from '~/hooks/admin/useProducts.js'
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

const EditCategoryModal = ({
  open,
  onClose,
  category,
  onSave,
  categories = []
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm()

  const { fetchProducts, products } = useProducts()

  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [parentCategory, setParentCategory] = useState(null)
  const fileInputRef = useRef()
  const [hasProducts, setHasProducts] = useState(false)

  useEffect(() => {
    if (open && category) {
      fetchProducts(1, 1, { categoryId: category._id })
    }
  }, [open, category])

  useEffect(() => {
    setHasProducts(products.length > 0)
  }, [products])

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name || '',
        description: category.description || ''
      })
      setPreviewUrl(category.image || '')
      setImageFile(null)

      // Set danh mục cha nếu có
      if (category.parent && typeof category.parent === 'object') {
        const found = categories.find((cat) => cat._id === category.parent._id)
        setParentCategory(found || null)
      } else {
        setParentCategory(null)
      }
    }
  }, [open, category, reset, categories])

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
    setParentCategory(null)
  }

  const onSubmit = async (data) => {
    try {
      let imageUrl = previewUrl
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile)
      }

      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        image: imageUrl
      }

      if (parentCategory && parentCategory._id) {
        payload.parent = parentCategory._id
      } else {
        payload.parent = null // Không có danh mục cha
      }

      await onSave(payload, 'edit', category._id)
      handleClose()
    } catch (error) {
      console.log('Lỗi khi lưu danh mục:', error)
    }
  }
  const filteredCategories = categories.filter(
    (category) => category.parent === null
  )
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
                helperText={
                  hasProducts
                    ? 'Không thể sửa tên vì danh mục đã có sản phẩm'
                    : errors.name?.message
                }
                disabled={hasProducts}
              />
              <Autocomplete
                options={filteredCategories.filter(
                  (c) => c._id !== category._id
                )}
                getOptionLabel={(option) => option.name || ''}
                value={parentCategory}
                onChange={(e, value) => setParentCategory(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    label='Danh mục cha (không bắt buộc)'
                    margin='normal'
                  />
                )}
              />
              <TextField
                label='Mô tả (không bắt buộc)'
                fullWidth
                margin='normal'
                multiline
                rows={10}
                {...register('description')}
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

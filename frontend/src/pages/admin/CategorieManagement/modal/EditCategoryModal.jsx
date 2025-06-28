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
import { useForm } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { CloudinaryCategory, URI } from '~/utils/constants'
import useCategories from '~/hooks/admin/useCategories'
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
    formState: { errors, isSubmitting },
    setValue
  } = useForm()

  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [parentCategory, setParentCategory] = useState(null)
  const fileInputRef = useRef()
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const bannerInputRef = useRef()
  const { categories, fetchCategories } = useCategories()
  useEffect(() => {
    fetchCategories(1, 100000)
  }, [])
  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name || '',
        description: category.description || ''
      })
      setPreviewUrl(category.image || '')
      setImageFile(null)
      setBannerPreview(category.banner || '')
      setBannerFile(null)

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
      let bannerUrl = bannerPreview
      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile)
      }

      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        image: imageUrl,
        banner: bannerUrl
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
      maxWidth='xl'
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                Ảnh danh mục
              </Typography>
              {/* Ảnh bên trái */}
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                border='2px dashed #ccc'
                borderRadius={2}
                position='relative'
                sx={{
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  width: 350,
                  height: 355
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
                        height: '100%',
                        objectFit: 'cover',
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
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                Ảnh quan quảng cáo
              </Typography>
              {/* Ảnh banner */}
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                border='2px dashed #ccc'
                borderRadius={2}
                position='relative'
                sx={{
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  width: 350,
                  height: 355
                }}
                onClick={() => !bannerPreview && bannerInputRef.current.click()}
              >
                {bannerPreview ? (
                  <>
                    <img
                      src={bannerPreview}
                      alt='Ảnh banner'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
                            bannerInputRef.current.click()
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
                            setBannerFile(null)
                            setBannerPreview('')
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
                      Thêm ảnh banner
                    </Typography>
                  </Box>
                )}
                <input
                  type='file'
                  accept='image/*'
                  ref={bannerInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setBannerFile(file)
                      setBannerPreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </Box>
            </Box>
            {/* Thông tin bên phải */}
            <Box flex={1} mt={1.6}>
              <TextField
                label='Tên danh mục'
                fullWidth
                margin='normal'
                {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                error={!!errors.name}
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
                rows={6}
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

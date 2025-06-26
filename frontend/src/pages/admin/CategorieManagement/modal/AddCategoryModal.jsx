import React, { useState, useRef } from 'react'
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
  Autocomplete,
  Grid
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

const AddCategoryModal = ({
  open,
  onClose,
  onAdded,
  categories = [],
  onSave
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef()
  const [parentCategory, setParentCategory] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const bannerInputRef = useRef()

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

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleBannerRemove = () => {
    setBannerFile(null)
    setBannerPreview('')
  }

  const onSubmit = async (data) => {
    try {
      let imageUrl = ''
      let bannerUrl = ''
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile)
      if (bannerFile) bannerUrl = await uploadToCloudinary(bannerFile)

      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        image: imageUrl || '',
        banner: bannerUrl || ''
      }

      if (parentCategory && parentCategory._id) {
        payload.parent = parentCategory._id
      } else {
        payload.parent = null
      }

      if (onSave) {
        await onSave(payload)
      } else {
        await onAdded(payload, 'add')
      }

      onClose()
      reset()
      setImageFile(null)
      setPreviewUrl('')
      setBannerFile(null)
      setBannerPreview('')
      setParentCategory(null)
    } catch (error) {
      console.log('Lỗi khi tải ảnh hoặc thêm danh mục!', error)
    }
  }

  const handleClose = () => {
    reset()
    setImageFile(null)
    setPreviewUrl('')
    setParentCategory(null)
    onClose()
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
      <DialogTitle>Thêm danh mục mới</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ minHeight: 300 }}>
          <Box
            display='flex'
            gap={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <Grid container spacing={2}>
              {/* Ảnh danh mục */}
              <Grid item xs={6}>
                <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                  Ảnh danh mục
                </Typography>
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
                    height: 345
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
              </Grid>

              {/* Ảnh quảng cáo / banner */}
              <Grid item xs={6}>
                <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                  Ảnh quảng cáo
                </Typography>
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
                    height: 331
                  }}
                  onClick={() =>
                    !bannerPreview && bannerInputRef.current.click()
                  }
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
                              handleBannerRemove()
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
                        Thêm ảnh quảng cáo
                      </Typography>
                    </Box>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    ref={bannerInputRef}
                    style={{ display: 'none' }}
                    onChange={handleBannerChange}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Vùng nhập liệu */}
            <Box flex={1} mt={1.6}>
              <TextField
                label='Tên danh mục'
                fullWidth
                margin='normal'
                {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <Autocomplete
                options={filteredCategories}
                getOptionLabel={(option) => option.name || ''}
                value={parentCategory}
                onChange={(e, value) => setParentCategory(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: '200 !important', // ✅ Chiều cao tối đa của danh sách dropdown
                          overflowY: 'auto' // ✅ Hiển thị thanh cuộn dọc
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

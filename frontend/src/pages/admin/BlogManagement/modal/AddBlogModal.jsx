import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Autocomplete,
  Stack,
  IconButton,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material'
import {
  Close as CloseIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  Tag as TagIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import ProductDescriptionEditor from '~/pages/admin/ProductManagement/component/ProductDescriptionEditor.jsx'
import { CloudinaryColor, CloudinaryProduct, URI } from '~/utils/constants'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

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

// Unified input styles for consistent appearance
const getInputStyles = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    minHeight: '56px', // Consistent height for all inputs
    backgroundColor: 'white',
    '&:hover fieldset': {
      borderColor: '#0052cc'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0052cc',
      borderWidth: 2
    }
  },
  '& .MuiInputLabel-root': {
    color: '#4a4a4a',
    '&.Mui-focused': { color: '#0052cc' }
  },
  '& .MuiInputBase-input': {
    fontSize: '0.95rem',
    padding: '16.5px 14px'
  }
})

const BlogModal = ({
  open,
  onClose,
  onSave,
  blogData = null,
  mode = 'add'
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isEditMode = mode === 'edit' && blogData

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      images: [],
      tags: [],
      category: '',
      brand: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
    }
  })

  const [imageUrls, setImageUrls] = useState([''])
  const [uploading, setUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const fileInputRef = useRef()
  const categories = [
    'Trang phục',
    'Phụ kiện',
    'Giày dép',
    'Túi xách',
    'Tư vấn phối đồ',
    'Xu hướng thời trang'
  ]

  const brands = [
    'Zara',
    'H&M',
    'Gucci',
    'Louis Vuitton',
    'Nike',
    'Adidas',
    'Uniqlo',
    'Chanel',
    'Dior',
    'Prada'
  ]

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditMode && blogData) {
      // Reset form with blog data
      reset({
        title: blogData.title || '',
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        coverImage: blogData.coverImage || '',
        images: blogData.images || [],
        tags: blogData.tags || [],
        category: blogData.category || '',
        brand: blogData.brand || '',
        status: blogData.status || 'draft',
        metaTitle: blogData.meta?.title || '',
        metaDescription: blogData.meta?.description || '',
        metaKeywords: blogData.meta?.keywords || []
      })

      // Set image URLs for additional images
      if (blogData.images && blogData.images.length > 0) {
        setImageUrls([...blogData.images, ''])
      } else {
        setImageUrls([''])
      }
    } else {
      // Reset to default values for add mode
      reset({
        title: '',
        excerpt: '',
        content: '',
        coverImage: '',
        images: [],
        tags: [],
        category: '',
        brand: '',
        status: 'draft',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: []
      })
      setImageUrls([''])
    }
  }, [isEditMode, blogData, reset])

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, ''])
  }

  const handleRemoveImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newUrls)
  }

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB')
      return
    }

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file, 'blog_covers')
      setValue('coverImage', imageUrl)
      toast.success('Upload ảnh bìa thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi upload ảnh: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB')
      return
    }

    setUploadingIndex(index)
    try {
      const imageUrl = await uploadToCloudinary(file, 'blog_images')
      handleImageUrlChange(index, imageUrl)
      toast.success('Upload ảnh thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi upload ảnh: ' + error.message)
    } finally {
      setUploadingIndex(null)
    }
  }

  const onSubmit = (data) => {
    const blogPayload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      images: imageUrls.filter((url) => url.trim() !== ''),
      tags: data.tags,
      category: data.category,
      brand: data.brand,
      status: data.status,
      meta: {
        title: data.metaTitle || data.title,
        description: data.metaDescription || data.excerpt,
        keywords: data.metaKeywords
      }
    }

    onSave(blogPayload, isEditMode)
    handleClose()
  }

  const handleClose = () => {
    reset()
    setImageUrls([''])
    onClose()
  }

  const watchedValues = watch()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={isMobile ? 'sm' : 'xl'}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '12px',
          boxShadow: '0 8px 24px rgba(0, 31, 93, 0.12)',
          minHeight: '86vh',
          maxHeight: '86vh',
          margin: isMobile ? 0 : '16px'
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*<DialogTitle*/}
        {/*  sx={{*/}
        {/*    // background: 'linear-gradient(135deg, #0052cc 0%, #2684ff 100%)',*/}
        {/*    color: 'white',*/}
        {/*    py: isMobile ? 1.5 : 2,*/}
        {/*    px: isMobile ? 2 : 3,*/}
        {/*    display: 'flex',*/}
        {/*    alignItems: 'start',*/}
        {/*    justifyContent: 'space-between',*/}
        {/*    minHeight: isMobile ? '56px' : '64px'*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Box*/}
        {/*    sx={{*/}
        {/*      display: 'flex',*/}
        {/*      alignItems: 'start',*/}
        {/*      gap: 1.5,*/}
        {/*      flexDirection: 'column'*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    /!*{isEditMode ? (*!/*/}
        {/*    /!*  <EditIcon sx={{ fontSize: isMobile ? 20 : 24 }} />*!/*/}
        {/*    /!*) : (*!/*/}
        {/*    /!*  <ArticleIcon sx={{ fontSize: isMobile ? 20 : 24 }} />*!/*/}
        {/*    /!*)}*!/*/}
        {/*    <Typography*/}
        {/*      variant={isMobile ? 'subtitle1' : 'h6'}*/}
        {/*      sx={{*/}
        {/*        color: '#000',*/}
        {/*        fontWeight: 600,*/}
        {/*        fontSize: isMobile ? '1rem' : '1.25rem',*/}
        {/*        lineHeight: 1.2*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      {isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}*/}
        {/*    </Typography>*/}
        {/*    <DialogActions sx={{ px: 0 }}>*/}
        {/*      <Button*/}
        {/*        onClick={handleClose}*/}
        {/*        variant='outlined'*/}
        {/*        color='error'*/}
        {/*        sx={{ textTransform: 'none' }}*/}
        {/*      >*/}
        {/*        Hủy*/}
        {/*      </Button>*/}
        {/*      <Button*/}
        {/*        type='submit'*/}
        {/*        variant='contained'*/}
        {/*        sx={{*/}
        {/*          backgroundColor: '#001f5d',*/}
        {/*          color: '#fff',*/}
        {/*          textTransform: 'none'*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        {isEditMode ? 'Cập nhật bài viết' : 'Tạo bài viết'}*/}
        {/*      </Button>*/}
        {/*    </DialogActions>*/}
        {/*  </Box>*/}

        {/*  /!*<IconButton*!/*/}
        {/*  /!*  onClick={handleClose}*!/*/}
        {/*  /!*  size={isMobile ? 'small' : 'medium'}*!/*/}
        {/*  /!*  sx={{*!/*/}
        {/*  /!*    color: 'white',*!/*/}
        {/*  /!*    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }*!/*/}
        {/*  /!*  }}*!/*/}
        {/*  /!*>*!/*/}
        {/*  /!*  <CloseIcon />*!/*/}
        {/*  /!*</IconButton>*!/*/}
        {/*</DialogTitle>*/}
        <DialogTitle
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#fff',
            px: isMobile ? 2 : 3,
            py: isMobile ? 1.5 : 2,
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'space-between',
            flexDirection: 'column',
            gap: isMobile ? 1.5 : 2,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            sx={{ fontWeight: 600, fontSize: isMobile ? '1rem' : '1.25rem' }}
          >
            {isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose} variant='outlined' color='error'>
              Hủy
            </Button>
            <Button
              type='submit'
              variant='contained'
              sx={{ backgroundColor: '#001f5d', color: '#fff' }}
            >
              {isEditMode ? 'Cập nhật bài viết' : 'Tạo bài viết'}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: isMobile ? 2 : 3,
            overflowY: 'auto',
            maxHeight: 'calc(83vh - 64px)', // trừ chiều cao header
            backgroundColor: '#f9fafb'
          }}
        >
          {/* Main Container using Flexbox */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 2 : 3
            }}
          >
            {/* Section 1: Basic Information */}
            <Paper
              sx={{
                p: isMobile ? 2 : 2.5,
                borderRadius: '8px',
                border: '1px solid #e8ecef',
                boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)'
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#1a202c',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}
              >
                <ArticleIcon sx={{ color: '#0052cc', fontSize: 20 }} />
                Thông tin cơ bản
              </Typography>

              {/* Title and Status Row */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2,
                  mb: 2
                }}
              >
                <Box sx={{ flex: isMobile ? '1' : '2' }}>
                  <TextField
                    label='Tiêu đề bài viết *'
                    fullWidth
                    variant='outlined'
                    {...register('title', {
                      required: 'Vui lòng nhập tiêu đề'
                    })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={getInputStyles(theme)}
                  />
                </Box>

                <Box sx={{ flex: isMobile ? '1' : '1' }}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái *</InputLabel>
                    <Controller
                      name='status'
                      control={control}
                      rules={{ required: 'Vui lòng chọn trạng thái' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label='Trạng thái *'
                          sx={{
                            ...getInputStyles(theme),
                            '& .MuiSelect-select': {
                              padding: '16.5px 14px'
                            }
                          }}
                        >
                          <MenuItem value='draft'>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: '#ff9800'
                                }}
                              />
                              Bản nháp
                            </Box>
                          </MenuItem>
                          <MenuItem value='published'>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: '#4caf50'
                                }}
                              />
                              Đã xuất bản
                            </Box>
                          </MenuItem>
                          <MenuItem value='archived'>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: '#9e9e9e'
                                }}
                              />
                              Lưu trữ
                            </Box>
                          </MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>

              {/* Excerpt */}
              <TextField
                label='Mô tả ngắn (Excerpt)'
                fullWidth
                multiline
                rows={isMobile ? 2 : 3}
                variant='outlined'
                {...register('excerpt')}
                helperText='Đoạn mô tả ngắn hiển thị trong danh sách bài viết'
                sx={{
                  ...getInputStyles(theme),
                  '& .MuiOutlinedInput-root': {
                    ...getInputStyles(theme)['& .MuiOutlinedInput-root'],
                    minHeight: 'auto'
                  }
                }}
              />
            </Paper>

            {/* Section 2: Two Column Layout for Category/Brand and Cover Image */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 3
              }}
            >
              {/* Left Column: Category & Brand */}
              <Box sx={{ flex: 1 }}>
                <Paper
                  sx={{
                    p: isMobile ? 2 : 2.5,
                    borderRadius: '8px',
                    border: '1px solid #e8ecef',
                    boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)',
                    height: 'fit-content'
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#1a202c',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: isMobile ? '1rem' : '1.1rem'
                    }}
                  >
                    <TagIcon sx={{ color: '#0052cc', fontSize: 20 }} />
                    Phân loại & Thương hiệu
                  </Typography>

                  <Stack spacing={2}>
                    <Controller
                      name='category'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={categories}
                          freeSolo
                          value={field.value}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Chuyên mục *'
                              variant='outlined'
                              helperText='Chọn hoặc nhập chuyên mục'
                              sx={getInputStyles(theme)}
                            />
                          )}
                        />
                      )}
                    />

                    <Controller
                      name='brand'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={brands}
                          freeSolo
                          value={field.value}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Thương hiệu'
                              variant='outlined'
                              helperText='Chọn hoặc nhập thương hiệu'
                              sx={getInputStyles(theme)}
                            />
                          )}
                        />
                      )}
                    />
                  </Stack>
                </Paper>

                {/* Left Column: Tags */}
                <Box sx={{ flex: 1, mt: 3 }}>
                  <Paper
                    sx={{
                      p: isMobile ? 2 : 2.5,
                      borderRadius: '8px',
                      border: '1px solid #e8ecef',
                      boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)',
                      height: 'fit-content'
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#1a202c',
                        fontWeight: 600,
                        mb: 2,
                        fontSize: isMobile ? '1rem' : '1.1rem'
                      }}
                    >
                      <TagIcon sx={{ color: '#0052cc', fontSize: 20 }} />
                      Tags
                    </Typography>

                    <Controller
                      name='tags'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          freeSolo
                          options={[]}
                          value={field.value}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant='filled'
                                size='small'
                                label={option}
                                {...getTagProps({ index })}
                                key={index}
                                sx={{
                                  backgroundColor: '#e3f2fd',
                                  color: '#0052cc',
                                  fontWeight: 500,
                                  '&:hover': { backgroundColor: '#bbdefb' },
                                  '& .MuiChip-deleteIcon': {
                                    color: '#0052cc',
                                    '&:hover': { color: '#003d99' }
                                  }
                                }}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Tags'
                              placeholder='Nhập tag và nhấn Enter'
                              helperText='VD: thời trang, xu hướng'
                              variant='outlined'
                              sx={getInputStyles(theme)}
                            />
                          )}
                        />
                      )}
                    />
                  </Paper>
                </Box>
              </Box>

              {/* Right Column: Cover Image */}
              <Box sx={{ flex: 1 }}>
                <Paper
                  sx={{
                    p: isMobile ? 2 : 2.5,
                    borderRadius: '8px',
                    border: '1px solid #e8ecef',
                    boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)',
                    height: 'fit-content'
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#1a202c',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: isMobile ? '1rem' : '1.1rem'
                    }}
                  >
                    <ImageIcon sx={{ color: '#0052cc', fontSize: 20 }} />
                    Ảnh bìa chính
                  </Typography>

                  <Box
                    sx={{
                      position: 'relative',
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      minHeight: isMobile ? 150 : 365,
                      backgroundColor: '#fafafa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (!watchedValues.coverImage && fileInputRef.current) {
                        fileInputRef.current.click()
                      }
                    }}
                  >
                    {watchedValues.coverImage ? (
                      <>
                        <img
                          src={watchedValues.coverImage}
                          alt='Ảnh bìa'
                          style={{
                            width: '100%',
                            maxHeight: isMobile ? 150 : 200,
                            objectFit: 'contain',
                            borderRadius: 8
                          }}
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        {/* Nút sửa/xoá */}
                        <Box
                          position='absolute'
                          top={8}
                          right={8}
                          display='flex'
                          gap={1}
                          zIndex={1}
                        >
                          <Tooltip title='Sửa ảnh'>
                            <IconButton
                              size='small'
                              onClick={(e) => {
                                e.stopPropagation()
                                fileInputRef.current?.click()
                              }}
                            >
                              <EditIcon fontSize='small' color='warning' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Xoá ảnh'>
                            <IconButton
                              size='small'
                              onClick={(e) => {
                                e.stopPropagation()
                                setValue('coverImage', '')
                              }}
                            >
                              <DeleteIcon fontSize='small' color='error' />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    ) : (
                      <Box textAlign='center' color='#999'>
                        {uploading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <>
                            <AddPhotoAlternateIcon fontSize='large' />
                            <Typography fontSize={14} mt={1}>
                              Thêm ảnh bìa
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}

                    <input
                      type='file'
                      accept='image/*'
                      hidden
                      ref={fileInputRef}
                      onChange={handleCoverImageUpload}
                    />
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Section 3: Two Column Layout for Tags and SEO */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 3
              }}
            >
              {/* Right Column: SEO */}
              <Box sx={{ flex: 1 }}>
                <Paper
                  sx={{
                    p: isMobile ? 2 : 2.5,
                    borderRadius: '8px',
                    border: '1px solid #e8ecef',
                    boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)',
                    height: 'fit-content'
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#1a202c',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: isMobile ? '1rem' : '1.1rem'
                    }}
                  >
                    <SearchIcon sx={{ color: '#0052cc', fontSize: 20 }} />
                    SEO
                  </Typography>

                  <Stack spacing={2}>
                    <TextField
                      label='Meta Title'
                      fullWidth
                      {...register('metaTitle')}
                      helperText='Tiêu đề SEO (để trống = dùng tiêu đề)'
                      sx={getInputStyles(theme)}
                    />

                    <TextField
                      label='Meta Description'
                      fullWidth
                      multiline
                      rows={2}
                      {...register('metaDescription')}
                      helperText='Mô tả SEO (để trống = dùng excerpt)'
                      sx={{
                        ...getInputStyles(theme),
                        '& .MuiOutlinedInput-root': {
                          ...getInputStyles(theme)['& .MuiOutlinedInput-root'],
                          minHeight: 'auto'
                        }
                      }}
                    />
                  </Stack>
                </Paper>
              </Box>
            </Box>

            {/* Section 4: Additional Images */}
            <Paper
              sx={{
                p: isMobile ? 2 : 2.5,
                borderRadius: '8px',
                border: '1px solid #e8ecef',
                boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)'
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#1a202c',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}
              >
                <ImageIcon sx={{ color: '#0052cc', fontSize: 20 }} />
                Ảnh bổ sung
              </Typography>

              <Stack spacing={2}>
                {imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      backgroundColor: '#fafbff',
                      border: '1px solid #e8f4fd',
                      borderRadius: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 1.5,
                        alignItems: 'flex-start'
                      }}
                    >
                      <TextField
                        label={`Ảnh ${index + 1}`}
                        fullWidth
                        value={url}
                        onChange={(e) =>
                          handleImageUrlChange(index, e.target.value)
                        }
                        variant='outlined'
                        sx={{
                          ...getInputStyles(theme),
                          '& .MuiOutlinedInput-root': {
                            ...getInputStyles(theme)[
                              '& .MuiOutlinedInput-root'
                            ],
                            backgroundColor: 'white'
                          }
                        }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          width: isMobile ? '100%' : 'auto'
                        }}
                      >
                        <Button
                          variant='contained'
                          component='label'
                          startIcon={
                            uploadingIndex === index ? (
                              <CircularProgress size={14} color='inherit' />
                            ) : (
                              <UploadIcon />
                            )
                          }
                          disabled={uploadingIndex === index}
                          sx={{
                            minWidth: isMobile ? '50%' : '100px',
                            height: '56px',
                            borderRadius: 2,
                            backgroundColor: '#0052cc',
                            '&:hover': {
                              backgroundColor: '#003d99'
                            }
                          }}
                        >
                          {uploadingIndex === index ? 'Tải...' : 'Upload'}
                          <input
                            type='file'
                            hidden
                            accept='image/*'
                            onChange={(e) => handleImageUpload(e, index)}
                          />
                        </Button>

                        <Button
                          variant='outlined'
                          color='error'
                          onClick={() => handleRemoveImageUrl(index)}
                          disabled={imageUrls.length === 1}
                          sx={{
                            minWidth: isMobile ? '50%' : '80px',
                            height: '56px',
                            borderRadius: 2
                          }}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))}

                <Button
                  variant='outlined'
                  startIcon={<ImageIcon />}
                  onClick={handleAddImageUrl}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: '#0052cc',
                    color: '#0052cc',
                    borderStyle: 'dashed',
                    '&:hover': {
                      borderColor: '#003d99',
                      backgroundColor: '#f0f4ff',
                      borderStyle: 'solid'
                    }
                  }}
                >
                  Thêm ảnh
                </Button>
              </Stack>
            </Paper>

            {/* Section 5: Content Editor */}
            <Paper
              sx={{
                p: isMobile ? 2 : 2.5,
                borderRadius: '8px',
                border: '1px solid #e8ecef',
                boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)'
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#1a202c',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}
              >
                <ArticleIcon sx={{ color: '#0052cc', fontSize: 20 }} />
                Nội dung bài viết
              </Typography>

              <Box
                sx={{
                  border: '1px solid #e8f4fd',
                  borderRadius: 2,
                  overflow: 'hidden',
                  minHeight: isMobile ? '250px' : '300px'
                }}
              >
                <ProductDescriptionEditor
                  control={control}
                  name='content'
                  setValue={setValue}
                />
              </Box>
            </Paper>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default BlogModal

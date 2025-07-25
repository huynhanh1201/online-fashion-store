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
import DescriptionEditor from '~/components/EditContent/DescriptionEditor.jsx'
import { CloudinaryColor, CloudinaryProduct, URI } from '~/utils/constants'
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
    },
    mode: 'onBlur'
  })

  const [imageUrls, setImageUrls] = useState([''])
  const [uploading, setUploading] = useState(false)
  const [currentTagInput, setCurrentTagInput] = useState('')
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
    } catch (error) {
      toast.error('Có lỗi xảy ra khi upload ảnh: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleImageInsertFromEditor = (url) => {
    // Chỉ thêm nếu ảnh chưa có trong imageUrls
    setImageUrls((prev) => {
      const trimmed = prev.map((u) => u.trim())
      if (!trimmed.includes(url)) return [...trimmed.filter((u) => u), url, '']
      return [...trimmed, '']
    })
  }

  const onSubmit = (data) => {
    let finalTags = data.tags || []
    if (currentTagInput.trim() !== '') {
      finalTags = [...finalTags, currentTagInput.trim()]
    }

    const blogPayload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      images: imageUrls.filter((url) => url.trim() !== ''),
      tags: finalTags,
      category: data.category,
      brand: data.brand,
      status: data.status,
      meta: {
        title: data.metaTitle || data.title,
        description: data.metaDescription || data.excerpt,
        keywords: Array(data.metaTitle || data.title)
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
  // Ở trong component BlogModal
  const statusOptions = [
    { value: 'draft', label: 'Bản nháp', color: '#ff9800' },
    { value: 'published', label: 'Xuất bản', color: '#4caf50' },
    { value: 'archived', label: 'Lưu trữ', color: '#9e9e9e' }
  ]

  // Lọc trạng thái khi blog đã từng là 'published' hoặc 'archived'
  const filteredStatusOptions =
    isEditMode && ['published', 'archived'].includes(blogData?.status)
      ? statusOptions.filter((s) => s.value !== 'draft')
      : statusOptions

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={isMobile ? 'sm' : 'lg'}
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-container': { alignItems: 'end' },
        '& .MuiDialog-paper': {
          maxHeight: '95%',
          height: '95%',
          mt: 0,
          mb: 2.4
        }
      }}
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
            variant='h6'
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
              sx={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}
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
                    label={
                      <>
                        Tiêu đề bài viết <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                    fullWidth
                    variant='outlined'
                    {...register('title', {
                      required: 'Tiêu đề là bắt buộc',
                      maxLength: {
                        value: 255,
                        message: 'Tiêu đề không được vượt quá 255 ký tự'
                      },
                      validate: (value) =>
                        value.trim() === value ||
                        'Tiêu đề không được có khoảng trắng đầu/cuối'
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
                          {filteredStatusOptions.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
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
                                    bgcolor: status.color
                                  }}
                                />
                                {status.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>

              {/* Excerpt */}
              <TextField
                label='Mô tả ngắn'
                fullWidth
                multiline
                rows={isMobile ? 2 : 3}
                variant='outlined'
                {...register('excerpt', {
                  validate: (value) =>
                    value === '' ||
                    value.trim() === value ||
                    'Mô tả không được có khoảng trắng đầu/cuối'
                })}
                error={!!errors.excerpt}
                helperText={errors.excerpt?.message}
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
              {/*<Box sx={{ flex: 1 }}>*/}
              {/*  <Paper*/}
              {/*    sx={{*/}
              {/*      p: isMobile ? 2 : 2.5,*/}
              {/*      borderRadius: '8px',*/}
              {/*      border: '1px solid #e8ecef',*/}
              {/*      boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)',*/}
              {/*      height: 'fit-content'*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <Typography*/}
              {/*      variant='subtitle1'*/}
              {/*      sx={{*/}
              {/*        display: 'flex',*/}
              {/*        alignItems: 'center',*/}
              {/*        gap: 1,*/}
              {/*        color: '#1a202c',*/}
              {/*        fontWeight: 600,*/}
              {/*        mb: 2,*/}
              {/*        fontSize: isMobile ? '1rem' : '1.1rem'*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <TagIcon sx={{ color: '#0052cc', fontSize: 20 }} />*/}
              {/*      Phân loại & Thương hiệu*/}
              {/*    </Typography>*/}

              {/*    <Stack spacing={2}>*/}
              {/*      <Controller*/}
              {/*        name='category'*/}
              {/*        control={control}*/}
              {/*        render={({ field }) => (*/}
              {/*          <Autocomplete*/}
              {/*            options={categories}*/}
              {/*            freeSolo*/}
              {/*            value={field.value ?? ''}*/}
              {/*            onChange={(_, newValue) =>*/}
              {/*              field.onChange(newValue ?? '')*/}
              {/*            }*/}
              {/*            onInputChange={(_, newInputValue) =>*/}
              {/*              field.onChange(newInputValue)*/}
              {/*            }*/}
              {/*            renderInput={(params) => (*/}
              {/*              <TextField*/}
              {/*                {...params}*/}
              {/*                label='Chuyên mục *'*/}
              {/*                variant='outlined'*/}
              {/*                helperText='Chọn hoặc nhập chuyên mục'*/}
              {/*                sx={getInputStyles(theme)}*/}
              {/*              />*/}
              {/*            )}*/}
              {/*          />*/}
              {/*        )}*/}
              {/*      />*/}

              {/*      <Controller*/}
              {/*        name='brand'*/}
              {/*        control={control}*/}
              {/*        render={({ field }) => (*/}
              {/*          <Autocomplete*/}
              {/*            options={brands}*/}
              {/*            freeSolo*/}
              {/*            value={field.value ?? ''}*/}
              {/*            onChange={(_, newValue) =>*/}
              {/*              field.onChange(newValue ?? '')*/}
              {/*            }*/}
              {/*            onInputChange={(_, newInputValue) =>*/}
              {/*              field.onChange(newInputValue)*/}
              {/*            }*/}
              {/*            renderInput={(params) => (*/}
              {/*              <TextField*/}
              {/*                {...params}*/}
              {/*                label='Thương hiệu'*/}
              {/*                variant='outlined'*/}
              {/*                helperText='Chọn hoặc nhập thương hiệu'*/}
              {/*                sx={getInputStyles(theme)}*/}
              {/*              />*/}
              {/*            )}*/}
              {/*          />*/}
              {/*        )}*/}
              {/*      />*/}
              {/*    </Stack>*/}
              {/*  </Paper>*/}

              {/*  /!* Left Column: Tags *!/*/}
              {/*  <Box sx={{ flex: 1, mt: 3 }}>*/}
              {/*    <Paper*/}
              {/*      sx={{*/}
              {/*        p: isMobile ? 2 : 2.5,*/}
              {/*        borderRadius: '8px',*/}
              {/*        border: '1px solid #e8ecef',*/}
              {/*        boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)',*/}
              {/*        height: 'fit-content'*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <Typography*/}
              {/*        variant='subtitle1'*/}
              {/*        sx={{*/}
              {/*          display: 'flex',*/}
              {/*          alignItems: 'center',*/}
              {/*          gap: 1,*/}
              {/*          color: '#1a202c',*/}
              {/*          fontWeight: 600,*/}
              {/*          mb: 2,*/}
              {/*          fontSize: isMobile ? '1rem' : '1.1rem'*/}
              {/*        }}*/}
              {/*      >*/}
              {/*        <TagIcon sx={{ color: '#0052cc', fontSize: 20 }} />*/}
              {/*        Thẻ*/}
              {/*      </Typography>*/}

              {/*      <Controller*/}
              {/*        name='tags'*/}
              {/*        control={control}*/}
              {/*        render={({ field }) => (*/}
              {/*          <Autocomplete*/}
              {/*            multiple*/}
              {/*            freeSolo*/}
              {/*            options={[]} // nếu có gợi ý thì thêm vào*/}
              {/*            value={field.value || []}*/}
              {/*            inputValue={currentTagInput}*/}
              {/*            onInputChange={(_, newInputValue) =>*/}
              {/*              setCurrentTagInput(newInputValue)*/}
              {/*            }*/}
              {/*            onChange={(_, newValue) => {*/}
              {/*              field.onChange(newValue)*/}
              {/*              setCurrentTagInput('')*/}
              {/*            }}*/}
              {/*            renderTags={(value, getTagProps) =>*/}
              {/*              value.map((option, index) => (*/}
              {/*                <Chip*/}
              {/*                  variant='filled'*/}
              {/*                  size='small'*/}
              {/*                  label={option}*/}
              {/*                  {...getTagProps({ index })}*/}
              {/*                  key={index}*/}
              {/*                  sx={{*/}
              {/*                    backgroundColor: '#e3f2fd',*/}
              {/*                    color: '#0052cc',*/}
              {/*                    fontWeight: 500,*/}
              {/*                    '& .MuiChip-deleteIcon': {*/}
              {/*                      color: '#0052cc',*/}
              {/*                      '&:hover': { color: '#003d99' }*/}
              {/*                    }*/}
              {/*                  }}*/}
              {/*                />*/}
              {/*              ))*/}
              {/*            }*/}
              {/*            renderInput={(params) => (*/}
              {/*              <TextField*/}
              {/*                {...params}*/}
              {/*                label='Thẻ'*/}
              {/*                placeholder='Nhập tên thể và nhấn Enter'*/}
              {/*                helperText='VD: thời trang, xu hướng'*/}
              {/*                variant='outlined'*/}
              {/*                sx={getInputStyles()}*/}
              {/*              />*/}
              {/*            )}*/}
              {/*          />*/}
              {/*        )}*/}
              {/*      />*/}
              {/*    </Paper>*/}
              {/*  </Box>*/}
              {/*</Box>*/}

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
                            maxHeight: isMobile ? 150 : 365,
                            objectFit: 'cover',
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

            {/* Section 5: EditContent Editor */}
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
                Nội dung bài viết <span style={{ color: 'red' }}>*</span>
              </Typography>

              <Box
                sx={{
                  border: '1px solid #e8f4fd',
                  borderRadius: 2,
                  overflow: 'hidden',
                  minHeight: isMobile ? '250px' : '300px'
                }}
              >
                <DescriptionEditor
                  control={control}
                  name='content'
                  setValue={setValue}
                  initialHtml={blogData?.content || ''}
                  onImageInsert={handleImageInsertFromEditor}
                  isEditMode={isEditMode}
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

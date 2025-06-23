import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Autocomplete,
  Stack,
  Divider,
  Card,
  CardContent,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Close as CloseIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  Tag as TagIcon,
  Search as SearchIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import ProductDescriptionEditor from '~/pages/admin/ProductManagement/component/ProductDescriptionEditor.jsx'
import { CloudinaryColor, CloudinaryProduct, URI } from '~/utils/constants'

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

const uploadImageFunction = async (file) => {
  try {
    const secureUrl = await uploadToCloudinary(file, CloudinaryProduct)
    return { data: { link: secureUrl } }
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error)
    return Promise.reject(error)
  }
}

const AddBlogModal = ({ open, onClose, onSave }) => {
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
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

  // Danh sách categories có sẵn
  const categories = [
    'Trang phục',
    'Phụ kiện',
    'Giày dép',
    'Túi xách',
    'Tư vấn phối đồ',
    'Xu hướng thời trang'
  ]

  // Danh sách brands có sẵn
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

  // Upload ảnh bìa
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

  // Upload ảnh bổ sung
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
    // Tạo slug từ title
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')

    const newBlog = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      images: imageUrls.filter(url => url.trim() !== ''),
      tags: data.tags,
      category: data.category,
      brand: data.brand,
      status: data.status,

      meta: {
        title: data.metaTitle || data.title,
        description: data.metaDescription || data.excerpt,
        keywords: data.metaKeywords
      },
    }

    onSave(newBlog)
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
      maxWidth='lg'
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0, 31, 93, 0.15)',
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #001f5d 0%, #0d47a1 100%)',
        color: 'white',
        py: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ArticleIcon sx={{ fontSize: 24 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Tạo bài viết mới
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{
          maxHeight: '75vh',
          backgroundColor: '#fafbff',
          p: 3
        }}>
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd'
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#001f5d',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  <Box sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <ArticleIcon sx={{ color: '#001f5d', fontSize: 18 }} />
                  </Box>
                  Thông tin cơ bản
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Tiêu đề bài viết *"
                      fullWidth
                      variant="outlined"
                      {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#001f5d' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#001f5d',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái *</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Vui lòng chọn trạng thái' }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Trạng thái *"
                            sx={{
                              borderRadius: 2,
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#001f5d' },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#001f5d',
                                borderWidth: 2
                              }
                            }}
                          >
                            <MenuItem value="draft">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff9800' }} />
                                Bản nháp
                              </Box>
                            </MenuItem>
                            <MenuItem value="published">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4caf50' }} />
                                Đã xuất bản
                              </Box>
                            </MenuItem>
                            <MenuItem value="archived">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#9e9e9e' }} />
                                Lưu trữ
                              </Box>
                            </MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Mô tả ngắn (Excerpt)"
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      {...register('excerpt')}
                      helperText="Đoạn mô tả ngắn hiển thị trong danh sách bài viết"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#001f5d' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#001f5d',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Phân loại */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd'
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#001f5d',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  <Box sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: '#e8f5e8',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <TagIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                  </Box>
                  Phân loại & Thương hiệu
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={categories}
                          freeSolo
                          value={field.value}
                          onChange={(event, newValue) => field.onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Chuyên mục *"
                              variant="outlined"
                              helperText="Chọn hoặc nhập chuyên mục"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': { borderColor: '#001f5d' },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#001f5d',
                                    borderWidth: 2
                                  }
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={brands}
                          freeSolo
                          value={field.value}
                          onChange={(event, newValue) => field.onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Thương hiệu"
                              variant="outlined"
                              helperText="Chọn hoặc nhập thương hiệu"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': { borderColor: '#001f5d' },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#001f5d',
                                    borderWidth: 2
                                  }
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Hình ảnh */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd'
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#001f5d',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  <Box sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: '#fff3e0',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <ImageIcon sx={{ color: '#f57c00', fontSize: 18 }} />
                  </Box>
                  Hình ảnh bài viết
                </Typography>

                {/* Ảnh bìa */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom sx={{
                    color: '#001f5d',
                    fontWeight: 500,
                    mb: 1.5
                  }}>
                    Ảnh bìa chính
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
                    <TextField
                      label="URL ảnh bìa *"
                      fullWidth
                      size="small"
                      variant="outlined"
                      {...register('coverImage')}
                      helperText="Nhập URL hoặc upload file"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#001f5d' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#001f5d',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                      }}
                    />

                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <UploadIcon />}
                      disabled={uploading}
                      sx={{
                        minWidth: '100px',
                        borderRadius: 2,
                        backgroundColor: '#001f5d',
                        '&:hover': {
                          backgroundColor: '#001a4d'
                        }
                      }}
                    >
                      {uploading ? 'Tải...' : 'Upload'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                      />
                    </Button>
                  </Box>

                  {watchedValues.coverImage && (
                    <Box sx={{
                      mt: 2,
                      p: 1.5,
                      border: '1px dashed #e3f2fd',
                      borderRadius: 2,
                      backgroundColor: '#fafbff'
                    }}>
                      <img
                        src={watchedValues.coverImage}
                        alt="Preview ảnh bìa"
                        style={{
                          width: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Ảnh bổ sung */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd'
                }}
              >
                <Typography variant="body2" gutterBottom sx={{
                  color: '#001f5d',
                  fontWeight: 500,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ImageIcon fontSize="small" /> Ảnh bổ sung
                </Typography>

                <Stack spacing={2}>
                  {imageUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        backgroundColor: '#fafbff',
                        border: '1px solid #e8f4fd',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <TextField
                          label={`Ảnh ${index + 1}`}
                          fullWidth
                          size="small"
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'white',
                              '&:hover fieldset': { borderColor: '#001f5d' },
                              '&.Mui-focused fieldset': {
                                borderColor: '#001f5d',
                                borderWidth: 2
                              }
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                          }}
                        />

                        <Button
                          variant="contained"
                          component="label"
                          size="small"
                          startIcon={uploadingIndex === index ? <CircularProgress size={14} color="inherit" /> : <UploadIcon />}
                          disabled={uploadingIndex === index}
                          sx={{
                            minWidth: '80px',
                            borderRadius: 2,
                            backgroundColor: '#001f5d',
                            '&:hover': {
                              backgroundColor: '#001a4d'
                            }
                          }}
                        >
                          {uploadingIndex === index ? 'Tải...' : 'Up'}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                          />
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveImageUrl(index)}
                          disabled={imageUrls.length === 1}
                          sx={{
                            minWidth: '60px',
                            borderRadius: 2
                          }}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={handleAddImageUrl}
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      borderColor: '#001f5d',
                      color: '#001f5d',
                      borderStyle: 'dashed',
                      '&:hover': {
                        borderColor: '#001a4d',
                        backgroundColor: '#f0f4ff',
                        borderStyle: 'solid'
                      }
                    }}
                  >
                    Thêm ảnh
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Tags */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd'
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#001f5d',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  <Box sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: '#f3e5f5',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <TagIcon sx={{ color: '#7b1fa2', fontSize: 18 }} />
                  </Box>
                  Tags
                </Typography>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      size="small"
                      multiple
                      freeSolo
                      options={[]}
                      value={field.value}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="filled"
                            size="small"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                            sx={{
                              backgroundColor: '#e3f2fd',
                              color: '#001f5d',
                              fontWeight: 500,
                              '&:hover': { backgroundColor: '#bbdefb' },
                              '& .MuiChip-deleteIcon': {
                                color: '#001f5d',
                                '&:hover': { color: '#001a4d' }
                              }
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Nhập tag và nhấn Enter"
                          helperText="VD: thời trang, xu hướng"
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: '#001f5d' },
                              '&.Mui-focused fieldset': {
                                borderColor: '#001f5d',
                                borderWidth: 2
                              }
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Paper>
            </Grid>

            {/* SEO Meta */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd'
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#001f5d',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  <Box sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: '#fff8e1',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <SearchIcon sx={{ color: '#f57f17', fontSize: 18 }} />
                  </Box>
                  SEO
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="Meta Title"
                    fullWidth
                    size="small"
                    {...register('metaTitle')}
                    helperText="Tiêu đề SEO (để trống = dùng tiêu đề)"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: '#001f5d' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#001f5d',
                          borderWidth: 2
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                    }}
                  />

                  <TextField
                    label="Meta Description"
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    {...register('metaDescription')}
                    helperText="Mô tả SEO (để trống = dùng excerpt)"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: '#001f5d' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#001f5d',
                          borderWidth: 2
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                    }}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Nội dung */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd'
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#001f5d',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  <Box sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: '#e8f5e8',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <ArticleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                  </Box>
                  Nội dung bài viết
                </Typography>

                <Box sx={{
                  border: '1px solid #e8f4fd',
                  borderRadius: 2,
                  overflow: 'hidden',
                  minHeight: '200px'
                }}>
                  <ProductDescriptionEditor
                    control={control}
                    name="content"
                    setValue={setValue}
                  />
                </Box>
              </Paper>
            </Grid>


          </Grid>
        </DialogContent>

        <DialogActions sx={{
          p: 2,
          backgroundColor: '#fafbff',
          borderTop: '1px solid #e3f2fd',
          gap: 1.5
        }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              minWidth: '100px',
              borderRadius: 2,
              borderColor: '#9e9e9e',
              color: '#616161',
              '&:hover': {
                borderColor: '#757575',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              minWidth: '140px',
              borderRadius: 2,
              backgroundColor: '#001f5d',
              '&:hover': {
                backgroundColor: '#001a4d'
              }
            }}
          >
            Tạo bài viết
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddBlogModal
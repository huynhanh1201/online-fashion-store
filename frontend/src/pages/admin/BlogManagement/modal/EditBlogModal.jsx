import React, { useEffect, useState } from 'react'
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
  Divider,
  Card,
  IconButton,
  CircularProgress
} from '@mui/material'
import {
  Close as CloseIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  Tag as TagIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import ProductDescriptionEditor from '~/pages/admin/ProductManagement/component/ProductDescriptionEditor.jsx'
import { uploadImageToCloudinary } from '~/utils/cloudinary.js'

const EditBlogModal = ({ open, onClose, onSave, blog }) => {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm()
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

  useEffect(() => {
    if (blog && open) {
      reset({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        coverImage: blog.coverImage || '',
        tags: blog.tags || [],
        category: blog.category || '',
        brand: blog.brand || '',
        status: blog.status || 'draft',
        metaTitle: blog.meta?.title || '',
        metaDescription: blog.meta?.description || '',
        metaKeywords: blog.meta?.keywords || []
      })
      setImageUrls(blog.images && blog.images.length > 0 ? blog.images : [''])
    }
  }, [blog, open, reset])

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
      const result = await uploadImageToCloudinary(file, 'blog_covers')
      if (result.success) {
        setValue('coverImage', result.url)
        toast.success('Upload ảnh bìa thành công!')
      } else {
        toast.error('Upload ảnh bìa thất bại: ' + result.error)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi upload ảnh')
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
      const result = await uploadImageToCloudinary(file, 'blog_images')
      if (result.success) {
        handleImageUrlChange(index, result.url)
        toast.success('Upload ảnh thành công!')
      } else {
        toast.error('Upload ảnh thất bại: ' + result.error)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi upload ảnh')
    } finally {
      setUploadingIndex(null)
    }
  }

  const onSubmit = (data) => {
    // Tạo slug từ title nếu title thay đổi
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')

    const updatedBlog = {
      ...blog,
      title: data.title,
      slug: data.title !== blog.title ? slug : blog.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      images: imageUrls.filter(url => url.trim() !== ''),
      tags: data.tags,
      category: data.category,
      brand: data.brand,
      status: data.status,
      publishedAt: data.status === 'published' && blog.status !== 'published' 
        ? new Date().toISOString() 
        : blog.publishedAt,
      updatedAt: new Date().toISOString(),
      meta: {
        title: data.metaTitle || data.title,
        description: data.metaDescription || data.excerpt,
        keywords: data.metaKeywords
      }
    }

    onSave(updatedBlog)
    handleClose()
  }

  const handleClose = () => {
    onClose()
  }

  if (!blog) return null

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Chỉnh sửa bài viết: {blog.title}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ maxHeight: '80vh' }}>
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ArticleIcon fontSize="small" /> Thông tin cơ bản
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                label="Tiêu đề bài viết *"
                fullWidth
                size="small"
                {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#001f5d' },
                    '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
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
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#001f5d' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#001f5d' }
                      }}
                    >
                      <MenuItem value="draft">Bản nháp</MenuItem>
                      <MenuItem value="published">Đã xuất bản</MenuItem>
                      <MenuItem value="archived">Lưu trữ</MenuItem>
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
                size="small"
                {...register('excerpt')}
                helperText="Đoạn mô tả ngắn hiển thị trong danh sách bài viết"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#001f5d' },
                    '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    size="small"
                    options={categories}
                    freeSolo
                    value={field.value}
                    onChange={(event, newValue) => {
                      field.onChange(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Chuyên mục *" 
                        variant="outlined"
                        helperText="Chọn hoặc nhập chuyên mục"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#001f5d' },
                            '&.Mui-focused fieldset': { borderColor: '#001f5d' }
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
                    size="small"
                    options={brands}
                    freeSolo
                    value={field.value}
                    onChange={(event, newValue) => {
                      field.onChange(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Thương hiệu" 
                        variant="outlined"
                        helperText="Chọn hoặc nhập thương hiệu"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#001f5d' },
                            '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Hình ảnh */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon fontSize="small" /> Hình ảnh
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2, backgroundColor: '#f8faff', border: '1px solid #e3e8ff' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#001f5d', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon fontSize="small" /> Ảnh bìa chính
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="URL ảnh bìa *"
                    fullWidth
                    size="small"
                    variant="outlined"
                    {...register('coverImage')}
                    helperText="Nhập đường dẫn URL của ảnh bìa hoặc upload file"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#001f5d' },
                        '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                      disabled={uploading}
                      sx={{ 
                        minWidth: '120px',
                        borderColor: '#001f5d',
                        color: '#001f5d',
                        '&:hover': { borderColor: '#001a4d', backgroundColor: '#f0f4ff' }
                      }}
                    >
                      {uploading ? 'Đang tải...' : 'Upload'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                      />
                    </Button>
                  </Box>
                </Box>

                {watch('coverImage') && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={watch('coverImage')}
                      alt="Preview ảnh bìa"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </Box>
                )}
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2, backgroundColor: '#f8faff', border: '1px solid #e3e8ff' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#001f5d', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon fontSize="small" /> Ảnh bổ sung
                </Typography>
                {imageUrls.map((url, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
                    <TextField
                      label={`Ảnh ${index + 1} URL`}
                      fullWidth
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#001f5d' },
                          '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                      }}
                    />
                    
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={uploadingIndex === index ? <CircularProgress size={16} /> : <UploadIcon />}
                      disabled={uploadingIndex === index}
                      sx={{ 
                        minWidth: '100px',
                        borderColor: '#001f5d',
                        color: '#001f5d',
                        '&:hover': { borderColor: '#001a4d', backgroundColor: '#f0f4ff' }
                      }}
                    >
                      Upload
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
                      sx={{ minWidth: '60px' }}
                    >
                      Xóa
                    </Button>
                  </Box>
                ))}
                <Button 
                  variant="outlined" 
                  onClick={handleAddImageUrl}
                  sx={{
                    borderColor: '#001f5d',
                    color: '#001f5d',
                    '&:hover': { borderColor: '#001a4d', backgroundColor: '#f0f4ff' }
                  }}
                >
                  Thêm ảnh
                </Button>
              </Card>
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TagIcon fontSize="small" /> Tags và từ khóa
              </Typography>
            </Grid>

            <Grid item xs={12}>
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
                    value={field.value || []}
                    onChange={(event, newValue) => {
                      field.onChange(newValue)
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                          key={index}
                          sx={{
                            borderColor: '#001f5d',
                            color: '#001f5d',
                            '&:hover': { backgroundColor: '#f0f4ff' }
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Nhập tag và nhấn Enter"
                        helperText="VD: thời trang, mùa hè, gucci"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#001f5d' },
                            '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Nội dung */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ArticleIcon fontSize="small" /> Nội dung bài viết
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2, backgroundColor: '#f8faff', border: '1px solid #e3e8ff' }}>
                <ProductDescriptionEditor
                  control={control}
                  name="content"
                  setValue={setValue}
                  initialHtml={blog.content || ''}
                />
              </Card>
            </Grid>

            {/* SEO Meta */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon fontSize="small" /> SEO Meta Tags
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Meta Title"
                fullWidth
                size="small"
                {...register('metaTitle')}
                helperText="Tiêu đề hiển thị trên search engine (để trống sẽ dùng tiêu đề bài viết)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#001f5d' },
                    '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Meta Description"
                fullWidth
                multiline
                rows={2}
                size="small"
                {...register('metaDescription')}
                helperText="Mô tả hiển thị trên search engine (để trống sẽ dùng excerpt)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#001f5d' },
                    '&.Mui-focused fieldset': { borderColor: '#001f5d' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#001f5d' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="metaKeywords"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    size="small"
                    multiple
                    freeSolo
                    options={[]}
                    value={field.value || []}
                    onChange={(event, newValue) => {
                      field.onChange(newValue)
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                          key={index}
                          sx={{
                            borderColor: '#001f5d',
                            color: '#001f5d',
                            '&:hover': { backgroundColor: '#f0f4ff' }
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Meta Keywords"
                        placeholder="Nhập từ khóa SEO và nhấn Enter"
                        helperText="Từ khóa SEO để tối ưu tìm kiếm"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#001f5d' },
                            '&.Mui-focused fieldset': { borderColor: '#001f5d' }
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
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ 
              backgroundColor: '#001f5d',
              '&:hover': { backgroundColor: '#001a4d' }
            }}
          >
            Cập nhật bài viết
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditBlogModal
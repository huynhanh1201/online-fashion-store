import React, { useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Typography,
  Box,
  Card,
  CardMedia,
  Tooltip,
  useTheme,
  Autocomplete
} from '@mui/material'
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import {
  getFeaturedCategories,
  addFeaturedCategory,
  updateFeaturedCategory,
  validateFeaturedCategoryContent
} from '~/services/admin/webConfig/featuredcategoryService.js'
import { getCategoriesWithProducts } from '~/services/admin/categoryService.js'
import { URI, CLOUD_FOLDER } from '~/utils/constants.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

// Upload function to Cloudinary
const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', CLOUD_FOLDER)

  const res = await fetch(URI, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    throw new Error('Upload thất bại')
  }

  const data = await res.json()
  return data.secure_url
}

const AddFeaturedCategory = ({
  open,
  onClose,
  onSuccess,
  editIndex = null
}) => {
  const theme = useTheme()
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    link: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  const imageInputRef = useRef(null)

  useEffect(() => {
    if (open) {
      fetchCategoriesWithProducts()
      if (editIndex !== null) {
        fetchFeaturedCategories()
      }
      setError('')
      setSuccess('')
      setValidationErrors([])
    }
  }, [open, editIndex])

  const fetchCategoriesWithProducts = async () => {
    setLoadingCategories(true)
    try {
      const categories = await getCategoriesWithProducts()
      setCategoriesWithProducts(categories)
    } catch (error) {
      console.error('Error fetching categories with products:', error)
      setError('Không thể tải danh sách danh mục')
    } finally {
      setLoadingCategories(false)
    }
  }

  const fetchFeaturedCategories = async () => {
    setFetching(true)
    try {
      const featuredCategories = await getFeaturedCategories()
      if (featuredCategories[editIndex]) {
        const category = featuredCategories[editIndex]
        setForm({
          name: category.name || '',
          imageUrl: category.imageUrl || '',
          link: category.link || ''
        })
        setImagePreview(category.imageUrl || '')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    clearMessages()
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, WebP)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      // Create preview
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file)

      // Update form
      setForm((prev) => ({
        ...prev,
        imageUrl
      }))

      setSuccess('Upload hình ảnh thành công!')
    } catch (error) {
      setError('Không thể upload hình ảnh. Vui lòng thử lại.')
      console.error('Upload error:', error)
    } finally {
      setUploadingImage(false)
    }

    // Reset input
    event.target.value = ''
  }

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      imageUrl: ''
    }))
    setImagePreview('')
    clearMessages()
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
    setValidationErrors([])
  }

  // Validation function
  const validateForm = () => {
    const errors = []

    if (!form.name.trim()) {
      errors.push('Tên danh mục là bắt buộc')
    }

    if (!form.imageUrl) {
      errors.push('Hình ảnh danh mục là bắt buộc')
    }

    if (!form.link.trim()) {
      errors.push('Link danh mục là bắt buộc')
    } else if (!form.link.startsWith('category/')) {
      errors.push('Link phải bắt đầu bằng "category/"')
    }

    setValidationErrors(errors)
    return errors
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate form
      const errors = validateForm()
      if (errors.length > 0) {
        setError(errors.join(', '))
        setLoading(false)
        return
      }

      let result
      if (editIndex !== null) {
        // Update existing featured category
        result = await updateFeaturedCategory(editIndex, form)
      } else {
        // Add new featured category
        result = await addFeaturedCategory(form)
      }

      if (result) {
        setSuccess(
          editIndex !== null
            ? 'Cập nhật danh mục nổi bật thành công!'
            : 'Thêm danh mục nổi bật thành công!'
        )
        if (onSuccess) onSuccess(result)

        // Close modal after saving
        setTimeout(() => {
          setLoading(false)
          onClose()
        }, 1500)
      } else {
        setLoading(false)
      }
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi lưu danh mục')
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ name: '', imageUrl: '', link: '' })
    setImagePreview('')
    setCategoriesWithProducts([])
    setError('')
    setSuccess('')
    setValidationErrors([])
    onClose()
  }

  const isEditMode = editIndex !== null
  const title = isEditMode
    ? 'Chỉnh sửa danh mục nổi bật'
    : 'Thêm danh mục nổi bật'

  const handleCategorySelect = (event, selectedCategory) => {
    if (selectedCategory) {
      setForm((prev) => ({
        ...prev,
        name: selectedCategory.name,
        link: `category/${selectedCategory.slug}`
      }))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 700, color: '#1e293b' }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Error Alert */}
            {error && (
              <Alert severity='error' onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert severity='success' onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert severity='error'>
                <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                  Vui lòng sửa các lỗi sau:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {validationErrors.map((error, index) => (
                    <li key={index}>
                      <Typography variant='body2'>{error}</Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Form Fields */}
            <Autocomplete
              options={categoriesWithProducts}
              getOptionLabel={(option) =>
                `${option.name} (${option.productCount} sản phẩm)`
              }
              onChange={handleCategorySelect}
              loading={loadingCategories}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  placeholder='Tìm kiếm danh mục có sản phẩm...'
                  helperText='Chọn danh mục để tự động điền tên và link'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  <Box>
                    <Typography variant='body1'>{option.name}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {option.productCount} sản phẩm • Link: category/
                      {option.slug}
                    </Typography>
                  </Box>
                </Box>
              )}
            />

            <TextField
              label='Tên danh mục'
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
              required
              placeholder='Tên sẽ được tự động điền khi chọn danh mục'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              label='Link danh mục'
              value={form.link}
              onChange={(e) => handleChange('link', e.target.value)}
              fullWidth
              placeholder='Link sẽ được tự động điền khi chọn danh mục'
              helperText='Link sẽ được sử dụng khi người dùng click vào danh mục'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* Image Upload Section */}
            <Box>
              <Typography
                variant='subtitle1'
                sx={{ fontWeight: 600, mb: 2, color: '#374151' }}
              >
                Hình ảnh danh mục
              </Typography>

              <Card
                sx={{
                  border: '2px dashed #d1d5db',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    backgroundColor: '#f0f9ff'
                  }
                }}
              >
                {imagePreview ? (
                  <Box>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={optimizeCloudinaryUrl(imagePreview, {
                          width: 200,
                          height: 150
                        })}
                        alt='Preview'
                        style={{
                          width: 200,
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Tooltip title='Xóa hình ảnh'>
                        <IconButton
                          onClick={handleRemoveImage}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: '#ef4444',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#dc2626'
                            }
                          }}
                          size='small'
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Hình ảnh đã được tải lên
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 3,
                      cursor: 'pointer'
                    }}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <CloudUploadIcon
                      sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }}
                    />
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mb: 1 }}
                    >
                      {uploadingImage
                        ? 'Đang tải lên...'
                        : 'Nhấp để tải hình ảnh'}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      JPG, PNG, WebP (tối đa 5MB)
                    </Typography>
                    {uploadingImage && (
                      <CircularProgress size={24} sx={{ mt: 1 }} />
                    )}
                  </Box>
                )}
              </Card>

              <input
                ref={imageInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant='outlined'
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant='contained'
          disabled={loading || uploadingImage}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            background: 'var(--primary-color)',
            '&:hover': {
              background: 'var(--accent-color)'
            }
          }}
        >
          {loading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFeaturedCategory

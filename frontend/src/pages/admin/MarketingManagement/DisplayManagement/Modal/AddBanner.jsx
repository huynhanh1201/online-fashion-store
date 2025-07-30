import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Card,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material'
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material'
import {
  addBanner,
  updateBanner
} from '~/services/admin/webConfig/bannerService.js'
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

const AddBanner = ({ open, onClose, onSuccess, initialData, bannerIndex }) => {
  const theme = useTheme()
  const [form, setForm] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    link: '',
    position: 'hero',
    visible: true,
    startDate: '',
    endDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const imageInputRef = useRef(null)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({ ...initialData })
        setImagePreview(initialData.imageUrl || '')
      } else {
        setForm({
          imageUrl: '',
          title: '',
          subtitle: '',
          link: '',
          position: 'hero',
          visible: true,
          startDate: '',
          endDate: ''
        })
        setImagePreview('')
      }
      setError('')
      setSuccess('')
    }
  }, [open, initialData])

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
      setForm((prev) => ({ ...prev, imageUrl }))

      setSuccess('Upload ảnh thành công!')
    } catch (error) {
      setError('Không thể upload ảnh. Vui lòng thử lại.')
      console.error('Upload error:', error)
    } finally {
      setUploadingImage(false)
    }

    // Reset input
    event.target.value = ''
  }

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: '' }))
    setImagePreview('')
    clearMessages()
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    const errors = []

    if (!form.imageUrl?.trim()) {
      errors.push('Đường dẫn ảnh không được để trống')
    }

    if (!form.title?.trim()) {
      errors.push('Tiêu đề không được để trống')
    }

    // Validate dates if both are provided
    if (form.startDate && form.endDate) {
      if (new Date(form.startDate) > new Date(form.endDate)) {
        errors.push('Ngày bắt đầu không được sau ngày kết thúc')
      }
    }

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
        setLoading(false) // Cho phép nhập lại nếu lỗi
        return
      }

      let result
      if (initialData && bannerIndex !== undefined) {
        // Update existing banner
        result = await updateBanner(bannerIndex, form)
      } else {
        // Add new banner
        result = await addBanner(form)
      }

      if (result) {
        setSuccess(
          initialData
            ? 'Cập nhật banner thành công!'
            : 'Thêm banner thành công!'
        )
        if (onSuccess) onSuccess(result)

        // Đóng modal sau khi lưu
        setTimeout(() => {
          setLoading(false) // Enable lại khi modal đóng
          onClose()
        }, 1500)
      } else {
        setLoading(false)
      }
    } catch (error) {
      setError(error.message)
      setLoading(false) // Cho phép nhập lại khi lỗi
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#1e293b'
        }}
      >
        {initialData ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f8fafc', py: 3 }}>
        {error && (
          <Alert
            severity='error'
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity='success'
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.success.main, 0.08),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
            }}
          >
            {success}
          </Alert>
        )}

        {/* Image Upload Section - Full Width */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant='h6'
            sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}
          >
            Hình ảnh Banner
          </Typography>

          {imagePreview ? (
            <Card
              sx={{
                position: 'relative',
                width: '100%',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            >
              <CardMedia
                component='img'
                height='300'
                image={optimizeCloudinaryUrl(imagePreview, {
                  width: 900,
                  height: 300
                })}
                alt='Banner preview'
                sx={{ objectFit: 'cover', width: '100%' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 1
                }}
              >
                <Tooltip title='Xóa ảnh'>
                  <IconButton
                    size='small'
                    onClick={handleRemoveImage}
                    sx={{
                      color: '#ef4444',
                      '&:hover': { backgroundColor: '#fee2e2' }
                    }}
                  >
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 200,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
              onClick={() => imageInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
              <Typography
                variant='body1'
                sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}
              >
                Click để upload ảnh banner
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ textAlign: 'center' }}
              >
                JPG, PNG, WebP • Tối đa 5MB
              </Typography>
            </Box>
          )}

          {uploadingImage && (
            <Stack
              direction='row'
              alignItems='center'
              spacing={1}
              sx={{ mt: 2 }}
            >
              <CircularProgress size={20} sx={{ color: '#3b82f6' }} />
              <Typography variant='body2' sx={{ color: '#1e293b' }}>
                Đang upload...
              </Typography>
            </Stack>
          )}

          <input
            ref={imageInputRef}
            type='file'
            accept='image/jpeg,image/png,image/webp'
            hidden
            onChange={handleImageUpload}
          />
        </Box>

        {/* Form Fields Section - Full Width */}
        <Box>
          <Typography
            variant='h6'
            sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}
          >
            Thông tin Banner
          </Typography>

          <Stack spacing={3}>
            {/* Title */}
            <TextField
              label='Tiêu đề *'
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              fullWidth
              required
              placeholder='Nhập tiêu đề banner'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff'
                }
              }}
            />

            {/* Subtitle */}
            <TextField
              label='Phụ đề'
              value={form.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              fullWidth
              placeholder='Nhập phụ đề (không bắt buộc)'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff'
                }
              }}
            />

            {/* Link */}
            <TextField
              label='Link điều hướng'
              value={form.link}
              onChange={(e) => handleChange('link', e.target.value)}
              fullWidth
              placeholder='/khuyen-mai/summer'
              helperText='URL mà người dùng sẽ được chuyển đến khi click vào banner (không bắt buộc)'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff'
                }
              }}
            />

            {/* Position */}
            <TextField
              select
              label='Vị trí hiển thị'
              value={form.position}
              onChange={(e) => handleChange('position', e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff'
                }
              }}
            >
              <MenuItem value='hero'>Banner chính (Trang chủ)</MenuItem>
              <MenuItem value='product'>Banner sản phẩm</MenuItem>
              <MenuItem value='middle'>Banner giữa trang</MenuItem>
              <MenuItem value='login'>Banner đăng nhập và đăng ký</MenuItem>
            </TextField>

            {/* Visibility */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.visible}
                  onChange={(e) => handleChange('visible', e.target.checked)}
                  sx={{
                    color: '#3b82f6',
                    '&.Mui-checked': {
                      color: '#3b82f6'
                    }
                  }}
                />
              }
              label='Hiển thị banner'
            />

            {/* Date Range */}
            <Box>
              <Typography
                variant='subtitle2'
                sx={{ mb: 2, fontWeight: 600, color: '#374151' }}
              >
                Thời gian hiển thị (không bắt buộc)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type='date'
                    label='Ngày bắt đầu'
                    value={form.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#fff'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type='date'
                    label='Ngày kết thúc'
                    value={form.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#fff'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: '#64748b',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[500], 0.08)
            }
          }}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={loading || uploadingImage}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            px: 3,
            py: 1,
            background: 'var(--primary-color)',
            '&:hover': {
              background: 'var(--accent-color)'
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)',
              color: '#fff'
            }
          }}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBanner

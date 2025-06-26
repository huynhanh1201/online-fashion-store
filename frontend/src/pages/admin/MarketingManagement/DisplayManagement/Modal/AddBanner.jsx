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
import { addBanner, updateBanner } from '~/services/admin/webConfig/bannerService.js'
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

    if (!form.link?.trim()) {
      errors.push('Link điều hướng không được để trống')
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
        setLoading(false)
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
        setSuccess(initialData ? 'Cập nhật banner thành công!' : 'Thêm banner thành công!')
        if (onSuccess) onSuccess(result)
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
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
          border: '1px solid #e2e8f0'
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
            severity="error" 
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
            severity="success" 
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

        {/* Upload/Preview Banner Image - chiếm toàn bộ chiều ngang */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
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
                component="img"
                height="240"
                image={optimizeCloudinaryUrl(imagePreview, { width: 900, height: 240 })}
                alt="Banner preview"
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
                <Tooltip title="Xóa ảnh">
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      color: '#ef4444',
                      '&:hover': { backgroundColor: '#fee2e2' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          ) : (
            <Box
              sx={{
                width: '100%',
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
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
              <CloudUploadIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600 }}>
                Click để upload ảnh banner
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPG, PNG, WebP (tối đa 5MB)
              </Typography>
            </Box>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleImageUpload}
          />
          {uploadingImage && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
              <CircularProgress size={20} sx={{ color: '#3b82f6' }} />
              <Typography variant="body2" sx={{ color: '#1e293b' }}>
                Đang upload...
              </Typography>
            </Stack>
          )}
        </Box>

        {/* Form nhập */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Tiêu đề *'
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  fullWidth
                  required
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
                  label='Phụ đề'
                  value={form.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Link điều hướng *'
                  value={form.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                  fullWidth
                  required
                  placeholder="/khuyen-mai/summer"
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
                  <MenuItem value='hero'>Ảnh chính ở trang chủ ( Banner )</MenuItem>
                  <MenuItem value='product'>Ảnh trang sản phẩm ( Product )</MenuItem>
                  <MenuItem value='middle'>Ảnh giữa trang ( Middle )</MenuItem>
                  <MenuItem value='top'>Top (Đầu trang)</MenuItem>
                  <MenuItem value='bottom'>Bottom (Cuối trang)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  sx={{ mt: 2 }}
                />
              </Grid>
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
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
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
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
  Tooltip,
  useTheme
} from '@mui/material'
import { 
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import {
  getServiceHighlights,
  addServiceHighlight,
  updateServiceHighlight,
  validateServiceHighlightContent
} from '~/services/admin/webConfig/highlightedService.js'
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

const AddServiceHighlight = ({ open, onClose, onSuccess, editIndex = null }) => {
  const theme = useTheme()
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  
  const imageInputRef = useRef(null)

  useEffect(() => {
    if (open) {
      if (editIndex !== null) {
        fetchServiceHighlights()
      }
      setError('')
      setSuccess('')
      setValidationErrors([])
    }
  }, [open, editIndex])

  const fetchServiceHighlights = async () => {
    setFetching(true)
    try {
      const serviceHighlights = await getServiceHighlights()
      if (serviceHighlights[editIndex]) {
        const service = serviceHighlights[editIndex]
        setForm({
          title: service.title || '',
          subtitle: service.subtitle || '',
          imageUrl: service.imageUrl || ''
        })
        setImagePreview(service.imageUrl || '')
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

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setValidationErrors([])

    try {
      // Validate form
      const errors = validateServiceHighlightContent([form])
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }

      let result
      if (editIndex !== null) {
        // Update existing service highlight
        result = await updateServiceHighlight(editIndex, form)
      } else {
        // Add new service highlight
        result = await addServiceHighlight(form)
      }

      setSuccess(editIndex !== null ? 'Cập nhật thành công!' : 'Thêm thành công!')
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess(result)
        handleClose()
      }, 1000)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ title: '', subtitle: '', imageUrl: '' })
    setImagePreview('')
    setError('')
    setSuccess('')
    setValidationErrors([])
    onClose()
  }

  const isEditMode = editIndex !== null
  const title = isEditMode ? 'Chỉnh sửa dịch vụ nổi bật' : 'Thêm dịch vụ nổi bật'

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose} size="small">
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
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert severity="success" onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert severity="error">
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Vui lòng sửa các lỗi sau:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {validationErrors.map((error, index) => (
                    <li key={index}>
                      <Typography variant="body2">{error}</Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Form Fields */}
            <TextField
              label="Tiêu đề dịch vụ"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              fullWidth
              required
              placeholder="Nhập tiêu đề dịch vụ (ví dụ: Miễn phí vận chuyển)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              label="Mô tả dịch vụ"
              value={form.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              fullWidth
              required
              placeholder="Nhập mô tả dịch vụ (ví dụ: Đơn hàng trên 500K)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* Image Upload Section */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                Icon dịch vụ
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
                        src={optimizeCloudinaryUrl(imagePreview, { width: 100, height: 100 })}
                        alt="Preview"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'contain',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Tooltip title="Xóa hình ảnh">
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
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Icon đã được tải lên
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
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {uploadingImage ? 'Đang tải lên...' : 'Nhấp để tải icon'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
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
                type="file"
                accept="image/*"
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
          variant="outlined"
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
          variant="contained"
          disabled={loading || uploadingImage}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            background: 'var(--primary-color)',
            '&:hover': {
              background: 'var(--accent-color)'
            }
          }}
        >
          {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddServiceHighlight 
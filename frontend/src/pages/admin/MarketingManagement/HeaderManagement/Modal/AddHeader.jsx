import React, { useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  FormGroup,
  Alert,
  CircularProgress,
  IconButton,
  Typography,
  Box,
  Card,
  CardMedia,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material'
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material'
import {
  getHeaderConfig,
  updateHeaderConfig,
  validateHeaderContent,
  saveHeaderConfig
} from '~/services/admin/webConfig/headerService.js'
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

const AddHeader = ({ open, onClose, onSuccess }) => {
  const theme = useTheme()
  const [form, setForm] = useState({
    logo: { imageUrl: '', alt: '' },
    topBanner: []
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoPreview, setLogoPreview] = useState('')

  const logoInputRef = useRef(null)

  useEffect(() => {
    if (open) {
      fetchHeader()
      setError('')
      setSuccess('')
      setValidationErrors([])
    }
  }, [open])

  const fetchHeader = async () => {
    setFetching(true)
    try {
      const header = await getHeaderConfig()
      if (header?.content) {
        setForm(header.content)
        setLogoPreview(header.content.logo?.imageUrl || '')
      } else {
        // Initialize with default structure if no header config exists
        setForm({
          logo: { imageUrl: '', alt: '' },
          topBanner: []
        })
        setLogoPreview('')
      }
    } catch (error) {
      setError(error.message)
      // Initialize with default structure on error
      setForm({
        logo: { imageUrl: '', alt: '' },
        topBanner: []
      })
      setLogoPreview('')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    clearMessages()
  }

  const handleLogoAltChange = (value) => {
    setForm((prev) => ({
      ...prev,
      logo: { ...prev.logo, alt: value }
    }))
    clearMessages()
  }

  const handleBannerChange = (index, field, value) => {
    const updated = [...form.topBanner]
    updated[index][field] = value
    setForm((prev) => ({ ...prev, topBanner: updated }))
    clearMessages()
  }

  const handleAddBanner = () => {
    setForm((prev) => ({
      ...prev,
      topBanner: [...prev.topBanner, { visible: true, text: '' }]
    }))
    clearMessages()
  }

  const handleDeleteBanner = (index) => {
    setForm((prev) => ({
      ...prev,
      topBanner: prev.topBanner.filter((_, i) => i !== index)
    }))
    clearMessages()
  }

  const handleLogoUpload = async (event) => {
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

    setUploadingLogo(true)
    setError('')

    try {
      // Create preview
      const preview = URL.createObjectURL(file)
      setLogoPreview(preview)

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file)

      // Update form
      setForm((prev) => ({
        ...prev,
        logo: { ...prev.logo, imageUrl }
      }))

      setSuccess('Upload logo thành công!')
    } catch (error) {
      setError('Không thể upload logo. Vui lòng thử lại.')
      console.error('Upload error:', error)
    } finally {
      setUploadingLogo(false)
    }

    // Reset input
    event.target.value = ''
  }

  const handleRemoveLogo = () => {
    setForm((prev) => ({
      ...prev,
      logo: { ...prev.logo, imageUrl: '' }
    }))
    setLogoPreview('')
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
      const errors = validateHeaderContent(form)
      if (errors.length > 0) {
        setValidationErrors(errors)
        setLoading(false)
        return
      }

      const result = await saveHeaderConfig(form)
      if (result) {
        setSuccess('Lưu cấu hình header thành công!')
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
      fullWidth
      maxWidth='md'
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
          py: 1.5,
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#1e293b'
        }}
      >
        Cấu hình Header Website
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          backgroundColor: '#f8fafc',
          py: 2,
          maxHeight: 'calc(90vh - 140px)',
          overflowY: 'auto'
        }}
      >
        {fetching && (
          <Stack alignItems='center' py={4}>
            <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
            <Typography variant='body2' sx={{ mt: 2, color: '#1e293b' }}>
              Đang tải cấu hình...
            </Typography>
          </Stack>
        )}

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

        {validationErrors.length > 0 && (
          <Alert
            severity='warning'
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.warning.main, 0.08),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
            }}
          >
            <Typography variant='body2' component='div'>
              {validationErrors.map((err, index) => (
                <div key={index}>• {err}</div>
              ))}
            </Typography>
          </Alert>
        )}

        {!fetching && (
          <Stack spacing={2}>
            {/* Logo Section */}
            <Box>
              <Typography
                variant='h6'
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1rem'
                }}
              >
                <CloudUploadIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                Logo
              </Typography>

              <Stack spacing={1.5}>
                {/* Logo Upload Area */}
                <Box>
                  {logoPreview ? (
                    <Box
                      sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
                    >
                      <Card
                        sx={{
                          position: 'relative',
                          maxWidth: 200,
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
                          height='80'
                          image={optimizeCloudinaryUrl(logoPreview, {
                            width: 200,
                            height: 80
                          })}
                          alt='Logo preview'
                          sx={{ objectFit: 'contain' }}
                        />
                      </Card>
                      <Tooltip title='Xóa logo'>
                        <IconButton
                          size='small'
                          onClick={handleRemoveLogo}
                          sx={{
                            color: '#ef4444',
                            backgroundColor: '#fee2e2',
                            mt: 0.5,
                            '&:hover': {
                              backgroundColor: '#fecaca',
                              color: '#dc2626'
                            }
                          }}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.04
                          )
                        }
                      }}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <CloudUploadIcon
                        sx={{ fontSize: 36, color: '#3b82f6', mb: 1 }}
                      />
                      <Typography
                        variant='body2'
                        sx={{ color: '#1e293b', fontWeight: 600 }}
                      >
                        Click để upload logo
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        JPG, PNG, WebP (tối đa 5MB)
                      </Typography>
                    </Box>
                  )}

                  <input
                    ref={logoInputRef}
                    type='file'
                    accept='image/jpeg,image/png,image/webp'
                    hidden
                    onChange={handleLogoUpload}
                  />

                  {uploadingLogo && (
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
                </Box>

                {/* Logo Alt Text */}
                <TextField
                  label={
                    form.logo.imageUrl
                      ? 'Logo alt text *'
                      : 'Logo alt text (tùy chọn)'
                  }
                  value={form.logo.alt}
                  fullWidth
                  required={!!form.logo.imageUrl}
                  error={validationErrors.some((err) =>
                    err.includes('Logo alt')
                  )}
                  onChange={(e) => handleLogoAltChange(e.target.value)}
                  disabled={!form.logo.imageUrl}
                  helperText={
                    !form.logo.imageUrl
                      ? 'Vui lòng upload logo trước khi nhập alt text'
                      : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff'
                    }
                  }}
                />
              </Stack>
            </Box>

            {/* Top Banners Section */}
            <Box>
              <Typography
                variant='h6'
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1rem'
                }}
              >
                <CloudUploadIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                Top Banners
              </Typography>

              <Box
                sx={{
                  maxHeight: 200,
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f5f9',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#cbd5e1',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#94a3b8'
                    }
                  }
                }}
              >
                <FormGroup>
                  {form.topBanner.map((banner, index) => (
                    <Card
                      key={index}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={banner.visible}
                              onChange={(e) =>
                                handleBannerChange(
                                  index,
                                  'visible',
                                  e.target.checked
                                )
                              }
                              sx={{
                                color: '#3b82f6',
                                '&.Mui-checked': {
                                  color: '#3b82f6'
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant='body2'
                              sx={{ color: '#1e293b', fontWeight: 500 }}
                            >
                              Hiển thị Banner {index + 1}
                            </Typography>
                          }
                        />
                        <TextField
                          label={`Nội dung Banner ${index + 1}`}
                          value={banner.text}
                          fullWidth
                          error={validationErrors.some((err) =>
                            err.includes(`Banner ${index + 1}`)
                          )}
                          onChange={(e) =>
                            handleBannerChange(index, 'text', e.target.value)
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                        <Tooltip title='Xóa banner'>
                          <IconButton
                            onClick={() => handleDeleteBanner(index)}
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: '#fee2e2' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Card>
                  ))}
                </FormGroup>
              </Box>
              <Button
                onClick={handleAddBanner}
                variant='outlined'
                startIcon={<CloudUploadIcon />}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#3b82f6',
                  borderColor: '#3b82f6',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: '#2563eb'
                  }
                }}
              >
                Thêm Banner
              </Button>
            </Box>
          </Stack>
        )}
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
          disabled={loading || fetching || uploadingLogo}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            px: 3,
            py: 1,
            background: 'var(--primary-color)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'var(--accent-color)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)',
              color: '#fff'
            }
          }}
        >
          {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddHeader

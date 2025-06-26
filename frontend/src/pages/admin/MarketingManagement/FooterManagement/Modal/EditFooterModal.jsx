import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Typography,
  Box,
  Card,
  Tooltip,
  CircularProgress
} from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon, AddPhotoAlternate, CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { getFooterConfig, updateFooterConfig } from '~/services/admin/webConfig/footerService.js'
import { uploadImageToCloudinary } from '~/utils/cloudinary.js'
import { CLOUD_FOLDER } from '~/utils/constants.js'

const defaultAbout = { phone: '', email: '' }
const defaultMenuColumn = { title: '', subtitle: '', text: '', items: [], link: '' }
const defaultSocialLink = { name: '', image: '', link: '' }
const defaultStore = { name: '', address: '' }

const EditFooterModal = ({ open, onClose, onSuccess, initialData, footerIndex }) => {
  const [logo, setLogo] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState('')
  const [about, setAbout] = useState([defaultAbout])
  const [menuColumns, setMenuColumns] = useState([defaultMenuColumn])
  const [socialLinks, setSocialLinks] = useState([defaultSocialLink])
  const [stores, setStores] = useState([defaultStore])
  const [status, setStatus] = useState('Đang sử dụng')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [socialIconLoadingIndex, setSocialIconLoadingIndex] = useState(-1)
  const logoInputRef = React.useRef(null)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setLogo(initialData.logo || '')
      setLogoPreview(initialData.logo || '')
      setAbout(initialData.about?.length ? initialData.about : [defaultAbout])
      setMenuColumns(initialData.menuColumns?.length ? initialData.menuColumns : [defaultMenuColumn])
      setSocialLinks(initialData.socialLinks?.length ? initialData.socialLinks : [defaultSocialLink])
      setStores(initialData.stores?.length ? initialData.stores : [defaultStore])
      setStatus(initialData.status || 'Đang sử dụng')
    }
  }, [initialData])

  // Handlers for about, menu, social, stores, logo (copied from AddFooterModal)
  const handleAddAbout = () => setAbout([...about, { ...defaultAbout, id: `temp-${Date.now()}` }])
  const handleRemoveAbout = (idx) => setAbout(about.filter((_, i) => i !== idx))
  const handleAboutChange = (idx, field, value) => {
    const newAbout = [...about]
    newAbout[idx][field] = value
    setAbout(newAbout)
  }

  const handleAddMenuColumn = () => setMenuColumns([...menuColumns, { ...defaultMenuColumn }])
  const handleRemoveMenuColumn = (idx) => setMenuColumns(menuColumns.filter((_, i) => i !== idx))
  const handleMenuColumnChange = (idx, field, value) => {
    const newMenu = [...menuColumns]
    newMenu[idx][field] = value
    setMenuColumns(newMenu)
  }

  const handleAddSocialLink = () => setSocialLinks([...socialLinks, { ...defaultSocialLink, id: `temp-${Date.now()}` }])
  const handleRemoveSocialLink = (idx) => setSocialLinks(socialLinks.filter((_, i) => i !== idx))
  const handleSocialLinkChange = (idx, field, value) => {
    const newSocial = [...socialLinks]
    newSocial[idx][field] = value
    setSocialLinks(newSocial)
  }
  
  const handleAddStore = () => setStores([...stores, { ...defaultStore, id: `temp-${Date.now()}` }])
  const handleRemoveStore = (idx) => setStores(stores.filter((_, i) => i !== idx))
  const handleStoreChange = (idx, field, value) => {
    const newStores = [...stores]
    newStores[idx][field] = value
    setStores(newStores)
  }

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    setError('')
    try {
      const preview = URL.createObjectURL(file)
      setLogoPreview(preview)
      const res = await uploadImageToCloudinary(file, CLOUD_FOLDER)
      if (res.success) setLogo(res.url)
      else setError('Upload failed')
    } catch (e) {
      setError('Upload error')
    } finally {
      setLogoUploading(false)
    }
    event.target.value = ''
  }

  const handleRemoveLogo = () => {
    setLogo('')
    setLogoPreview('')
  }
  
  const handleSocialIconUpload = async (event, index) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSocialIconLoadingIndex(index)
    try {
      const res = await uploadImageToCloudinary(file, CLOUD_FOLDER)
      if (res.success) {
        const newSocialLinks = [...socialLinks]
        newSocialLinks[index].image = res.url
        setSocialLinks(newSocialLinks)
      } else {
        setError('Upload failed')
      }
    } catch (e) {
      setError('Upload error')
    } finally {
      setSocialIconLoadingIndex(-1)
    }
    event.target.value = ''
  }

  function validate() {
    const errors = {}
    // Logo
    if (!logo) errors.logo = 'Logo không được để trống.'
    // About
    about.forEach((a, i) => {
      if (!a.phone) errors[`about_phone_${i}`] = 'Số điện thoại không được để trống.'
      if (!a.email) errors[`about_email_${i}`] = 'Email không được để trống.'
      else if (!/^\S+@\S+\.\S+$/.test(a.email)) errors[`about_email_${i}`] = 'Email không hợp lệ.'
    })
    // Menu
    menuColumns.forEach((m, i) => {
      if (!m.title) errors[`menu_title_${i}`] = 'Tiêu đề menu không được để trống.'
      if (!m.link) errors[`menu_link_${i}`] = 'Link menu không được để trống.'
    })
    // Store
    stores.forEach((s, i) => {
      if (!s.name) errors[`store_name_${i}`] = 'Tên cửa hàng không được để trống.'
      if (!s.address) errors[`store_address_${i}`] = 'Địa chỉ cửa hàng không được để trống.'
    })
    // Social
    socialLinks.forEach((s, i) => {
      if (!s.name) errors[`social_name_${i}`] = 'Tên mạng xã hội không được để trống.'
      if (!s.image) errors[`social_image_${i}`] = 'Icon không được để trống.'
      if (!s.link) errors[`social_link_${i}`] = 'Link không được để trống.'
      else if (!/^https?:\/\//.test(s.link)) errors[`social_link_${i}`] = 'Link phải bắt đầu bằng http(s)://'
    })
    return errors
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setFieldErrors({})
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setLoading(false)
      setError('Vui lòng kiểm tra lại các trường nhập liệu.')
      return
    }
    try {
      const currentConfig = await getFooterConfig()
      if (!currentConfig) {
        setError('Không tìm thấy cấu hình footer hiện tại để cập nhật.')
        setLoading(false)
        return
      }
      const newContent = [...(currentConfig.content || [])]
      const updatedEntry = {
        ...initialData,
        logo,
        about,
        menuColumns,
        stores,
        socialLinks,
        status
      }
      newContent[footerIndex] = updatedEntry
      await updateFooterConfig(newContent)
      if (onSuccess) onSuccess()
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth sx={{ zIndex: 1402, maxHeight: '90vh', mt: 6 }}>
      <DialogTitle>Chỉnh sửa nội dung chân trang</DialogTitle>
      <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {error && <Typography color='error' sx={{ mb: 2 }}>{error}</Typography>}
        <Stack spacing={3}>
          {/* Logo */}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>Logo</Typography>
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
                },
                minWidth: 180,
                minHeight: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {logo || logoPreview ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={logoPreview || logo}
                    alt='logo preview'
                    style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}
                  />
                  <Tooltip title='Xóa logo'>
                    <IconButton
                      onClick={handleRemoveLogo}
                      sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#ef4444', color: 'white', '&:hover': { backgroundColor: '#dc2626' } }}
                      size='small'
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, cursor: 'pointer' }}
                  onClick={() => logoInputRef.current?.click()}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    {logoUploading ? 'Đang tải lên...' : 'Nhấp để tải logo'}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    JPG, PNG, WebP (tối đa 5MB)
                  </Typography>
                  {logoUploading && (
                    <CircularProgress size={24} sx={{ mt: 1 }} />
                  )}
                </Box>
              )}
              <input
                ref={logoInputRef}
                type='file'
                accept='image/*'
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </Card>
          </Box>

          {/* Giới thiệu */}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>Giới thiệu</Typography>
            <Stack spacing={2}>
              {about.map((a, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 4px #e0e7ef33' }}>
                  <Stack spacing={1} direction='row' alignItems='center'>
                    <TextField label='Số điện thoại' value={a.phone} onChange={e => handleAboutChange(idx, 'phone', e.target.value)} size='small' fullWidth error={!!fieldErrors[`about_phone_${idx}`]} helperText={fieldErrors[`about_phone_${idx}`]} />
                    <TextField label='Email' value={a.email} onChange={e => handleAboutChange(idx, 'email', e.target.value)} size='small' fullWidth error={!!fieldErrors[`about_email_${idx}`]} helperText={fieldErrors[`about_email_${idx}`]} />
                    {about.length > 1 && (
                      <IconButton onClick={() => handleRemoveAbout(idx)}><RemoveIcon /></IconButton>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} onClick={handleAddAbout} size='small' sx={{ mt: 2 }}>Thêm dòng giới thiệu</Button>
          </Box>

          {/* Menu */}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>Menu</Typography>
            <Stack spacing={2}>
              {menuColumns.map((m, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 4px #e0e7ef33' }}>
                  <Stack spacing={1}>
                    <TextField label='Tiêu đề' value={m.title} onChange={e => handleMenuColumnChange(idx, 'title', e.target.value)} size='small' fullWidth error={!!fieldErrors[`menu_title_${idx}`]} helperText={fieldErrors[`menu_title_${idx}`]} />
                    <TextField label='Phụ đề' value={m.subtitle} onChange={e => handleMenuColumnChange(idx, 'subtitle', e.target.value)} size='small' fullWidth error={!!fieldErrors[`menu_subtitle_${idx}`]} helperText={fieldErrors[`menu_subtitle_${idx}`]} />
                    <TextField label='Text' value={m.text} onChange={e => handleMenuColumnChange(idx, 'text', e.target.value)} size='small' fullWidth error={!!fieldErrors[`menu_text_${idx}`]} helperText={fieldErrors[`menu_text_${idx}`]} />
                    <TextField label='Link' value={m.link} onChange={e => handleMenuColumnChange(idx, 'link', e.target.value)} size='small' fullWidth error={!!fieldErrors[`menu_link_${idx}`]} helperText={fieldErrors[`menu_link_${idx}`]} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {menuColumns.length > 1 && (
                        <IconButton onClick={() => handleRemoveMenuColumn(idx)}><RemoveIcon /></IconButton>
                      )}
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} onClick={handleAddMenuColumn} size='small' sx={{ mt: 2 }}>Thêm menu</Button>
          </Box>

          {/* Mạng xã hội */}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>Mạng xã hội</Typography>
            <Stack spacing={2}>
              {socialLinks.map((s, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 4px #e0e7ef33' }}>
                  <Stack spacing={1} direction='row' alignItems='center'>
                    <TextField label='Tên mạng xã hội' value={s.name} onChange={e => handleSocialLinkChange(idx, 'name', e.target.value)} size='small' sx={{ minWidth: 120 }} error={!!fieldErrors[`social_name_${idx}`]} helperText={fieldErrors[`social_name_${idx}`]} />
                    <Box>
                      <input
                        accept="image/*,.svg"
                        style={{ display: 'none' }}
                        id={`social-icon-uploader-${idx}-edit`}
                        type="file"
                        onChange={(e) => handleSocialIconUpload(e, idx)}
                      />
                      <label htmlFor={`social-icon-uploader-${idx}-edit`}>
                        <Button component="span" variant="outlined" disabled={socialIconLoadingIndex === idx} sx={{ minWidth: 40, height: 40, p: 0, borderRadius: '50%' }}>
                          {socialIconLoadingIndex === idx ? (
                            <CircularProgress size={20} />
                          ) : s.image ? (
                            <img src={s.image} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            <AddPhotoAlternate />
                          )}
                        </Button>
                      </label>
                    </Box>
                    <TextField label='Link' value={s.link} onChange={e => handleSocialLinkChange(idx, 'link', e.target.value)} size='small' fullWidth error={!!fieldErrors[`social_link_${idx}`]} helperText={fieldErrors[`social_link_${idx}`]} />
                    {socialLinks.length > 1 && (
                      <IconButton onClick={() => handleRemoveSocialLink(idx)}><RemoveIcon /></IconButton>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} onClick={handleAddSocialLink} size='small' sx={{ mt: 2 }}>Thêm mạng xã hội</Button>
          </Box>

          {/* Địa chỉ cửa hàng */}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>Hệ thống cửa hàng</Typography>
            <Stack spacing={2}>
              {stores.map((s, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 4px #e0e7ef33' }}>
                  <Stack spacing={1} direction='row' alignItems='center'>
                    <TextField label='Tên cửa hàng' value={s.name} onChange={e => handleStoreChange(idx, 'name', e.target.value)} size='small' fullWidth error={!!fieldErrors[`store_name_${idx}`]} helperText={fieldErrors[`store_name_${idx}`]} />
                    <TextField label='Địa chỉ cửa hàng' value={s.address} onChange={e => handleStoreChange(idx, 'address', e.target.value)} size='small' fullWidth error={!!fieldErrors[`store_address_${idx}`]} helperText={fieldErrors[`store_address_${idx}`]} />
                    {stores.length > 1 && (
                      <IconButton onClick={() => handleRemoveStore(idx)}><RemoveIcon /></IconButton>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} onClick={handleAddStore} size='small' sx={{ mt: 2 }}>Thêm địa chỉ cửa hàng</Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditFooterModal

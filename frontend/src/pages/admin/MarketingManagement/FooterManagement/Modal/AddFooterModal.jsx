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
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon, AddPhotoAlternate, CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material'
import {
  getFooterConfig,
  createFooterConfig,
  updateFooterConfig
} from '~/services/admin/webConfig/footerService'
import { uploadImageToCloudinary } from '~/utils/cloudinary.js'
import { CLOUD_FOLDER } from '~/utils/constants.js'

const defaultAbout = { phone: '', email: '' }
const defaultSocialLink = { name: '', image: '', link: '' }
const defaultStore = { name: '', address: '' }
const defaultFanpageImage = '';

// Preview Component
const FooterPreview = ({ logo, about, socialLinks, stores, fanpageImage }) => {
  return (
    <Box sx={{ 
      bgcolor: 'var(--primary-color)', 
      color: 'white', 
      pt: 6, 
      pb: 3, 
      fontSize: 14,
      borderRadius: 2,
      minHeight: 400,
      fontFamily: 'Arial, sans-serif'
    }}>
    
      <Box sx={{ maxWidth: '1450px', mx: 'auto', px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 4,
            mb: 4,
            justifyItems: 'center',
            padding: '20px'
          }}
        >
          {/* Cột 1: Logo + Đăng ký nhận tin + Thông tin liên hệ */}
          <Box sx={{ flex: 1, minWidth: 220 }}>
            {logo && (
              <Box sx={{ mb: 1 }}>
                <img 
                  src={logo} 
                  alt='logo' 
                  style={{ 
                    width: 120, 
                    height: 'auto', 
                    borderRadius: 8, 
                    background: '#fff', 
                    padding: 4 
                  }} 
                />
              </Box>
            )}
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
              {about?.[0]?.phone ? `Hotline: ${about[0].phone}` : 'FASHIONSTORE'}
            </Typography>
            {about?.[0]?.email && (
              <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <span style={{ fontSize: 16, marginRight: 8 }}>✉️</span> {about[0].email}
              </Typography>
            )}
            <Typography sx={{ mb: 1, fontWeight: 500 }}>ĐĂNG KÝ NHẬN TIN</Typography>
            <Typography variant='caption'>Hãy là người đầu tiên nhận khuyến mãi lớn!</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Box
                sx={{ 
                  bgcolor: 'white', 
                  borderRadius: '4px', 
                  flex: 1,
                  px: 2,
                  py: 1,
                  fontSize: 15,
                  color: '#333'
                }}
              >
                Nhập địa chỉ email
              </Box>
              <Box
                sx={{ 
                  bgcolor: 'var(--primary-color)', 
                  color: 'white', 
                  width: '100px',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                ĐĂNG KÝ
              </Box>
            </Box>
          </Box>

          {/* Cột 3: Danh sách cửa hàng */}
          {stores?.length > 0 && (
            <Box sx={{ flex: 1.2, minWidth: 200 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                HỆ THỐNG CỬA HÀNG
              </Typography>
              {stores.map((store, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, marginRight: 8 }}>📍</span>
                    <strong>{store.name}</strong>
                  </Typography>
                  <Typography variant='body2' sx={{ ml: 3 }}>
                    {store.address}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Cột 4: Kết nối */}
          {(socialLinks?.length > 0 || fanpageImage) && (
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                KẾT NỐI VỚI CHÚNG TÔI
              </Typography>
              {fanpageImage && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'start' }}>
                  <img src={fanpageImage} alt='fanpage' style={{ width: 300, height: 'auto', borderRadius: 8, background: '#fff', padding: 4 }} />
                </Box>
              )}
              <Stack spacing={1}>
                {socialLinks.map((s, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12
                        }}
                      >
                        {s.name?.charAt(0) || 'S'}
                      </Box>
                    )}
                    <Typography variant='body2'>{s.name}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        <Typography variant='body2' align='center'>
          © Bản quyền thuộc về <strong>FASHIONSTORE</strong>
        </Typography>
      </Box>

      {/* Empty State */}
      {!logo && (!about || about.every(a => !a.phone && !a.email)) && 
       (!stores || stores.every(s => !s.name && !s.address)) && 
       (!socialLinks || socialLinks.every(s => !s.name && !s.image)) && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: '#9ca3af' 
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Chưa có nội dung
          </Typography>
          <Typography variant="body2">
            Hãy thêm thông tin để xem preview
          </Typography>
        </Box>
      )}
    </Box>
  )
}

const AddFooterModal = ({ open, onClose, onSuccess, footerConfig, mode = 'add', initialData = null, footerIndex = null }) => {
  const [logo, setLogo] = useState('')
  const [fanpageImage, setFanpageImage] = useState(defaultFanpageImage)
  const [fanpageImagePreview, setFanpageImagePreview] = useState('')
  const [fanpageImageUploading, setFanpageImageUploading] = useState(false)
  const fanpageImageInputRef = React.useRef(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState('')
  const [about, setAbout] = useState([defaultAbout])
  const [socialLinks, setSocialLinks] = useState([defaultSocialLink])
  const [status, setStatus] = useState('Đang sử dụng')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stores, setStores] = useState([defaultStore])
  const logoInputRef = React.useRef(null)
  const [socialIconLoadingIndex, setSocialIconLoadingIndex] = useState(-1)
  const [fieldErrors, setFieldErrors] = useState({})
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setLogo(initialData.logo || '')
      setLogoPreview(initialData.logo || '')
      setFanpageImage(initialData.fanpageImage || '')
      setFanpageImagePreview(initialData.fanpageImage || '')
      setAbout(initialData.about?.length ? initialData.about : [defaultAbout])
      setSocialLinks(initialData.socialLinks?.length ? initialData.socialLinks : [defaultSocialLink])
      setStores(initialData.stores?.length ? initialData.stores : [defaultStore])
      setStatus(initialData.status || 'Đang sử dụng')
    } else if (mode === 'add') {
      resetForm()
    }
  }, [mode, initialData, open])

  const resetForm = () => {
    setLogo('')
    setLogoPreview('')
    setLogoUploading(false)
    setFanpageImage('')
    setFanpageImagePreview('')
    setFanpageImageUploading(false)
    setAbout([defaultAbout])
    setSocialLinks([defaultSocialLink])
    setStores([defaultStore])
    setStatus('Đang sử dụng')
    setError('')
    setLoading(false)
    setActiveTab(0)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleAddAbout = () => setAbout([...about, defaultAbout])
  const handleRemoveAbout = (idx) => setAbout(about.filter((_, i) => i !== idx))
  const handleAboutChange = (idx, field, value) => {
    setAbout(about.map((a, i) => (i === idx ? { ...a, [field]: value } : a)))
  }

  const handleAddSocialLink = () => setSocialLinks([...socialLinks, { ...defaultSocialLink, id: `temp-${Date.now()}` }])
  const handleRemoveSocialLink = (idx) => setSocialLinks(socialLinks.filter((_, i) => i !== idx))
  const handleSocialLinkChange = (idx, field, value) => {
    setSocialLinks(socialLinks.map((s, i) => (i === idx ? { ...s, [field]: value } : s)))
  }

  const handleAddStore = () => setStores([...stores, defaultStore])
  const handleRemoveStore = (idx) => setStores(stores.filter((_, i) => i !== idx))
  const handleStoreChange = (idx, field, value) => {
    setStores(stores.map((s, i) => (i === idx ? { ...s, [field]: value } : s)))
  }

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]
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
    setLogoUploading(true)
    setError('')
    try {
      // Preview
      const preview = URL.createObjectURL(file)
      setLogoPreview(preview)
      // Upload (dùng preset và folder giống ServiceHighlight)
      const res = await uploadImageToCloudinary(file, CLOUD_FOLDER)
      if (res.success) setLogo(res.url)
      else setError('Không thể upload logo. Vui lòng thử lại.')
    } catch (e) {
      setError('Không thể upload logo. Vui lòng thử lại.')
    } finally {
      setLogoUploading(false)
    }
    event.target.value = ''
  }

  const handleRemoveLogo = () => {
    setLogo('')
    setLogoPreview('')
    setError('')
  }

  const handleSocialIconUpload = async (event, index) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSocialIconLoadingIndex(index)
    setError('')

    try {
      const res = await uploadImageToCloudinary(file, CLOUD_FOLDER)
      if (res.success) {
        const newSocialLinks = [...socialLinks]
        newSocialLinks[index].image = res.url
        setSocialLinks(newSocialLinks)
      } else {
        setError('Không thể upload icon. Vui lòng thử lại.')
      }
    } catch (e) {
      setError('Lỗi upload icon.')
    } finally {
      setSocialIconLoadingIndex(-1)
    }
    event.target.value = ''
  }

  const handleFanpageImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFanpageImageUploading(true)
    setError('')
    try {
      const preview = URL.createObjectURL(file)
      setFanpageImagePreview(preview)
      const res = await uploadImageToCloudinary(file, CLOUD_FOLDER)
      if (res.success) setFanpageImage(res.url)
      else setError('Upload failed')
    } catch (e) {
      setError('Upload error')
    } finally {
      setFanpageImageUploading(false)
    }
    event.target.value = ''
  }

  const handleRemoveFanpageImage = () => {
    setFanpageImage('')
    setFanpageImagePreview('')
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
      if (mode === 'edit') {
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
          fanpageImage,
          about,
          stores,
          socialLinks,
          status
        }
        newContent[footerIndex] = updatedEntry
        await updateFooterConfig(newContent)
      } else {
        const newEntry = {
          id: `footer_${Date.now()}`,
          logo,
          fanpageImage,
          about,
          stores,
          socialLinks,
          status
        }
        if (footerConfig?._id) {
          await updateFooterConfig([newEntry])
        } else {
          await createFooterConfig([newEntry])
        }
      }
      if (onSuccess) onSuccess()
      handleClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth sx={{ zIndex: 15000, maxHeight: '95vh', mt:5 }}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Thêm nội dung chân trang mới
        </Box>
      </DialogTitle>
      
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab 
          icon={<EditIcon />} 
          label="Chỉnh sửa" 
          iconPosition="start"
        />
        <Tab 
          icon={<VisibilityIcon />} 
          label="Xem trước" 
          iconPosition="start"
        />
      </Tabs>

      <DialogContent sx={{ maxHeight: '95vh', overflowY: 'auto', p: 0 }}>
        {error && (
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography color='error'>{error}</Typography>
          </Box>
        )}
        {activeTab === 0 && (
          <Box sx={{ p: { xs: 1, md: 4 } }}>
            {/* Section: Logo & Fanpage */}
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>Logo & Ảnh Fanpage</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems='flex-start' mb={3}>
              {/* Logo */}
              <Box flex={1}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>Logo</Typography>
                <Card
                  sx={{
                    border: '2px dashed #d1d5db',
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#f9fafb',
                    minWidth: 180,
                    minHeight: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                          onClick={() => { setLogo(''); setLogoPreview('') }}
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
              {/* Fanpage Image */}
              <Box flex={1}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>Ảnh Fanpage</Typography>
                <Card
                  sx={{
                    border: '2px dashed #d1d5db',
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#f9fafb',
                    minWidth: 180,
                    minHeight: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {fanpageImage || fanpageImagePreview ? (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={fanpageImagePreview || fanpageImage}
                        alt='fanpage preview'
                        style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}
                      />
                      <Tooltip title='Xóa ảnh fanpage'>
                        <IconButton
                          onClick={handleRemoveFanpageImage}
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
                      onClick={() => fanpageImageInputRef.current?.click()}
                    >
                      <CloudUploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        {fanpageImageUploading ? 'Đang tải lên...' : 'Nhấp để tải ảnh fanpage'}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        JPG, PNG, WebP (tối đa 5MB)
                      </Typography>
                      {fanpageImageUploading && (
                        <CircularProgress size={24} sx={{ mt: 1 }} />
                      )}
                    </Box>
                  )}
                  <input
                    ref={fanpageImageInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFanpageImageUpload}
                    style={{ display: 'none' }}
                  />
                </Card>
              </Box>
            </Stack>
            <Divider sx={{ my: 4 }} />
            {/* Section: About */}
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>Giới thiệu</Typography>
            <Stack spacing={2} mb={3}>
              {about.map((a, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 4px #e0e7ef33' }}>
                  <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems='center'>
                    <TextField label='Số điện thoại' value={a.phone} onChange={e => handleAboutChange(idx, 'phone', e.target.value)} size='small' fullWidth error={!!fieldErrors[`about_phone_${idx}`]} helperText={fieldErrors[`about_phone_${idx}`]} />
                    <TextField label='Email' value={a.email} onChange={e => handleAboutChange(idx, 'email', e.target.value)} size='small' fullWidth error={!!fieldErrors[`about_email_${idx}`]} helperText={fieldErrors[`about_email_${idx}`]} />
                    {about.length > 1 && (
                      <IconButton onClick={() => handleRemoveAbout(idx)}><RemoveIcon /></IconButton>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} onClick={handleAddAbout} size='small' sx={{ mt: 1, mb: 3, width: { xs: '100%', md: 'auto' } }}>Thêm dòng giới thiệu</Button>
            <Divider sx={{ my: 4 }} />
            {/* Section: Social Links */}
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>Mạng xã hội</Typography>
            <Stack spacing={2} mb={3}>
              {socialLinks.map((s, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 4px #e0e7ef33' }}>
                  <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems='center'>
                    <Box>
                      <input
                        accept="image/*,.svg"
                        style={{ display: 'none' }}
                        id={`social-icon-uploader-${idx}`}
                        type="file"
                        onChange={(e) => handleSocialIconUpload(e, idx)}
                      />
                      <label htmlFor={`social-icon-uploader-${idx}`}>
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
                    <TextField label='Tên mạng xã hội' value={s.name} onChange={e => handleSocialLinkChange(idx, 'name', e.target.value)} size='small' sx={{ minWidth: 120 }} error={!!fieldErrors[`social_name_${idx}`]} helperText={fieldErrors[`social_name_${idx}`]} fullWidth />
                    <TextField label='Link' value={s.link} onChange={e => handleSocialLinkChange(idx, 'link', e.target.value)} size='small' fullWidth error={!!fieldErrors[`social_link_${idx}`]} helperText={fieldErrors[`social_link_${idx}`]} />
                    {socialLinks.length > 1 && (
                      <IconButton onClick={() => handleRemoveSocialLink(idx)}><RemoveIcon /></IconButton>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} onClick={handleAddSocialLink} size='small' sx={{ mt: 1, mb: 3, width: { xs: '100%', md: 'auto' } }}>Thêm mạng xã hội</Button>
            <Divider sx={{ my: 4 }} />
            {/* Section: Stores */}
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>Hệ thống cửa hàng</Typography>
            <Stack spacing={2} mb={3}>
              {stores.map((s, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 1px 4px #e0e7ef33' }}>
                  <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems='center'>
                    <TextField label='Tên cửa hàng' value={s.name} onChange={e => handleStoreChange(idx, 'name', e.target.value)} size='small' fullWidth error={!!fieldErrors[`store_name_${idx}`]} helperText={fieldErrors[`store_name_${idx}`]} />
                    <TextField label='Địa chỉ cửa hàng' value={s.address} onChange={e => handleStoreChange(idx, 'address', e.target.value)} size='small' fullWidth error={!!fieldErrors[`store_address_${idx}`]} helperText={fieldErrors[`store_address_${idx}`]} />
                    {stores.length > 1 && (
                      <IconButton onClick={() => handleRemoveStore(idx)}><RemoveIcon /></IconButton>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} onClick={handleAddStore} size='small' sx={{ mt: 1, mb: 3, width: { xs: '100%', md: 'auto' } }}>Thêm địa chỉ cửa hàng</Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Xem trước Footer
            </Typography>
            <FooterPreview 
              logo={logo || logoPreview}
              about={about}
              socialLinks={socialLinks}
              stores={stores}
              fanpageImage={fanpageImage}
            />
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Mẹo:</strong> Chuyển về tab "Chỉnh sửa" để thay đổi nội dung và xem kết quả ngay tại đây
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFooterModal

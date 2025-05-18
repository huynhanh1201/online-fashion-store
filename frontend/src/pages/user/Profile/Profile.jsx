import React, { useState, useEffect } from 'react'
import {
  Box,
  Avatar,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material'
import UploadIcon from '@mui/icons-material/CloudUpload'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import ShippingAdress from './shippingAdress/shippingAdress'
import { getProfileUser, updateProfile } from '~/services/userService'

const CLOUDINARY_URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const UPLOAD_PRESET = 'demo_unsigned'
const CLOUD_FOLDER = 'user_avatar'

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', CLOUD_FOLDER)

  const res = await fetch(CLOUDINARY_URI, {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  return data.secure_url
}

const Profile = () => {
  const [tab, setTab] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const handleTabChange = (_, newValue) => {
    setTab(newValue)
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setAvatarFile(file)
      const blobUrl = URL.createObjectURL(file)
      setAvatarPreview(blobUrl)
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleUpdate = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      showSnackbar('Tên không được để trống!', 'error')
      return
    }
    if (trimmedName.length < 3) {
      showSnackbar('Tên phải có ít nhất 3 ký tự!', 'error')
      return
    }

    setLoading(true)
    const payload = { name: trimmedName }
    if (avatarFile) {
      const avatarUrl = await uploadToCloudinary(avatarFile)
      if (!avatarUrl) {
        showSnackbar('Không thể tải ảnh lên!', 'error')
        setLoading(false)
        return
      }
      payload.avatarUrl = avatarUrl
    }

    const result = await updateProfile(payload)
    setLoading(false)

    if (result && !result.error) {
      setName(result.name)
      setAvatarPreview(result.avatarUrl || '')
      setAvatarFile(null)
      showSnackbar('Cập nhật thành công!')
    } else {
      showSnackbar(
        `Cập nhật thất bại: ${result?.error?.message || 'Lỗi không xác định'}`,
        'error'
      )
      if (result?.error?.message.includes('avatarUrl')) {
        const retryResult = await updateProfile({ name: trimmedName })
        if (retryResult && !retryResult.error) {
          setName(retryResult.name)
          setAvatarPreview(retryResult.avatarUrl || '')
          setAvatarFile(null)
          showSnackbar('Cập nhật thành công (không bao gồm avatar)!')
        } else {
          showSnackbar(
            `Cập nhật thất bại: ${retryResult?.error?.message || 'Lỗi không xác định'}`,
            'error'
          )
        }
      }
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const profileData = await getProfileUser()
      if (profileData) {
        setName(profileData.name || 'Người dùng')
        setEmail(profileData.email || '')
        setAvatarPreview(profileData.avatarUrl || '')
      } else {
        showSnackbar('Không thể tải thông tin hồ sơ!', 'error')
        setName('Người dùng')
        setAvatarPreview('')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        p: 4,
        display: 'flex',
        gap: 4
      }}
    >
      {/* Sidebar bên trái */}
      <Paper
        elevation={3}
        sx={{
          width: 350,
          p: 3,
          borderRadius: 2,
          bgcolor: '#ffffff',
          height: 'fit-content'
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          orientation='vertical'
          sx={{ mb: 2 }}
          textColor='primary'
          indicatorColor='primary'
        >
          <Tab icon={<PersonIcon />} iconPosition='start' label='Tài khoản' />
        </Tabs>

        {tab === 0 && (
          <Box>
            {loading ? (
              <Typography>Đang cập nhật ...</Typography>
            ) : (
              <>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mx: 'auto',
                      mb: 2,
                      border: '2px solid #1976d2'
                    }}
                    src={avatarPreview}
                    alt='Avatar người dùng'
                  />
                  <Button
                    startIcon={<UploadIcon />}
                    variant='outlined'
                    component='label'
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Chọn ảnh
                    <input
                      hidden
                      accept='image/*'
                      type='file'
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  label='Email'
                  value={email}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: '#1976d2' }} />
                    )
                  }}
                  margin='normal'
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ bgcolor: '#f9f9f9' }}
                />

                <TextField
                  fullWidth
                  label='Tên'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                    )
                  }}
                  margin='normal'
                  InputLabelProps={{ shrink: true }}
                  error={!name.trim() || name.trim().length < 3}
                  helperText={
                    !name.trim()
                      ? 'Tên không được để trống'
                      : name.trim().length < 3
                        ? 'Tên phải có ít nhất 3 ký tự'
                        : ''
                  }
                />

                <Button
                  variant='contained'
                  fullWidth
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    bgcolor: '#1976d2',
                    textTransform: 'none'
                  }}
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              </>
            )}
          </Box>
        )}
      </Paper>
      <Box>
        <ShippingAdress></ShippingAdress>
      </Box>
      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Profile

// ✅ Component Profile.jsx với sửa lỗi ObjectId & Toggle hiển thị mật khẩu

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import UploadIcon from '@mui/icons-material/CloudUpload'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ShippingAdress from './shippingAdress/shippingAdress'
import {
  getProfileUser,
  updateProfile,
  changePassword
} from '~/services/userService'
import { useDispatch } from 'react-redux'
import { updateUserAPI } from '~/redux/user/userSlice'

const CLOUDINARY_URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const UPLOAD_PRESET = 'demo_unsigned'
const CLOUD_FOLDER = 'user_avatar'

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', CLOUD_FOLDER)
  const res = await fetch(CLOUDINARY_URI, { method: 'POST', body: formData })
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
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  })
  const dispatch = useDispatch()

  const handleTabChange = (_, newValue) => setTab(newValue)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => setSnackbarOpen(false)
  const handleOpenPasswordDialog = () => setOpenPasswordDialog(true)
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false)
    setOldPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  const validatePassword = (password) => {
    return (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    )
  }

  const handleUpdate = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 3) {
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
      dispatch(updateUserAPI(result))
      showSnackbar('Cập nhật thành công!')
    } else {
      showSnackbar(
        `Cập nhật thất bại: ${result?.error?.message || 'Lỗi không xác định'}`,
        'error'
      )
    }
  }

  const handleChangePassword = async () => {
    if (loading) return

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      showSnackbar('Vui lòng điền đầy đủ thông tin', 'error')
      return
    }

    if (newPassword !== confirmNewPassword) {
      showSnackbar('Mật khẩu xác nhận không khớp', 'error')
      return
    }

    if (!validatePassword(newPassword)) {
      showSnackbar(
        'Mật khẩu mới phải ≥ 6 ký tự, có 1 chữ in hoa, 1 ký tự đặc biệt',
        'error'
      )
      return
    }

    setLoading(true)
    try {
      const payload = {
        oldPassword,
        newPassword,
        confirmNewPassword
      }

      const result = await changePassword(payload)
      console.log('Phản hồi từ API:', result)

      setLoading(false)

      if (result?._id) {
        showSnackbar('Đổi mật khẩu thành công!')
        handleClosePasswordDialog()
      } else {
        showSnackbar('Lỗi khi đổi mật khẩu', 'error')
      }
    } catch (error) {
      setLoading(false)
      console.error('Lỗi khi gọi API:', error)
      showSnackbar(
        'Lỗi hệ thống: ' + (error?.response?.data?.message || error.message),
        'error'
      )
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
      <Paper elevation={3} sx={{ width: 350, p: 3, borderRadius: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} orientation='vertical'>
          <Tab icon={<PersonIcon />} label='Tài khoản' />
        </Tabs>

        {tab === 0 && (
          <Box>
            {loading ? (
              <Typography>Đang cập nhật ...</Typography>
            ) : (
              <>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  />
                  <Button
                    startIcon={<UploadIcon />}
                    component='label'
                    variant='outlined'
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
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label='Tên'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!name.trim() || name.trim().length < 3}
                  helperText={
                    !name.trim()
                      ? 'Không được để trống'
                      : name.trim().length < 3
                        ? 'Ít nhất 3 ký tự'
                        : ''
                  }
                />
                <Button
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3 }}
                  onClick={handleUpdate}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  startIcon={<LockIcon />}
                  sx={{ mt: 2 }}
                  onClick={handleOpenPasswordDialog}
                >
                  Đổi mật khẩu
                </Button>
              </>
            )}
          </Box>
        )}
      </Paper>

      <Box>
        <ShippingAdress />
      </Box>

      <Dialog open={openPasswordDialog} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          {['old', 'new', 'confirm'].map((field, index) => (
            <TextField
              key={field}
              label={
                field === 'old'
                  ? 'Mật khẩu hiện tại'
                  : field === 'new'
                    ? 'Mật khẩu mới'
                    : 'Xác nhận mật khẩu mới'
              }
              type={showPassword[field] ? 'text' : 'password'}
              fullWidth
              margin='normal'
              value={
                field === 'old'
                  ? oldPassword
                  : field === 'new'
                    ? newPassword
                    : confirmNewPassword
              }
              onChange={(e) => {
                if (field === 'old') setOldPassword(e.target.value)
                else if (field === 'new') setNewPassword(e.target.value)
                else setConfirmNewPassword(e.target.value)
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => toggleShowPassword(field)}
                    edge='end'
                  >
                    {showPassword[field] ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                )
              }}
              helperText={
                field === 'new'
                  ? '≥6 ký tự, 1 chữ in hoa, 1 ký tự đặc biệt'
                  : ''
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color='secondary'>
            Hủy
          </Button>
          <Button
            onClick={handleChangePassword}
            variant='contained'
            color='primary'
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>

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

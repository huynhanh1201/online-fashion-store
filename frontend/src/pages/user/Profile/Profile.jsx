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
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import UploadIcon from '@mui/icons-material/CloudUpload'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import ShippingAdress from './shippingAdress/shippingAdress'
import {
  getProfileUser,
  updateProfile,
  changePassword
} from '~/services/userService'
import { useDispatch } from 'react-redux'
import { updateUserAPI } from '~/redux/user/userSlice'
import { URI, CLOUD_FOLDER } from '~/utils/constants'

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', CLOUD_FOLDER)
  const res = await fetch(URI, { method: 'POST', body: formData })
  const data = await res.json()
  return data.secure_url
}

function validatePassword(pw) {
  return (
    pw.length >= 8 &&
    pw.length <= 128 &&
    /[a-z]/.test(pw) &&
    /[A-Z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  )
}

const Profile = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
  const [openForgotDialog, setOpenForgotDialog] = useState(false)

  // Thêm state để theo dõi giá trị gốc
  const [originalName, setOriginalName] = useState('')
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState('')

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
  const handleOpenForgotDialog = () => setOpenForgotDialog(true)
  const handleCloseForgotDialog = () => setOpenForgotDialog(false)

  // Kiểm tra xem có thay đổi nào không
  const hasChanges = () => {
    const nameChanged = name.trim() !== originalName.trim()
    const avatarChanged = avatarFile !== null
    return nameChanged || avatarChanged
  }

  const handleUpdate = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 3) {
      showSnackbar('Tên phải có ít nhất 3 ký tự!', 'error')
      return
    }

    // Kiểm tra xem có thay đổi nào không
    if (!hasChanges()) {
      showSnackbar('Không có thay đổi nào để cập nhật!', 'warning')
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

      // Cập nhật giá trị gốc sau khi cập nhật thành công
      setOriginalName(result.name || '')
      setOriginalAvatarUrl(result.avatarUrl || '')

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

    if (!validatePassword(newPassword)) {
      showSnackbar(
        'Mật khẩu mới phải có tối thiểu 8 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt.',
        'error'
      )
      return
    }

    if (newPassword !== confirmNewPassword) {
      showSnackbar('Xác nhận mật khẩu không khớp.', 'error')
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

      setLoading(false)

      if (result?._id) {
        showSnackbar('Đổi mật khẩu thành công!')
        handleClosePasswordDialog()
      } else {
        showSnackbar('Lỗi khi đổi mật khẩu', 'error')
      }
    } catch (error) {
      setLoading(false)
      showSnackbar(
        'Lỗi hệ thống: ' + (error?.response?.data?.message || error.message),
        'error'
      )
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const profileData = await getProfileUser()

        if (!profileData) {
          throw new Error('Không nhận được dữ liệu từ server')
        }

        // Kiểm tra và set các giá trị với fallback
        setName(profileData.name || '')
        setEmail(profileData.email || '')
        setAvatarPreview(profileData.avatarUrl || '')

        // Lưu giá trị gốc
        setOriginalName(profileData.name || '')
        setOriginalAvatarUrl(profileData.avatarUrl || '')

        // Kiểm tra nếu không có dữ liệu cơ bản
        if (!profileData.name && !profileData.email) {
          throw new Error('Thông tin hồ sơ không đầy đủ')
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin hồ sơ:', error)
        showSnackbar(
          error.message ||
            'Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.',
          'error'
        )
        // Reset các giá trị về mặc định
        setName('')
        setEmail('')
        setAvatarPreview('')
        setOriginalName('')
        setOriginalAvatarUrl('')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <Box
      sx={{
        bgcolor: '#f5f5f5',
        p: isMobile ? 2 : 4,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
        alignItems: isMobile ? 'stretch' : 'flex-start'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: isMobile ? '100%' : 350,
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column'
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            mt: isMobile ? 0 : 2,
            ml: isMobile ? 2 : 0,
            width: '100%'
          }}
        >
          {loading ? (
            <Typography>Đang cập nhật ...</Typography>
          ) : (
            <>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={optimizeCloudinaryUrl(avatarPreview)}
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
                disabled={loading || !hasChanges()}
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
              {/* <Button
                fullWidth
                variant='text'
                sx={{ mt: 1, color: '#1976d2', textTransform: 'none' }}
                onClick={handleOpenForgotDialog}
              >
                Quên mật khẩu?
              </Button> */}
            </>
          )}
        </Box>
      </Paper>

      <Box sx={{ flexGrow: 1 }}>
        <ShippingAdress />
      </Box>

      <Dialog
        open={openPasswordDialog}
        onClose={() => {}}
        disableEscapeKeyDown
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          {['old', 'new', 'confirm'].map((field) => (
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
                  ? '≥8 ký tự, 1 chữ thường, 1 chữ in hoa, 1 số, 1 ký tự đặc biệt'
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

      <Dialog
        open={openForgotDialog}
        onClose={handleCloseForgotDialog}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Nếu bạn quên mật khẩu, vui lòng sử dụng chức năng "Quên mật khẩu"
            tại trang đăng nhập hoặc liên hệ bộ phận hỗ trợ để được cấp lại mật
            khẩu mới.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              window.location.href = '/forgot-password'
            }}
          >
            Đến trang Quên mật khẩu
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotDialog} color='secondary'>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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

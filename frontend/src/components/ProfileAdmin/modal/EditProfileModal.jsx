import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  Typography
} from '@mui/material'
import useProfile from '~/hooks/useUserProfile.js'

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

const EditProfileModal = ({ open, onClose, profile }) => {
  const { updateUserProfile } = useProfile()
  const [name, setName] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setAvatarPreview(profile.avatarUrl || '')
    }
  }, [profile])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    let avatarUrl = profile.avatarUrl
    if (avatarFile) {
      avatarUrl = await uploadToCloudinary(avatarFile)
    }

    await updateUserProfile({ name, avatarUrl })
    setLoading(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, pt: 1 } }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Chỉnh sửa hồ sơ
      </DialogTitle>
      <Divider />

      {/* CONTENT */}
      <DialogContent sx={{ py: 4 }}>
        {/* Chọn ảnh avatar */}
        <Box display='flex' flexDirection='column' alignItems='center' mb={4}>
          <Avatar src={avatarPreview} sx={{ width: 120, height: 120, mb: 2 }} />
          <Button
            variant='inherit'
            component='label'
            sx={{ border: '1px solid #000' }}
          >
            Chọn ảnh đại diện
            <input
              type='file'
              accept='image/*'
              hidden
              onChange={handleAvatarChange}
            />
          </Button>
        </Box>

        {/* Chỉnh sửa tên */}
        <Box>
          <Typography variant='subtitle2' color='text.secondary' gutterBottom>
            Tên hiển thị
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nhập tên của bạn'
            variant='outlined'
          />
        </Box>
      </DialogContent>
      <Divider />

      {/* FOOTER */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color='inherit' onClick={onClose}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={loading}
          sx={{ backgroundColor: 'var(--primary-color)' }}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditProfileModal

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Divider,
  Button,
  Box,
  Paper,
  TextField
} from '@mui/material'
import EditProfileModal from './modal/EditProfileModal.jsx'
import StyleAdmin, {
  readOnlyBottomBorderInputSx
} from '~/assets/StyleAdmin.jsx'
export default function ProfileModal({ open, onClose, profile, fetchProfile }) {
  const [openEdit, setOpenEdit] = useState(false)

  if (!profile) return null
  const formattedName =
    profile?.name
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || ''

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: '#f9fafb',
            boxShadow: 10,
            p: 3
          }
        }}
      >
        <Box display='flex' flexDirection='column' alignItems='center'>
          {/* Avatar */}
          <Avatar
            src={profile.avatarUrl}
            alt={profile.name}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid #fff',
              boxShadow: 4
            }}
          />

          {/* Tên */}
          {/* Tên */}
          <Box width='100%' mb={2}>
            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
              Họ và tên
            </Typography>
            <TextField
              value={formattedName}
              fullWidth
              variant='standard'
              InputProps={{
                readOnly: true,
                disableUnderline: false // giữ underline (viền dưới)
              }}
              sx={readOnlyBottomBorderInputSx}
            />
          </Box>

          {/* Email */}
          <Box width='100%'>
            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
              Email
            </Typography>
            <TextField
              value={profile.email || ''}
              fullWidth
              variant='standard'
              InputProps={{
                readOnly: true,
                disableUnderline: false
              }}
              sx={readOnlyBottomBorderInputSx}
            />
          </Box>

          {/* Nút hành động (nếu cần) */}
          <Box display='flex' flexDirection='row' gap={1.5} mt={4} width='100%'>
            <Button
              variant='contained'
              sx={{
                backgroundColor: '#001f5d',
                '&:hover': { backgroundColor: '#001749' },
                borderRadius: 2,
                py: 1
              }}
              onClick={() => setOpenEdit(true)}
              fullWidth
            >
              Chỉnh sửa hồ sơ
            </Button>
            <Button
              onClick={onClose}
              color='inherit'
              variant='outlined'
              sx={{ borderRadius: 2, py: 1 }}
              fullWidth
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Dialog>

      <EditProfileModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false)
          fetchProfile()
        }}
        profile={profile}
      />
    </>
  )
}

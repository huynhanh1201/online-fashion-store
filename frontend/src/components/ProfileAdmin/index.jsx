// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Avatar,
//   Typography,
//   Divider,
//   Button,
//   Box,
//   Paper,
//   TextField
// } from '@mui/material'
// import EditProfileModal from './modal/EditProfileModal.jsx'
// import StyleAdmin, {
//   readOnlyBottomBorderInputSx
// } from '~/assets/StyleAdmin.jsx'
// import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
// export default function ProfileModal({ open, onClose, profile, fetchProfile }) {
//   const [openEdit, setOpenEdit] = useState(false)

//   if (!profile) return null
//   const formattedName =
//     profile?.name
//       ?.toLowerCase()
//       .split(' ')
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ') || ''

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         maxWidth='xs'
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4,
//             backgroundColor: '#f9fafb',
//             boxShadow: 10,
//             p: 3
//           }
//         }}
//       >
//         <Box display='flex' flexDirection='column' alignItems='center'>
//           {/* Avatar */}
//           <Avatar
//             src={optimizeCloudinaryUrl(profile.avatarUrl)}
//             alt={profile.name}
//             sx={{
//               width: 120,
//               height: 120,
//               mb: 2,
//               border: '4px solid #fff',
//               boxShadow: 4
//             }}
//           />

//           {/* Tên */}
//           {/* Tên */}
//           <Box width='100%' mb={2}>
//             <Typography variant='subtitle2' color='text.secondary' gutterBottom>
//               Họ và tên
//             </Typography>
//             <TextField
//               value={formattedName}
//               fullWidth
//               variant='standard'
//               InputProps={{
//                 readOnly: true,
//                 disableUnderline: false // giữ underline (viền dưới)
//               }}
//               sx={readOnlyBottomBorderInputSx}
//             />
//           </Box>

//           {/* Email */}
//           <Box width='100%'>
//             <Typography variant='subtitle2' color='text.secondary' gutterBottom>
//               Email
//             </Typography>
//             <TextField
//               value={profile.email || ''}
//               fullWidth
//               variant='standard'
//               InputProps={{
//                 readOnly: true,
//                 disableUnderline: false
//               }}
//               sx={readOnlyBottomBorderInputSx}
//             />
//           </Box>

//           {/* Nút hành động (nếu cần) */}
//           <Box display='flex' flexDirection='row' gap={1.5} mt={4} width='100%'>
//             <Button
//               variant='contained'
//               sx={{
//                 backgroundColor: '#001f5d',
//                 '&:hover': { backgroundColor: '#001749' },
//                 borderRadius: 2,
//                 py: 1
//               }}
//               onClick={() => setOpenEdit(true)}
//               fullWidth
//             >
//               Chỉnh sửa hồ sơ
//             </Button>
//             <Button
//               onClick={onClose}
//               color='inherit'
//               variant='outlined'
//               sx={{ borderRadius: 2, py: 1 }}
//               fullWidth
//             >
//               Đóng
//             </Button>
//           </Box>
//         </Box>
//       </Dialog>

//       <EditProfileModal
//         open={openEdit}
//         onClose={() => {
//           setOpenEdit(false)
//           fetchProfile()
//         }}
//         profile={profile}
//       />
//     </>
//   )
// }

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Avatar,
  Typography,
  Button,
  Box,
  TextField
} from '@mui/material'
import StyleAdmin, { readOnlyBottomBorderInputSx } from '~/assets/StyleAdmin.jsx'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
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

export default function ProfileModal({ open, onClose, profile, fetchProfile }) {
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

  if (!profile) return null

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
    fetchProfile()
  }

  return (
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
          src={avatarPreview || optimizeCloudinaryUrl(profile.avatarUrl)}
          alt={profile.name}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: '4px solid #fff',
            boxShadow: 4
          }}
        />
        <Button
          variant='outlined'
          component='label'
          sx={{ mb: 2 , borderColor:'#001f5d', color: '#001f5d'}}
        >
          Chọn ảnh đại diện
          <input
            type='file'
            accept='image/*'
            hidden
            onChange={handleAvatarChange}
          />
        </Button>

        {/* Họ và tên */}
        <Box width='100%' mb={2}>
          <Typography variant='subtitle2' color='text.secondary' gutterBottom>
            Họ và tên
          </Typography>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant='standard'
            InputProps={{
              disableUnderline: false
            }}
            sx={readOnlyBottomBorderInputSx}
          />
        </Box>

        {/* Email (không chỉnh sửa) */}
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
            disabled
            sx={{readOnlyBottomBorderInputSx, pointerEvents: 'none'}}
          />
        </Box>

        {/* Nút hành động */}
        <Box display='flex' flexDirection='row' gap={1.5} mt={4} width='100%'>
          <Button
            onClick={onClose}
            color='inherit'
            variant='outlined'
            sx={{ borderRadius: 2, py: 1 }}
            fullWidth
          >
            Đóng
          </Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            disabled={loading}
            sx={{
              backgroundColor: '#001f5d',
              color: '#fff',
              '&:hover': { backgroundColor: '#001749' },
              borderRadius: 2,
              py: 1
            }}
            fullWidth
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

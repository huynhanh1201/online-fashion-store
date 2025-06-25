// import React from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   Divider,
//   Avatar
// } from '@mui/material'
// import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
// import StyleAdmin from '~/assets/StyleAdmin.jsx'
// import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
//
// const ViewUserModal = ({ open, onClose, user }) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Không có thông tin'
//     const date = new Date(dateString)
//     return date.toLocaleString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     })
//   }
//
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth='md'
//       BackdropProps={{ sx: StyleAdmin.OverlayModal }}
//     >
//       <DialogTitle>Thông tin người dùng</DialogTitle>
//       <Divider />
//       <DialogContent sx={{ maxHeight: '69vh' }}>
//         {user ? (
//           <Box
//             display='flex'
//             gap={3}
//             flexDirection={{ xs: 'column', sm: 'row' }}
//           >
//             {/* Avatar trái */}
//             <Box
//               display='flex'
//               flexDirection='column'
//               alignItems='center'
//               justifyContent='center'
//               border='2px dashed #ccc'
//               borderRadius={2}
//               p={2}
//               minHeight={200}
//               sx={{
//                 backgroundColor: '#fafafa',
//                 width: 300,
//                 height: 300
//               }}
//             >
//               {user.avatarUrl ? (
//                 <Avatar
//                   src={optimizeCloudinaryUrl(user.avatarUrl)}
//                   alt={user.name}
//                   sx={{ width: 150, height: 150 }}
//                 />
//               ) : (
//                 <Box textAlign='center' color='#999'>
//                   <ImageNotSupportedIcon fontSize='large' />
//                   <Typography fontSize={14} mt={1}>
//                     Không có ảnh đại diện
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//
//             {/* Thông tin phải */}
//             <Box flex={1}>
//               <Box mb={2}>
//                 <Typography variant='subtitle2' fontWeight='bold'>
//                   Tên người dùng
//                 </Typography>
//                 <Typography>{user.name || '—'}</Typography>
//               </Box>
//
//               <Box mb={2}>
//                 <Typography variant='subtitle2' fontWeight='bold'>
//                   Email
//                 </Typography>
//                 <Typography>{user.email || '—'}</Typography>
//               </Box>
//
//               <Box mb={2}>
//                 <Typography variant='subtitle2' fontWeight='bold'>
//                   Vai trò
//                 </Typography>
//                 <Typography sx={{ textTransform: 'capitalize' }}>
//                   {user.role || '—'}
//                 </Typography>
//               </Box>
//
//               <Box mb={2}>
//                 <Typography variant='subtitle2' fontWeight='bold'>
//                   Trạng thái
//                 </Typography>
//                 <Typography color={user.isActive ? 'green' : 'error'}>
//                   {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
//                 </Typography>
//               </Box>
//
//               <Box mb={2}>
//                 <Typography variant='subtitle2' fontWeight='bold'>
//                   Ngày tạo
//                 </Typography>
//                 <Typography>{formatDate(user.createdAt)}</Typography>
//               </Box>
//
//               <Box>
//                 <Typography variant='subtitle2' fontWeight='bold'>
//                   Ngày cập nhật
//                 </Typography>
//                 <Typography>{formatDate(user.updatedAt)}</Typography>
//               </Box>
//             </Box>
//           </Box>
//         ) : (
//           <Typography>Không có dữ liệu người dùng</Typography>
//         )}
//       </DialogContent>
//       <Divider />
//       <DialogActions sx={{ padding: '16px 24px' }}>
//         <Button
//           onClick={onClose}
//           color='error'
//           variant='outlined'
//           sx={{ textTransform: 'none' }}
//         >
//           Đóng
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }
//
// export default ViewUserModal

import React, { useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Typography,
  Chip,
  Box
} from '@mui/material'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewUserModal = React.memo(({ open, onClose, user }) => {
  useEffect(() => {
    if (!open) {
      // Reset dữ liệu khi đóng modal
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Chi tiết người dùng</DialogTitle>
      <DialogContent>
        {user ? (
          <Box sx={{ mt: 1 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Tên người dùng</strong>
                  </TableCell>
                  <TableCell>{user.name || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>{user.email || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Quyền</strong>
                  </TableCell>
                  <TableCell>
                    {user.role === 'admin' ? 'QUẢN TRỊ' : 'KHÁCH HÀNG'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell>
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography>Không có dữ liệu người dùng</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} variant='contained' color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default ViewUserModal

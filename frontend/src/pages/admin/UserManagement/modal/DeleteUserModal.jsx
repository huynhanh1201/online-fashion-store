// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   Divider
// } from '@mui/material'
//
// import StyleAdmin from '~/assets/StyleAdmin.jsx'
//
// const DeleteUserModal = ({ open, onClose, user, onDelete }) => {
//   const [isDeleting, setIsDeleting] = useState(false)
//
//   const handleDelete = async () => {
//     setIsDeleting(true)
//     try {
//       await onDelete(user._id, 'delete')
//       onClose()
//     } catch (error) {
//       console.error('Xoá người dùng thất bại:', error)
//     } finally {
//       setIsDeleting(false)
//     }
//   }
//
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth='sm'
//       BackdropProps={{
//         sx: StyleAdmin.OverlayModal
//       }}
//     >
//       <DialogTitle>Xoá người dùng</DialogTitle>
//       <Divider sx={{ my: 0 }} />
//       <DialogContent>
//         Bạn có chắc chắn muốn xoá người dùng{' '}
//         <strong>{user?.name || user?.email || 'Không xác định'}</strong> không?
//       </DialogContent>
//       <Divider sx={{ my: 0 }} />
//       <DialogActions sx={{ padding: '16px 24px' }}>
//         <Button
//           onClick={onClose}
//           color='inherit'
//           disabled={isDeleting}
//           sx={{ textTransform: 'none' }}
//         >
//           Hủy
//         </Button>
//         <Button
//           onClick={handleDelete}
//           color='error'
//           variant='contained'
//           disabled={isDeleting}
//           sx={{ textTransform: 'none' }}
//         >
//           {isDeleting ? 'Đang xoá...' : 'Xoá'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }
//
// export default DeleteUserModal

import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { dialogTitleStyle, cancelButtonStyle } from './StyleModal'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const DeleteUserModal = React.memo(({ open, onClose, user, onDelete }) => {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!user?._id) return
    setIsDeleting(true)
    try {
      await onDelete(user._id)
      onClose()
    } catch (error) {
      console.error('Xóa người dùng thất bại:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle sx={dialogTitleStyle}>Xác nhận xóa người dùng</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xóa người dùng{' '}
          <strong>
            {user?.name
              ?.toLowerCase()
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ') || ''}
          </strong>{' '}
          không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          color='inherit'
          onClick={onClose}
          disabled={isDeleting}
          sx={cancelButtonStyle}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : null}
        >
          {isDeleting ? 'Đang xóa' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default DeleteUserModal

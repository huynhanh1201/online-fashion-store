// import React from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography
// } from '@mui/material'
//
// const DeleteBlogModal = ({ open, onClose, post, onDelete }) => {
//   const handleDelete = () => {
//     if (post?._id) {
//       onDelete(post._id, 'delete')
//       onClose()
//     }
//   }
//
//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
//       <DialogTitle>Xác nhận xoá</DialogTitle>
//       <DialogContent dividers>
//         <Typography>
//           Bạn có chắc chắn muốn xoá bài viết: <strong>{post?.title}</strong>{' '}
//           không?
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant='outlined' color='inherit'>
//           Huỷ
//         </Button>
//         <Button onClick={handleDelete} variant='contained' color='error'>
//           Xoá
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }
//
// export default DeleteBlogModal

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const DeleteBlogModal = ({ open, onClose, onConfirm, blog }) => {
  if (!blog) return null
  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs'>
      <DialogTitle>Xoá bài viết</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xoá bài viết “{blog.title}” không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={onConfirm} variant='contained' color='error'>
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteBlogModal

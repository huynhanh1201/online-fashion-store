// import React, { useState, useRef } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Stack,
//   Box,
//   Typography,
//   IconButton,
//   Tooltip
// } from '@mui/material'
// import DeleteIcon from '@mui/icons-material/Delete'
// import EditIcon from '@mui/icons-material/Edit'
// import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
// import { useForm } from 'react-hook-form'
// import Chip from '@mui/material/Chip'
//
// const AddBlogModal = ({ open, onClose, onAdded }) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting },
//     reset
//   } = useForm({
//     defaultValues: {
//       title: '',
//       content: '',
//       status: 'draft'
//     }
//   })
//
//   const [imageFile, setImageFile] = useState(null)
//   const [previewUrl, setPreviewUrl] = useState('')
//   const fileInputRef = useRef()
//
//   const onSubmit = async (data) => {
//     const payload = {
//       title: data.title.trim(),
//       content: data.content.trim(),
//       image: previewUrl,
//       isActive: data.status === 'active'
//     }
//     await onAdded(payload, 'add')
//     handleClose()
//   }
//
//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setImageFile(file)
//       setPreviewUrl(URL.createObjectURL(file))
//     }
//   }
//
//   const handleImageRemove = () => {
//     setImageFile(null)
//     setPreviewUrl('')
//   }
//
//   const handleEditImage = () => {
//     fileInputRef.current?.click()
//   }
//
//   const handleClose = () => {
//     reset()
//     setImageFile(null)
//     setPreviewUrl('')
//     onClose()
//   }
//
//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
//       <DialogTitle>Thêm bài viết</DialogTitle>
//       <DialogContent dividers>
//         <Stack direction='row' spacing={3}>
//           <Box sx={{ width: 150 }}>
//             <Box
//               onClick={() => fileInputRef.current?.click()}
//               sx={{
//                 width: 150,
//                 height: 150,
//                 border: '1px dashed #ccc',
//                 borderRadius: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 position: 'relative',
//                 backgroundColor: '#f9f9f9',
//                 cursor: 'pointer'
//               }}
//             >
//               {previewUrl ? (
//                 <>
//                   <img
//                     src={previewUrl}
//                     alt='Preview'
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'cover'
//                     }}
//                   />
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       top: 0,
//                       right: 0,
//                       display: 'flex',
//                       gap: 1
//                     }}
//                   >
//                     <Tooltip title='Sửa ảnh'>
//                       <IconButton onClick={handleEditImage} size='small'>
//                         <EditIcon fontSize='small' color='warning' />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title='Xoá ảnh'>
//                       <IconButton onClick={handleImageRemove} size='small'>
//                         <DeleteIcon fontSize='small' color='error' />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </>
//               ) : (
//                 <Box textAlign='center' color='#999'>
//                   <AddPhotoAlternateIcon fontSize='large' />
//                   <Typography fontSize={14} mt={1}>
//                     Thêm ảnh
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//             <input
//               type='file'
//               accept='image/*'
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               style={{ display: 'none' }}
//             />
//           </Box>
//           <Box sx={{ flex: 1 }}>
//             <TextField
//               label='Tiêu đề'
//               {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
//               error={!!errors.title}
//               helperText={errors.title?.message}
//               fullWidth
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label='Nội dung'
//               {...register('content', { required: 'Vui lòng nhập nội dung' })}
//               error={!!errors.content}
//               helperText={errors.content?.message}
//               fullWidth
//               multiline
//               minRows={4}
//               sx={{ mb: 2 }}
//             />
//             <Typography fontWeight='bold' mb={1}>
//               Trạng thái
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               {[
//                 { label: 'Bản nháp', value: 'draft' },
//                 { label: 'Hoạt động', value: 'active' },
//                 { label: 'Không hoạt động', value: 'inactive' }
//               ].map((item) => {
//                 const isSelected = watch('status') === item.value
//                 return (
//                   <Chip
//                     key={item.value}
//                     label={item.label}
//                     onClick={() => setValue('status', item.value)}
//                     variant={isSelected ? 'filled' : 'outlined'}
//                     clickable
//                     sx={{
//                       ...(isSelected && {
//                         backgroundColor: '#001f5d',
//                         color: '#fff'
//                       })
//                     }}
//                   />
//                 )
//               })}
//             </Box>
//           </Box>
//         </Stack>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} variant='outlined' color='error'>
//           Huỷ
//         </Button>
//         <Button
//           onClick={handleSubmit(onSubmit)}
//           variant='contained'
//           disabled={isSubmitting}
//           sx={{ backgroundColor: '#001f5d', color: '#fff' }}
//         >
//           Thêm
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }
//
// export default AddBlogModal

import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'
import { useForm } from 'react-hook-form'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'
import ProductDescriptionEditor from '~/pages/admin/ProductManagement/component/ProductDescriptionEditor.jsx'

const AddBlogModal = ({ open, onClose, onSave }) => {
  const { register, handleSubmit, control, reset, setValue } = useForm()

  const onSubmit = (data) => {
    const newBlog = {
      title: data.title,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      category: data.category,
      publishedAt: new Date(),
      author: { name: 'Admin', avatar: '', id: 'admin' },
      status: 'draft',
      content: data.description,
      images: [],
      tags: [],
      brand: '',
      meta: { title: '', description: '', keywords: [] },
      updatedAt: new Date(),
      views: 0,
      likes: 0
    }
    onSave(newBlog)
    reset()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl'>
      <DialogTitle>Thêm bài viết</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <TextField
            label='Tiêu đề'
            fullWidth
            margin='normal'
            {...register('title')}
            required
          />
          <TextField
            label='Mô tả ngắn'
            fullWidth
            margin='normal'
            {...register('excerpt')}
          />
          <TextField
            label='Ảnh bìa (URL)'
            fullWidth
            margin='normal'
            {...register('coverImage')}
          />
          <TextField
            label='Chuyên mục'
            fullWidth
            margin='normal'
            {...register('category')}
          />
          <ProductDescriptionEditor
            control={control}
            name='description'
            setValue={setValue}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
          <Button type='submit' variant='contained'>
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddBlogModal

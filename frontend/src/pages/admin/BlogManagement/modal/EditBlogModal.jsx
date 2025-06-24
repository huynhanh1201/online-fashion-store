// import React, { useEffect, useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Box,
//   Typography,
//   Autocomplete,
//   Card,
//   IconButton,
//   CircularProgress,
//   useTheme,
//   useMediaQuery,
//   Stack,
//   Paper
// } from '@mui/material'
// import {
//   Close as CloseIcon,
//   Article as ArticleIcon,
//   Image as ImageIcon,
//   Tag as TagIcon,
//   Search as SearchIcon,
//   CloudUpload as UploadIcon,
//   Save as SaveIcon,
//   Category as CategoryIcon
// } from '@mui/icons-material'
// import { useForm, Controller } from 'react-hook-form'
// import { toast } from 'react-toastify'
// import ProductDescriptionEditor from '~/pages/admin/ProductManagement/component/ProductDescriptionEditor.jsx'
// import { uploadImageToCloudinary } from '~/utils/cloudinary.js'

// // Unified input styles for consistent appearance
// const getInputStyles = (theme) => ({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: 2,
//     minHeight: '56px', // Consistent height for all inputs
//     backgroundColor: 'white',
//     '&:hover fieldset': {
//       borderColor: '#0052cc'
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#0052cc',
//       borderWidth: 2
//     }
//   },
//   '& .MuiInputLabel-root': {
//     color: '#4a4a4a',
//     '&.Mui-focused': { color: '#0052cc' }
//   },
//   '& .MuiInputBase-input': {
//     fontSize: '0.95rem',
//     padding: '16.5px 14px'
//   }
// })

// const EditBlogModal = ({ open, onClose, onSave, blog }) => {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

//   const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
//     defaultValues: {
//       title: '',
//       excerpt: '',
//       content: '',
//       coverImage: '',
//       tags: [],
//       category: '',
//       brand: '',
//       status: 'draft',
//       metaTitle: '',
//       metaDescription: '',
//       metaKeywords: []
//     }
//   })
//   const [imageUrls, setImageUrls] = useState([''])
//   const [uploading, setUploading] = useState(false)
//   const [uploadingIndex, setUploadingIndex] = useState(null)

//   // Danh sách categories có sẵn
//   const categories = [
//     'Trang phục',
//     'Phụ kiện',
//     'Giày dép',
//     'Túi xách',
//     'Tư vấn phối đồ',
//     'Xu hướng thời trang'
//   ]

//   // Danh sách brands có sẵn
//   const brands = [
//     'Zara',
//     'H&M',
//     'Gucci',
//     'Louis Vuitton',
//     'Nike',
//     'Adidas',
//     'Uniqlo',
//     'Chanel',
//     'Dior',
//     'Prada'
//   ]

//   useEffect(() => {
//     if (blog && open) {
//       reset({
//         title: blog.title || '',
//         excerpt: blog.excerpt || '',
//         content: blog.content || '',
//         coverImage: blog.coverImage || '',
//         tags: blog.tags || [],
//         category: blog.category || '',
//         brand: blog.brand || '',
//         status: blog.status || 'draft',
//         metaTitle: blog.meta?.title || '',
//         metaDescription: blog.meta?.description || '',
//         metaKeywords: blog.meta?.keywords || []
//       })
//       setImageUrls(blog.images && blog.images.length > 0 ? blog.images : [''])
//     }
//   }, [blog, open, reset])

//   const handleAddImageUrl = () => {
//     setImageUrls([...imageUrls, ''])
//   }

//   const handleRemoveImageUrl = (index) => {
//     const newUrls = imageUrls.filter((_, i) => i !== index)
//     setImageUrls(newUrls)
//   }

//   const handleImageUrlChange = (index, value) => {
//     const newUrls = [...imageUrls]
//     newUrls[index] = value
//     setImageUrls(newUrls)
//   }

//   const handleImageUpload = async (event, index) => {
//     const file = event.target.files[0]
//     if (!file) return

//     setUploading(true)
//     setUploadingIndex(index)

//     try {
//       const imageUrl = await uploadImageToCloudinary(file)
//       const newUrls = [...imageUrls]
//       newUrls[index] = imageUrl
//       setImageUrls(newUrls)
//       toast.success('Upload ảnh thành công!')
//     } catch (error) {
//       console.error('Error uploading image:', error)
//       toast.error('Lỗi upload ảnh!')
//     } finally {
//       setUploading(false)
//       setUploadingIndex(null)
//     }
//   }

//   const onSubmit = (data) => {
//     const updatedBlog = {
//       ...blog,
//       title: data.title,
//       excerpt: data.excerpt,
//       content: data.content,
//       coverImage: data.coverImage,
//       tags: data.tags,
//       category: data.category,
//       brand: data.brand,
//       status: data.status,
//       images: imageUrls.filter(url => url.trim() !== ''),
//       updatedAt: new Date().toISOString(),
//       meta: {
//         title: data.metaTitle || data.title,
//         description: data.metaDescription || data.excerpt,
//         keywords: data.metaKeywords
//       }
//     }

//     onSave(updatedBlog)
//     handleClose()
//   }

//   const handleClose = () => {
//     onClose()
//   }

//   // Don't render if no blog data or form is not ready
//   if (!blog || !control) return null

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       fullWidth
//       maxWidth={isMobile ? 'sm' : 'lg'}
//       fullScreen={isMobile}
//       PaperProps={{
//         sx: {
//           borderRadius: isMobile ? 0 : '12px',
//           boxShadow: '0 8px 24px rgba(0, 31, 93, 0.12)',
//           maxHeight: '80vh',
//           margin: isMobile ? 0 : '16px'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         background: 'linear-gradient(135deg, #0052cc 0%, #2684ff 100%)',
//         color: 'white',
//         py: isMobile ? 1.5 : 2,
//         px: isMobile ? 2 : 3,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         minHeight: isMobile ? '56px' : '64px'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//           <ArticleIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
//           <Typography
//             variant={isMobile ? "subtitle1" : "h6"}
//             sx={{
//               fontWeight: 600,
//               fontSize: isMobile ? '1rem' : '1.25rem',
//               lineHeight: 1.2
//             }}
//           >
//             Chỉnh sửa bài viết
//           </Typography>
//         </Box>
//         <IconButton
//           onClick={handleClose}
//           size={isMobile ? "small" : "medium"}
//           sx={{
//             color: 'white',
//             '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent sx={{
//           p: isMobile ? 2 : 3,
//           backgroundColor: '#f9fafb',
//           overflowY: 'auto',
//           maxHeight: isMobile ? 'calc(80vh - 120px)' : 'calc(80vh - 140px)'
//         }}>
//           {/* Main Container using Flexbox */}
//           <Box sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: isMobile ? 2 : 3
//           }}>

//             {/* Section 1: Basic Information */}
//             <Paper sx={{
//               p: isMobile ? 2 : 2.5,
//               borderRadius: '8px',
//               border: '1px solid #e8ecef',
//               boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)'
//             }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                   color: '#1a202c',
//                   fontWeight: 600,
//                   mb: 2,
//                   fontSize: isMobile ? '1rem' : '1.1rem'
//                 }}
//               >
//                 <ArticleIcon sx={{ color: '#0052cc', fontSize: 20 }} />
//                 Thông tin cơ bản
//               </Typography>

//               {/* Title and Status Row */}
//               <Box sx={{
//                 display: 'flex',
//                 flexDirection: isMobile ? 'column' : 'row',
//                 gap: 2,
//                 mb: 2
//               }}>
//                 <Box sx={{ flex: isMobile ? '1' : '2' }}>
//                   <TextField
//                     label="Tiêu đề bài viết *"
//                     fullWidth
//                     variant="outlined"
//                     {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
//                     error={!!errors.title}
//                     helperText={errors.title?.message}
//                     sx={getInputStyles(theme)}
//                   />
//                 </Box>

//                 <Box sx={{ flex: 1 }}>
//                   <FormControl fullWidth>
//                     <InputLabel>Trạng thái *</InputLabel>
//                     <Controller
//                       name="status"
//                       control={control}
//                       rules={{ required: 'Vui lòng chọn trạng thái' }}
//                       render={({ field }) => (
//                         <Select
//                           {...field}
//                           label="Trạng thái *"
//                           sx={{
//                             ...getInputStyles(theme),
//                             '& .MuiSelect-select': {
//                               padding: '16.5px 14px'
//                             }
//                           }}
//                         >
//                           <MenuItem value="draft">
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} />
//                               Bản nháp
//                             </Box>
//                           </MenuItem>
//                           <MenuItem value="published">
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
//                               Đã xuất bản
//                             </Box>
//                           </MenuItem>
//                           <MenuItem value="archived">
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#9e9e9e' }} />
//                               Lưu trữ
//                             </Box>
//                           </MenuItem>
//                         </Select>
//                       )}
//                     />
//                   </FormControl>
//                 </Box>
//               </Box>

//               {/* Excerpt */}
//               <TextField
//                 label="Mô tả ngắn (Excerpt)"
//                 fullWidth
//                 multiline
//                 rows={isMobile ? 2 : 3}
//                 variant="outlined"
//                 {...register('excerpt')}
//                 helperText="Đoạn mô tả ngắn hiển thị trong danh sách bài viết"
//                 sx={{
//                   ...getInputStyles(theme),
//                   '& .MuiOutlinedInput-root': {
//                     ...getInputStyles(theme)['& .MuiOutlinedInput-root'],
//                     minHeight: 'auto'
//                   }
//                 }}
//               />
//             </Paper>

//             {/* Two Column Layout */}
//             <Box sx={{
//               display: 'flex',
//               flexDirection: isMobile ? 'column' : 'row',
//               gap: isMobile ? 2 : 3
//             }}>

//               {/* Left Column: Category & Brand */}
//               <Box sx={{ flex: 1 }}>
//                 <Paper sx={{
//                   p: isMobile ? 2 : 2.5,
//                   borderRadius: '8px',
//                   border: '1px solid #e8ecef',
//                   boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)',
//                   height: 'fit-content'
//                 }}>
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                       color: '#1a202c',
//                       fontWeight: 600,
//                       mb: 2,
//                       fontSize: isMobile ? '1rem' : '1.1rem'
//                     }}
//                   >
//                     <TagIcon sx={{ color: '#0052cc', fontSize: 20 }} />
//                     Phân loại & Thương hiệu
//                   </Typography>

//                   <Stack spacing={2}>
//                     <Controller
//                       name="category"
//                       control={control}
//                       render={({ field }) => (
//                         <Autocomplete
//                           {...field}
//                           options={categories}
//                           freeSolo
//                           value={field.value || ''}
//                           onChange={(event, newValue) => field.onChange(newValue)}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               label="Chuyên mục *"
//                               variant="outlined"
//                               helperText="Chọn hoặc nhập chuyên mục"
//                               sx={getInputStyles(theme)}
//                             />
//                           )}
//                         />
//                       )}
//                     />

//                     <Controller
//                       name="brand"
//                       control={control}
//                       render={({ field }) => (
//                         <Autocomplete
//                           {...field}
//                           options={brands}
//                           freeSolo
//                           value={field.value || ''}
//                           onChange={(event, newValue) => field.onChange(newValue)}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               label="Thương hiệu"
//                               variant="outlined"
//                               helperText="Chọn hoặc nhập thương hiệu"
//                               sx={getInputStyles(theme)}
//                             />
//                           )}
//                         />
//                       )}
//                     />

//                     <Controller
//                       name="tags"
//                       control={control}
//                       render={({ field }) => (
//                         <Autocomplete
//                           {...field}
//                           multiple
//                           freeSolo
//                           options={[]}
//                           value={field.value || []}
//                           onChange={(event, newValue) => field.onChange(newValue)}
//                           renderTags={(value, getTagProps) =>
//                             value.map((option, index) => (
//                               <Chip
//                                 variant="outlined"
//                                 label={option}
//                                 size="small"
//                                 {...getTagProps({ index })}
//                                 key={index}
//                                 sx={{
//                                   borderColor: '#0052cc',
//                                   color: '#0052cc',
//                                   '&:hover': { backgroundColor: '#f0f4ff' }
//                                 }}
//                               />
//                             ))
//                           }
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               label="Tags"
//                               variant="outlined"
//                               placeholder="Nhập tags và nhấn Enter"
//                               helperText="Thêm các từ khóa liên quan"
//                               sx={getInputStyles(theme)}
//                             />
//                           )}
//                         />
//                       )}
//                     />
//                   </Stack>
//                 </Paper>
//               </Box>

//               {/* Right Column: Images & SEO */}
//               <Box sx={{ flex: 1 }}>
//                 <Stack spacing={isMobile ? 2 : 3}>
//                   {/* Cover Image Section */}
//                   <Paper sx={{
//                     p: isMobile ? 2 : 2.5,
//                     borderRadius: '8px',
//                     border: '1px solid #e8ecef',
//                     boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)'
//                   }}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 1,
//                         color: '#1a202c',
//                         fontWeight: 600,
//                         mb: 2,
//                         fontSize: isMobile ? '1rem' : '1.1rem'
//                       }}
//                     >
//                       <ImageIcon sx={{ color: '#0052cc', fontSize: 20 }} />
//                       Ảnh bìa
//                     </Typography>

//                     <TextField
//                       label="URL ảnh bìa"
//                       fullWidth
//                       variant="outlined"
//                       {...register('coverImage')}
//                       helperText="Nhập URL ảnh bìa cho bài viết"
//                       sx={getInputStyles(theme)}
//                     />
//                   </Paper>

//                   {/* SEO Meta Section */}
//                   <Paper sx={{
//                     p: isMobile ? 2 : 2.5,
//                     borderRadius: '8px',
//                     border: '1px solid #e8ecef',
//                     boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)'
//                   }}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 1,
//                         color: '#1a202c',
//                         fontWeight: 600,
//                         mb: 2,
//                         fontSize: isMobile ? '1rem' : '1.1rem'
//                       }}
//                     >
//                       <SearchIcon sx={{ color: '#0052cc', fontSize: 20 }} />
//                       SEO Meta
//                     </Typography>

//                     <Stack spacing={2}>
//                       <TextField
//                         label="Meta Title"
//                         fullWidth
//                         variant="outlined"
//                         {...register('metaTitle')}
//                         helperText="Tiêu đề SEO (để trống sẽ dùng title)"
//                         sx={getInputStyles(theme)}
//                       />

//                       <TextField
//                         label="Meta Description"
//                         fullWidth
//                         multiline
//                         rows={2}
//                         variant="outlined"
//                         {...register('metaDescription')}
//                         helperText="Mô tả SEO (để trống sẽ dùng excerpt)"
//                         sx={{
//                           ...getInputStyles(theme),
//                           '& .MuiOutlinedInput-root': {
//                             ...getInputStyles(theme)['& .MuiOutlinedInput-root'],
//                             minHeight: 'auto'
//                           }
//                         }}
//                       />

//                       <Controller
//                         name="metaKeywords"
//                         control={control}
//                         render={({ field }) => (
//                           <Autocomplete
//                             {...field}
//                             multiple
//                             freeSolo
//                             options={[]}
//                             value={field.value || []}
//                             onChange={(event, newValue) => field.onChange(newValue)}
//                             renderTags={(value, getTagProps) =>
//                               value.map((option, index) => (
//                                 <Chip
//                                   variant="outlined"
//                                   label={option}
//                                   size="small"
//                                   {...getTagProps({ index })}
//                                   key={index}
//                                   sx={{
//                                     borderColor: '#0052cc',
//                                     color: '#0052cc',
//                                     '&:hover': { backgroundColor: '#f0f4ff' }
//                                   }}
//                                 />
//                               ))
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label="Meta Keywords"
//                                 variant="outlined"
//                                 placeholder="Nhập từ khóa SEO và nhấn Enter"
//                                 helperText="Từ khóa SEO để tối ưu tìm kiếm"
//                                 sx={getInputStyles(theme)}
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </Stack>
//                   </Paper>
//                 </Stack>
//               </Box>
//             </Box>

//             {/* Content Section */}
//             <Paper sx={{
//               p: isMobile ? 2 : 2.5,
//               borderRadius: '8px',
//               border: '1px solid #e8ecef',
//               boxShadow: '0 2px 8px rgba(0, 31, 93, 0.06)'
//             }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                   color: '#1a202c',
//                   fontWeight: 600,
//                   mb: 2,
//                   fontSize: isMobile ? '1rem' : '1.1rem'
//                 }}
//               >
//                 <ArticleIcon sx={{ color: '#0052cc', fontSize: 20 }} />
//                 Nội dung bài viết
//               </Typography>

//               <Controller
//                 name="content"
//                 control={control}
//                 render={({ field }) => (
//                   <ProductDescriptionEditor
//                     value={field.value || ''}
//                     onChange={field.onChange}
//                     placeholder="Nhập nội dung bài viết..."
//                   />
//                 )}
//               />
//             </Paper>
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{
//           p: isMobile ? 2 : 3,
//           backgroundColor: '#fafbff',
//           borderTop: '1px solid #e8ecef',
//           gap: 1.5,
//           display: 'flex',
//           flexDirection: isMobile ? 'column-reverse' : 'row',
//           '& > *': {
//             width: isMobile ? '100%' : 'auto'
//           }
//         }}>
//           <Button
//             onClick={handleClose}
//             variant="outlined"
//             sx={{
//               minWidth: isMobile ? '100%' : '120px',
//               height: '48px',
//               borderRadius: 2,
//               borderColor: '#9e9e9e',
//               color: '#616161',
//               '&:hover': {
//                 borderColor: '#757575',
//                 backgroundColor: '#f5f5f5'
//               }
//             }}
//           >
//             Hủy
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             startIcon={<SaveIcon />}
//             sx={{
//               minWidth: isMobile ? '100%' : '160px',
//               height: '48px',
//               borderRadius: 2,
//               backgroundColor: '#0052cc',
//               '&:hover': {
//                 backgroundColor: '#003d99'
//               }
//             }}
//           >
//             Cập nhật bài viết
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   )
// }

// export default EditBlogModal
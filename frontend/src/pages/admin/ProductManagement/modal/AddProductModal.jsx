// import React, { useState, useRef, useEffect } from 'react'
// import Dialog from '@mui/material/Dialog'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'
// import TextField from '@mui/material/TextField'
// import Button from '@mui/material/Button'
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import FormControl from '@mui/material/FormControl'
// import Select from '@mui/material/Select'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import IconButton from '@mui/material/IconButton'
// import Divider from '@mui/material/Divider'
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
// import ListItemAvatar from '@mui/material/ListItemAvatar'
// import Avatar from '@mui/material/Avatar'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteIcon from '@mui/icons-material/Delete'
// import { useForm, Controller } from 'react-hook-form'
// import { addProduct } from '~/services/productService'
// import useCategories from '~/hooks/useCategories'
// import AddCategoryModal from '~/pages/admin/CategorieManagement/modal/AddCategoryModal'
// import StyleAdmin from '~/assets/StyleAdmin.jsx'
//
// const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
// const CloudinaryProduct = 'product_upload'
// const CloudinaryColor = 'color_upload' // Thêm folder riêng cho ảnh màu
//
// const uploadToCloudinary = async (file, folder = CloudinaryProduct) => {
//   const formData = new FormData()
//   formData.append('file', file)
//   formData.append('upload_preset', 'demo_unsigned')
//   formData.append('folder', folder)
//
//   const res = await fetch(URI, {
//     method: 'POST',
//     body: formData
//   })
//
//   const data = await res.json()
//   return data.secure_url
// }
//
// const AddProductModal = ({ open, onClose, onSuccess }) => {
//   const {
//     control,
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting }
//   } = useForm({
//     defaultValues: {
//       name: '',
//       description: '',
//       price: '',
//       image: [],
//       categoryId: '',
//       quantity: '',
//       slug: '',
//       orgin: '',
//       colors: []
//     }
//   })
//
//   const [images, setImages] = useState([{ file: null, preview: '' }])
//   const { categories, loading, fetchCategories } = useCategories()
//   const [categoryOpen, setCategoryOpen] = useState(false)
//   const [colorInput, setColorInput] = useState('')
//   const [colorImage, setColorImage] = useState(null)
//   const [colorImagePreview, setColorImagePreview] = useState('')
//   const [colorList, setColorList] = useState([])
//   const fileInputRefs = useRef([])
//   const colorFileInputRef = useRef(null)
//
//   const handleImageChange = (index, file) => {
//     const newImages = [...images]
//     newImages[index] = { file, preview: URL.createObjectURL(file) }
//
//     if (index === images.length - 1 && file && newImages.length < 9) {
//       newImages.push({ file: null, preview: '' })
//     }
//
//     setImages(newImages)
//   }
//
//   const handleRemoveImage = (index) => {
//     const newImages = [...images]
//     newImages.splice(index, 1)
//     if (newImages.length === 0 || newImages[newImages.length - 1].file) {
//       newImages.push({ file: null, preview: '' })
//     }
//     setImages(newImages)
//   }
//
//   const handleColorImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setColorImage(file)
//       setColorImagePreview(URL.createObjectURL(file))
//     }
//   }
//
//   const handleAddColor = async (e) => {
//     e.preventDefault()
//     if (colorInput.trim() && colorImage) {
//       try {
//         const imageUrl = await uploadToCloudinary(colorImage, CloudinaryColor)
//         setColorList([
//           ...colorList,
//           { name: colorInput.trim(), image: imageUrl }
//         ])
//         setColorInput('')
//         setColorImage(null)
//         setColorImagePreview('')
//         if (colorFileInputRef.current) {
//           colorFileInputRef.current.value = '' // Reset input file
//         }
//       } catch (error) {
//         console.error('Lỗi khi upload ảnh màu:', error)
//         alert('Không thể upload ảnh màu, vui lòng thử lại')
//       }
//     } else {
//       alert('Vui lòng nhập tên màu và chọn ảnh')
//     }
//   }
//
//   const handleRemoveColor = (colorToRemove) => {
//     setColorList(colorList.filter((color) => color.name !== colorToRemove.name))
//   }
//
//   const onSubmit = async (data) => {
//     try {
//       const imageUrls = []
//       for (const img of images) {
//         if (img.file) {
//           const url = await uploadToCloudinary(img.file)
//           imageUrls.push(url)
//         }
//       }
//
//       const result = await addProduct({
//         name: data.name,
//         description: data.description,
//         price: Number(data.price),
//         image: imageUrls,
//         categoryId: data.categoryId,
//         quantity: Number(data.quantity),
//         origin: data.orgin || '',
//         colors: colorList // Gửi mảng colorList với cấu trúc [{ name, image }]
//       })
//
//       if (result) {
//         onSuccess()
//         onClose()
//         reset()
//         setImages([{ file: null, preview: '' }])
//         setColorList([])
//         setColorInput('')
//         setColorImage(null)
//         setColorImagePreview('')
//       } else {
//         alert('Thêm sản phẩm không thành công')
//       }
//     } catch (error) {
//       console.error('Lỗi khi thêm sản phẩm:', error)
//       alert('Có lỗi xảy ra, vui lòng thử lại')
//     }
//   }
//
//   useEffect(() => {
//     if (open) fetchCategories()
//   }, [open])
//
//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         fullWidth
//         maxWidth='xl'
//         PaperProps={{ sx: { mt: 8, maxHeight: '90vh', width: '90vw' } }}
//         BackdropProps={{
//           sx: StyleAdmin.OverlayModal
//         }}
//       >
//         <DialogTitle>Thêm Sản Phẩm</DialogTitle>
//         <Divider />
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent sx={{ display: 'flex', gap: 2, overflowY: 'auto' }}>
//             <Box sx={{ flex: 2 }}>
//               <TextField
//                 label='Tên sản phẩm'
//                 fullWidth
//                 margin='normal'
//                 {...register('name', {
//                   required: 'Tên sản phẩm không được bỏ trống'
//                 })}
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//                 sx={StyleAdmin.InputCustom}
//               />
//               <TextField
//                 label='Mô tả'
//                 fullWidth
//                 multiline
//                 rows={3}
//                 margin='normal'
//                 {...register('description', {
//                   required: 'Mô tả không được bỏ trống'
//                 })}
//                 error={!!errors.description}
//                 helperText={errors.description?.message}
//                 sx={StyleAdmin.InputCustom}
//               />
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <TextField
//                   label='Giá (VNĐ)'
//                   type='number'
//                   fullWidth
//                   margin='normal'
//                   {...register('price', {
//                     required: 'Giá không được bỏ trống'
//                   })}
//                   error={!!errors.price}
//                   helperText={errors.price?.message}
//                   sx={StyleAdmin.InputCustom}
//                 />
//                 <TextField
//                   label='Số lượng'
//                   type='number'
//                   fullWidth
//                   margin='normal'
//                   {...register('quantity', {
//                     required: 'Số lượng không được bỏ trống'
//                   })}
//                   error={!!errors.quantity}
//                   helperText={errors.quantity?.message}
//                   sx={StyleAdmin.InputCustom}
//                 />
//               </Box>
//               <Box sx={{ mt: 2 }}>
//                 <TextField
//                   label='Xuất xứ'
//                   fullWidth
//                   multiline
//                   rows={3}
//                   margin='normal'
//                   sx={StyleAdmin.InputCustom}
//                 />
//                 {/*màu*/}
//                 <Typography variant='subtitle1' sx={{ mb: 1 }}>
//                   Màu sắc
//                 </Typography>
//                 <Box
//                   sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}
//                 >
//                   <TextField
//                     label='Tên màu sắc'
//                     value={colorInput}
//                     onChange={(e) => setColorInput(e.target.value)}
//                     sx={StyleAdmin.InputCustom}
//                     style={{ flex: 1 }}
//                   />
//                   <Button
//                     variant='outlined'
//                     component='label'
//                     sx={{
//                       height: '56px',
//                       borderColor: '#000',
//                       color: '#000'
//                     }}
//                   >
//                     Chọn ảnh
//                     <input
//                       type='file'
//                       accept='image/*'
//                       hidden
//                       ref={colorFileInputRef}
//                       onChange={handleColorImageChange}
//                     />
//                   </Button>
//                   <Button
//                     variant='contained'
//                     onClick={handleAddColor}
//                     disabled={!colorInput.trim() || !colorImage}
//                     sx={{ backgroundColor: '#001f5d', height: '56px' }}
//                   >
//                     Thêm
//                   </Button>
//                 </Box>
//                 {colorImagePreview && (
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant='caption'>Xem trước ảnh:</Typography>
//                     <Box
//                       component='img'
//                       src={colorImagePreview}
//                       alt='color-preview'
//                       sx={{
//                         width: '100px',
//                         height: '100px',
//                         objectFit: 'cover',
//                         borderRadius: 1
//                       }}
//                     />
//                   </Box>
//                 )}
//                 <List sx={{ maxHeight: '150px', overflowY: 'auto' }}>
//                   {colorList.map((color, index) => (
//                     <ListItem
//                       key={index}
//                       secondaryAction={
//                         <IconButton
//                           edge='end'
//                           onClick={() => handleRemoveColor(color)}
//                         >
//                           <DeleteIcon sx={{ color: '#f44336' }} />
//                         </IconButton>
//                       }
//                     >
//                       <ListItemAvatar>
//                         <Avatar
//                           src={color.image}
//                           alt={color.name}
//                           sx={{ width: 40, height: 40 }}
//                         />
//                       </ListItemAvatar>
//                       <ListItemText primary={color.name} />
//                     </ListItem>
//                   ))}
//                 </List>
//               </Box>
//               <FormControl
//                 fullWidth
//                 margin='normal'
//                 error={!!errors.categoryId}
//                 sx={StyleAdmin.FormSelect}
//               >
//                 <InputLabel>Danh mục</InputLabel>
//                 <Controller
//                   name='categoryId'
//                   control={control}
//                   rules={{ required: 'Danh mục không được bỏ trống' }}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       label='Danh mục'
//                       value={field.value}
//                       disabled={loading}
//                       MenuProps={{
//                         PaperProps: { sx: StyleAdmin.FormSelect.SelectMenu }
//                       }}
//                     >
//                       {categories
//                         ?.filter((c) => !c.destroy)
//                         .map((cat) => (
//                           <MenuItem key={cat._id} value={cat._id}>
//                             {cat.name}
//                           </MenuItem>
//                         ))}
//                       <MenuItem onClick={() => setCategoryOpen(true)}>
//                         Thêm danh mục mới
//                       </MenuItem>
//                     </Select>
//                   )}
//                 />
//                 <Typography variant='caption' color='error'>
//                   {errors.categoryId?.message}
//                 </Typography>
//               </FormControl>
//             </Box>
//
//             <Box sx={{ flex: 1 }}>
//               <Typography variant='subtitle1' sx={{ mb: 1 }}>
//                 Hình ảnh sản phẩm (tối đa 9 ảnh)
//               </Typography>
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
//                   gap: 2
//                 }}
//               >
//                 {images.map((img, index) => (
//                   <Box key={index} sx={{ position: 'relative' }}>
//                     <input
//                       type='file'
//                       accept='image/*'
//                       hidden
//                       ref={(el) => (fileInputRefs.current[index] = el)}
//                       onChange={(e) =>
//                         handleImageChange(index, e.target.files[0])
//                       }
//                     />
//                     <Box
//                       sx={{
//                         width: '100%',
//                         height: '150px',
//                         borderRadius: 1,
//                         border: '1px solid #000',
//                         overflow: 'hidden',
//                         position: 'relative',
//                         '&:hover .overlay, &:hover .overlay-bg': { opacity: 1 }
//                       }}
//                     >
//                       {img.preview ? (
//                         <>
//                           <Box
//                             component='img'
//                             src={img.preview}
//                             alt={`preview-${index}`}
//                             sx={{
//                               width: '100%',
//                               height: '100%',
//                               objectFit: 'cover'
//                             }}
//                           />
//                           <Box
//                             className='overlay-bg'
//                             sx={{
//                               position: 'absolute',
//                               top: 0,
//                               left: 0,
//                               width: '100%',
//                               height: '100%',
//                               backgroundColor: 'rgba(0,0,0,0.3)',
//                               opacity: 0,
//                               transition: 'opacity 0.3s',
//                               zIndex: 1
//                             }}
//                           />
//                           <Box
//                             sx={{
//                               position: 'absolute',
//                               top: 5,
//                               left: 5,
//                               zIndex: 2,
//                               opacity: 0,
//                               transition: 'opacity 0.3s'
//                             }}
//                             className='overlay'
//                           >
//                             <IconButton
//                               size='small'
//                               onClick={() =>
//                                 fileInputRefs.current[index]?.click()
//                               }
//                             >
//                               <EditIcon
//                                 sx={{ fontSize: 18, color: '#2196f3' }}
//                               />
//                             </IconButton>
//                           </Box>
//                           <Box
//                             sx={{
//                               position: 'absolute',
//                               top: 5,
//                               right: 5,
//                               zIndex: 2,
//                               opacity: 0,
//                               transition: 'opacity 0.3s'
//                             }}
//                             className='overlay'
//                           >
//                             <IconButton
//                               size='small'
//                               onClick={() => handleRemoveImage(index)}
//                             >
//                               <DeleteIcon
//                                 sx={{ fontSize: 18, color: '#f44336' }}
//                               />
//                             </IconButton>
//                           </Box>
//                         </>
//                       ) : (
//                         <Button
//                           variant='outlined'
//                           component='label'
//                           sx={{
//                             width: '100%',
//                             height: '100%',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             borderColor: '#000',
//                             color: '#000',
//                             fontSize: '12px'
//                           }}
//                         >
//                           Thêm ảnh
//                           <input
//                             type='file'
//                             accept='image/*'
//                             hidden
//                             onChange={(e) =>
//                               handleImageChange(index, e.target.files[0])
//                             }
//                           />
//                         </Button>
//                       )}
//                     </Box>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           </DialogContent>
//           <Divider />
//           <DialogActions sx={{ padding: '16px 24px' }}>
//             <Button onClick={onClose} color='inherit'>
//               Hủy
//             </Button>
//             <Button
//               type='submit'
//               variant='contained'
//               sx={{ backgroundColor: '#001f5d' }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Đang thêm...' : 'Thêm'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//
//       <AddCategoryModal
//         open={categoryOpen}
//         onClose={() => setCategoryOpen(false)}
//         onAdded={fetchCategories}
//       />
//     </>
//   )
// }
//
// export default AddProductModal

import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hooks/admin/useCategories.js'
import AddSizeModal from './modalColorAddProduct/AddSizeModal'
import AddStockModal from './modalColorAddProduct/AddStockModal'
import AddCategoryModal from '~/pages/admin/CategorieManagement/modal/AddCategoryModal.jsx'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { addProduct } from '~/services/admin/productService.js'
const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const CloudinaryColor = 'color_upload' // folder riêng cho ảnh màu
const CloudinaryProduct = 'product_upload' // folder riêng cho ảnh sản phẩm

const uploadToCloudinary = async (file, folder = CloudinaryColor) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', folder)

  const res = await fetch(URI, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('Upload thất bại')

  const data = await res.json()
  return data.secure_url
}

const AddProductModal = ({ open, onClose, onSuccess }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: '',
      importPrice: '',
      exportPrice: ''
    }
  })

  const [colorsList, setColorsList] = useState([])
  const [sizesList, setSizesList] = useState([])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [isSizeModalOpen, setSizeModalOpen] = useState(false)
  const [isStockModalOpen, setStockModalOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [stockMatrix, setStockMatrix] = useState([])

  // State cho màu sắc
  const [colorName, setColorName] = useState('')
  const [colorFile, setColorFile] = useState(null)
  const [colorPreview, setColorPreview] = useState('')
  const [isAddingColor, setIsAddingColor] = useState(false)

  // State cho ảnh sản phẩm
  const [productImages, setProductImages] = useState([]) // Danh sách ảnh sản phẩm
  const [productImageFile, setProductImageFile] = useState(null)
  const [productImagePreview, setProductImagePreview] = useState('')
  const [isAddingProductImage, setIsAddingProductImage] = useState(false)

  const fileInputRef = useRef() // Ref cho ảnh màu
  const productImageInputRef = useRef() // Ref cho ảnh sản phẩm

  const { categories, loading, fetchCategories } = useCategories()

  useEffect(() => {
    if (open) {
      fetchCategories()
      reset()
      setColorsList([])
      setSizesList([])
      setSelectedColor('')
      setSelectedSize('')
      setStockMatrix([])
      setColorName('')
      setColorFile(null)
      setColorPreview('')
      setProductImages([]) // Reset ảnh sản phẩm
      setProductImageFile(null)
      setProductImagePreview('')
    }
  }, [open, reset])

  // Xử lý chọn file ảnh màu và preview
  const handleColorFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setColorFile(file)
      setColorPreview(URL.createObjectURL(file))
    }
  }

  // Xử lý chọn file ảnh sản phẩm và preview
  const handleProductImageFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductImageFile(file)
      setProductImagePreview(URL.createObjectURL(file))
    }
  }

  // Xử lý thêm màu (upload ảnh lên Cloudinary)
  const handleAddColor = async () => {
    if (!colorName.trim() || !colorFile) {
      alert('Vui lòng nhập tên màu và chọn ảnh')
      return
    }
    setIsAddingColor(true)
    try {
      const imageUrl = await uploadToCloudinary(colorFile, CloudinaryColor)
      setColorsList((prev) => [
        ...prev,
        { name: colorName.trim(), image: imageUrl }
      ])
      setColorName('')
      setColorFile(null)
      setColorPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      alert('Upload ảnh màu thất bại, vui lòng thử lại')
      console.error(err)
    } finally {
      setIsAddingColor(false)
    }
  }

  // Xử lý thêm ảnh sản phẩm (upload lên Cloudinary)
  const handleAddProductImage = async () => {
    if (!productImageFile) {
      alert('Vui lòng chọn ảnh sản phẩm')
      return
    }
    setIsAddingProductImage(true)
    try {
      const imageUrl = await uploadToCloudinary(
        productImageFile,
        CloudinaryProduct
      )
      setProductImages((prev) => [...prev, imageUrl])
      setProductImageFile(null)
      setProductImagePreview('')
      if (productImageInputRef.current) productImageInputRef.current.value = ''
    } catch (err) {
      alert('Upload ảnh sản phẩm thất bại, vui lòng thử lại')
      console.error(err)
    } finally {
      setIsAddingProductImage(false)
    }
  }

  // Xóa màu trong danh sách
  const handleRemoveColor = (index) => {
    setColorsList((prev) => prev.filter((_, i) => i !== index))
    if (selectedColor === colorsList[index]?.name) setSelectedColor('')
  }

  // Xóa ảnh sản phẩm
  const handleRemoveProductImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Thêm size
  const handleAddSize = (sizeName) => {
    if (!sizeName || typeof sizeName !== 'string' || !sizeName.trim()) return
    setSizesList((prev) => [...prev, { name: sizeName }])
  }

  // Xóa size
  const handleRemoveSize = (index) => {
    setSizesList((prev) => prev.filter((_, i) => i !== index))
    if (selectedSize === sizesList[index]?.name) setSelectedSize('')
  }

  // Thêm kho
  const handleAddStock = (quantity) => {
    if (!selectedColor || !selectedSize) return
    setStockMatrix((prev) => [
      ...prev,
      { color: selectedColor, size: selectedSize, quantity }
    ])
    setSelectedColor('')
    setSelectedSize('')
  }

  // Xóa kho
  const handleRemoveStock = (index) => {
    setStockMatrix((prev) => prev.filter((_, i) => i !== index))
  }

  // Lưu sản phẩm
  const onSubmit = async (data) => {
    try {
      // Validation: Đảm bảo có ít nhất một ảnh sản phẩm
      if (productImages.length === 0) {
        alert('Vui lòng thêm ít nhất một ảnh sản phẩm')
        return
      }

      // Validation: Đảm bảo có ít nhất một màu
      if (colorsList.length === 0) {
        alert('Vui lòng thêm ít nhất một màu sắc')
        return
      }

      // Validation: Đảm bảo có ít nhất một kích thước
      if (sizesList.length === 0) {
        alert('Vui lòng thêm ít nhất một kích thước')
        return
      }

      // Validation: Đảm bảo có ít nhất một mục trong stockMatrix
      if (stockMatrix.length === 0) {
        alert('Vui lòng thêm ít nhất một mục kho')
        return
      }

      // Tạo đối tượng finalProduct
      const finalProduct = {
        name: data.name,
        description: data.description,
        price: Number(data.price), // Chuyển sang số
        importPrice: data.importPrice ? Number(data.importPrice) : undefined, // Chuyển sang số hoặc undefined nếu không có
        categoryId: data.categoryId,
        image: productImages, // Danh sách URL ảnh sản phẩm
        colors: colorsList, // [{ name, image }]
        sizes: sizesList, // [{ name }]
        stockMatrix // [{ color, size, quantity }]
      }

      console.log('Final Product:', finalProduct)

      // Gửi yêu cầu API
      const result = await addProduct(finalProduct)

      if (result) {
        onSuccess() // Gọi callback thành công
        onClose() // Đóng modal
        reset() // Reset form
        setColorsList([])
        setSizesList([])
        setStockMatrix([])
        setProductImages([])
        setColorName('')
        setColorFile(null)
        setColorPreview('')
        setProductImageFile(null)
        setProductImagePreview('')
      } else {
        alert('Thêm sản phẩm không thành công')
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Thêm sản phẩm</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name='name'
              control={control}
              rules={{ required: 'Tên sản phẩm không được bỏ trống' }}
              render={({ field }) => (
                <TextField
                  label='Tên sản phẩm'
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Mô tả'
                  fullWidth
                  multiline
                  rows={3}
                  {...field}
                />
              )}
            />
          </Grid>

          {/* Phần thêm ảnh sản phẩm */}
          <Grid item xs={12}>
            <Typography variant='h6'>Thêm ảnh sản phẩm</Typography>
            <Grid container spacing={1} alignItems='center'>
              <Grid item xs={6}>
                <Button variant='outlined' component='label'>
                  Chọn ảnh sản phẩm
                  <input
                    type='file'
                    accept='image/*'
                    hidden
                    ref={productImageInputRef}
                    onChange={handleProductImageFileChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant='contained'
                  onClick={handleAddProductImage}
                  disabled={isAddingProductImage || !productImageFile}
                >
                  {isAddingProductImage ? 'Đang thêm...' : 'Thêm ảnh'}
                </Button>
              </Grid>
              <Grid item xs={3}>
                {productImagePreview && (
                  <Box
                    component='img'
                    src={productImagePreview}
                    alt='preview-product-image'
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )}
              </Grid>
            </Grid>
            {/* Danh sách ảnh sản phẩm */}
            <Box sx={{ mt: 2 }}>
              {productImages.length > 0 && (
                <ul style={{ paddingLeft: 20 }}>
                  {productImages.map((image, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <img
                        src={image}
                        alt={`product-image-${idx}`}
                        style={{
                          width: 30,
                          height: 30,
                          objectFit: 'cover',
                          marginRight: 8
                        }}
                      />
                      Ảnh {idx + 1}
                      <Button
                        size='small'
                        color='error'
                        onClick={() => handleRemoveProductImage(idx)}
                        sx={{ ml: 1 }}
                      >
                        Xóa
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin='normal' error={!!errors.categoryId}>
              <InputLabel>Danh mục</InputLabel>
              <Controller
                name='categoryId'
                control={control}
                rules={{ required: 'Danh mục không được bỏ trống' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Danh mục'
                    value={field.value || ''}
                    disabled={loading}
                    MenuProps={{
                      PaperProps: { sx: StyleAdmin.FormSelect.SelectMenu }
                    }}
                  >
                    {categories
                      ?.filter((c) => !c.destroy)
                      .map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    <MenuItem onClick={() => setCategoryOpen(true)}>
                      Thêm danh mục mới
                    </MenuItem>
                  </Select>
                )}
              />
              <Typography variant='caption' color='error'>
                {errors.categoryId?.message}
              </Typography>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <Controller
              name='price'
              control={control}
              rules={{ required: 'Giá bán không được bỏ trống' }}
              render={({ field }) => (
                <TextField
                  label='Giá bán'
                  fullWidth
                  type='number'
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              name='importPrice'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Giá nhập'
                  fullWidth
                  type='number'
                  {...field}
                />
              )}
            />
          </Grid>
          {/* Phần thêm màu */}
          <Grid item xs={12}>
            <Typography variant='h6'>Thêm màu sắc</Typography>
            <Grid container spacing={1} alignItems='center'>
              <Grid item xs={4}>
                <TextField
                  label='Tên màu'
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant='outlined' component='label'>
                  Chọn ảnh
                  <input
                    type='file'
                    accept='image/*'
                    hidden
                    ref={fileInputRef}
                    onChange={handleColorFileChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant='contained'
                  onClick={handleAddColor}
                  disabled={isAddingColor}
                >
                  {isAddingColor ? 'Đang thêm...' : 'Thêm màu'}
                </Button>
              </Grid>
              <Grid item xs={2}>
                {colorPreview && (
                  <Box
                    component='img'
                    src={colorPreview}
                    alt='preview-color'
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )}
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              {colorsList.length > 0 && (
                <ul style={{ paddingLeft: 20 }}>
                  {colorsList.map((color, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <img
                        src={color.image}
                        alt={color.name}
                        style={{
                          width: 30,
                          height: 30,
                          objectFit: 'cover',
                          marginRight: 8
                        }}
                      />
                      {color.name}
                      <Button
                        size='small'
                        color='error'
                        onClick={() => handleRemoveColor(idx)}
                        sx={{ ml: 1 }}
                      >
                        Xóa
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          </Grid>

          {/* Phần thêm kích thước */}
          <Grid item xs={6}>
            <Button variant='outlined' onClick={() => setSizeModalOpen(true)}>
              Thêm kích thước
            </Button>
            {sizesList.length > 0 && (
              <ul style={{ paddingLeft: 20 }}>
                {sizesList.map((size, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {size.name}
                    <Button
                      size='small'
                      color='error'
                      onClick={() => handleRemoveSize(idx)}
                      sx={{ ml: 1 }}
                    >
                      Xóa
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Grid>

          {/* Chọn màu và kích thước để thêm kho */}
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Màu</InputLabel>
              <Select
                value={selectedColor}
                label='Màu'
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <MenuItem value=''>
                  <em>Chọn màu</em>
                </MenuItem>
                {colorsList.map((color, idx) => (
                  <MenuItem key={idx} value={color.name}>
                    {color.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Kích thước</InputLabel>
              <Select
                value={selectedSize}
                label='Kích thước'
                onChange={(e) => setSelectedSize(e.target.value)}
                renderValue={(selected) => selected || 'Chọn kích thước'}
              >
                <MenuItem value=''>
                  <em>Chọn kích thước</em>
                </MenuItem>
                {sizesList.map((size, idx) => (
                  <MenuItem key={idx} value={size.name}>
                    {size.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 1 }}>
              <Button
                variant='contained'
                onClick={() => setStockModalOpen(true)}
                disabled={!selectedColor || !selectedSize}
              >
                Thêm kho
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              {stockMatrix.length > 0 && (
                <ul style={{ paddingLeft: 20 }}>
                  {stockMatrix.map((stock, idx) => (
                    <li key={idx}>
                      Màu: {stock.color} - Size: {stock.size} - Số lượng:{' '}
                      {stock.quantity}
                      <Button
                        size='small'
                        color='error'
                        onClick={() => handleRemoveStock(idx)}
                        sx={{ ml: 1 }}
                      >
                        Xóa
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Hủy
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant='contained'>
          Lưu
        </Button>
      </DialogActions>

      <AddSizeModal
        open={isSizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        onSave={(sizeObj) => {
          if (!sizesList.some((s) => s.name === sizeObj.name))
            handleAddSize(sizeObj.name)
          setSizeModalOpen(false)
        }}
      />
      <AddStockModal
        open={isStockModalOpen}
        onClose={() => setStockModalOpen(false)}
        onSave={(quantity) => {
          handleAddStock(quantity)
          setStockModalOpen(false)
        }}
      />
      <AddCategoryModal
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        onSave={() => {
          setCategoryOpen(false)
          fetchCategories()
        }}
      />
    </Dialog>
  )
}

export default AddProductModal

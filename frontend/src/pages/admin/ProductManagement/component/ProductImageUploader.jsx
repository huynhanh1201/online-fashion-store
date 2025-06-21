// components/common/ProductImages.jsx
import React, { useRef, useState } from 'react'
import { Box, Grid, IconButton, Typography, Tooltip } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import CircularProgress from '@mui/material/CircularProgress'
const ProductImages = ({
  productImages,
  setProductImages,
  productImagePreview,
  setProductImagePreview,
  onUpload,
  maxImages = 9
}) => {
  const productImageInputRef = useRef(null)
  const productImageEditInputRef = useRef(null)
  const editImageIndexRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  // const handleFileChange = async (e) => {
  //   const files = Array.from(e.target.files || [])
  //   const remainingSlots = maxImages - productImages.length
  //   if (files.length > remainingSlots) {
  //     alert(`Bạn chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa.`)
  //     return
  //   }
  //   try {
  //     const uploadedUrls = await Promise.all(
  //       files.map((file) => onUpload(file))
  //     )
  //     setProductImages((prev) => [...prev, ...uploadedUrls])
  //     setProductImagePreview((prev) => [...prev, ...uploadedUrls])
  //   } catch {
  //     alert('Lỗi khi upload ảnh.')
  //   }
  //   if (productImageInputRef.current) productImageInputRef.current.value = ''
  // }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = maxImages - productImages.length
    if (files.length > remainingSlots) {
      alert(`Bạn chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa.`)
      return
    }
    setIsUploading(true)
    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => onUpload(file))
      )
      setProductImages((prev) => [...prev, ...uploadedUrls])
      setProductImagePreview((prev) => [...prev, ...uploadedUrls])
    } catch {
      alert('Lỗi khi upload ảnh.')
    } finally {
      setIsUploading(false)
      if (productImageInputRef.current) productImageInputRef.current.value = ''
    }
  }

  const handleEditImage = (index) => {
    editImageIndexRef.current = index
    productImageEditInputRef.current?.click()
  }

  // const handleEditFileChange = async (e) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return
  //   try {
  //     const uploadedUrl = await onUpload(file)
  //     const index = editImageIndexRef.current
  //     if (index !== null) {
  //       const updated = [...productImages]
  //       updated[index] = uploadedUrl
  //       setProductImages(updated)
  //
  //       const updatedPreview = [...productImagePreview]
  //       updatedPreview[index] = uploadedUrl
  //       setProductImagePreview(updatedPreview)
  //     }
  //   } catch {
  //     alert('Lỗi khi sửa ảnh.')
  //   }
  //   if (productImageEditInputRef.current)
  //     productImageEditInputRef.current.value = ''
  // }

  const handleEditFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const uploadedUrl = await onUpload(file)
      const index = editImageIndexRef.current
      if (index !== null) {
        const updated = [...productImages]
        updated[index] = uploadedUrl
        setProductImages(updated)

        const updatedPreview = [...productImagePreview]
        updatedPreview[index] = uploadedUrl
        setProductImagePreview(updatedPreview)
      }
    } catch {
      alert('Lỗi khi sửa ảnh.')
    } finally {
      setIsUploading(false)
      if (productImageEditInputRef.current)
        productImageEditInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
    setProductImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddClick = () => {
    productImageInputRef.current?.click()
  }

  const renderImageItem = (image, idx) => (
    <Grid item xs={6} sm={4} md={3} key={idx}>
      <Box
        sx={{
          position: 'relative',
          border: '1px solid #ddd',
          borderRadius: 2,
          overflow: 'hidden',
          height: 150,
          width: 150,
          background: '#dcdcdc'
        }}
      >
        <Box
          component='img'
          loading='lazy'
          loading='lazy'
          src={optimizeCloudinaryUrl(image || '')}
          alt={`Ảnh sản phẩm ${idx + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 40,
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 1
          }}
        >
          <Tooltip title='Sửa'>
            <IconButton size='small' onClick={() => handleEditImage(idx)}>
              <EditIcon fontSize='small' color='warning' />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 1
          }}
        >
          <Tooltip title='Xoá'>
            <IconButton size='small' onClick={() => handleRemoveImage(idx)}>
              <DeleteIcon fontSize='small' color='error' />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Grid>
  )

  const renderAddBox = () => (
    <Grid item xs={6} sm={4} md={3}>
      <Box
        onClick={isUploading ? undefined : handleAddClick} // Không gọi hàm khi đang upload
        sx={{
          cursor: isUploading ? 'not-allowed' : 'pointer',
          border: '2px dashed #aaa',
          borderRadius: 2,
          height: 150,
          width: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: isUploading ? '#bbb' : '#888',
          opacity: isUploading ? 0.6 : 1,
          pointerEvents: isUploading ? 'none' : 'auto', // Ngăn sự kiện click hoàn toàn
          '&:hover': {
            borderColor: isUploading ? '#aaa' : '#1976d2',
            color: isUploading ? '#888' : '#1976d2',
            backgroundColor: isUploading ? 'transparent' : '#f5faff'
          }
        }}
      >
        {isUploading ? (
          <>
            <CircularProgress size={32} />
            <Typography variant='body2' sx={{ mt: 1 }}>
              Đang thêm ảnh
            </Typography>
          </>
        ) : (
          <>
            <AddPhotoAlternateIcon fontSize='large' />
            <Typography variant='body2'>Thêm ảnh</Typography>
          </>
        )}
      </Box>
    </Grid>
  )

  return (
    <Box>
      <Typography variant='h6' mb={2}>
        Ảnh sản phẩm
      </Typography>
      <Box sx={{ maxHeight: 320, overflowY: 'auto', pr: 1 }}>
        <Grid container spacing={2}>
          {productImages.map((img, idx) => renderImageItem(img, idx))}
          {productImages.length < maxImages && renderAddBox()}
        </Grid>
      </Box>

      {/* Hidden input để upload ảnh mới */}
      <input
        type='file'
        accept='image/*'
        multiple
        hidden
        ref={productImageInputRef}
        onChange={handleFileChange}
      />

      {/* Hidden input để sửa ảnh */}
      <input
        type='file'
        accept='image/*'
        hidden
        ref={productImageEditInputRef}
        onChange={handleEditFileChange}
      />
    </Box>
  )
}

export default ProductImages

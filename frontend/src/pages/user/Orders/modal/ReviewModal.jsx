import React, { useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Grid,
  Card,
  CardMedia,
  Alert,
  LinearProgress,
  Stack,
  Tooltip,
  Snackbar,
  CircularProgress
} from '@mui/material'
import {
  PhotoCamera,
  Videocam,
  Delete
} from '@mui/icons-material'

import {
  CLOUD_NAME,
  CloudinaryVideoFolder,
  CloudinaryImageFolder
} from '~/utils/constants'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const uploadToCloudinary = async (file, folder = CloudinaryImageFolder) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', folder)

  const isVideo = file.type.startsWith('video/')
  const resourceType = isVideo ? 'video' : 'image'

  // Tạo URL động theo loại file
  const uploadURL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`

  console.log('Uploading to Cloudinary:', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    folder: folder,
    resourceType: resourceType,
    uploadURL: uploadURL
  })

  const res = await fetch(uploadURL, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    console.error('Upload failed with status:', res.status)
    const errorData = await res.json().catch(() => ({}))
    console.error('Error details:', errorData)
    throw new Error('Upload thất bại')
  }

  const data = await res.json()
  console.log('Cloudinary response:', data)
  return data.secure_url
}

// Function to generate video thumbnail from Cloudinary URL
const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return null
  // Convert video URL to thumbnail URL
  // Example: https://res.cloudinary.com/demo/video/upload/v1234/folder/video.mp4
  // To: https://res.cloudinary.com/demo/video/upload/so_0,w_200,h_120,c_fill,f_jpg/v1234/folder/video.jpg
  return videoUrl
    .replace('/video/upload/', '/video/upload/so_0,w_200,h_120,c_fill,f_jpg/')
    .replace(/\.(mp4|webm|ogg)$/, '.jpg')
}

const ReviewModal = ({
  open,
  onClose,
  onSubmit,
  orderItems,
  productId,
  userId,
  orderId
}) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false) // State for submit loading
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  })
  const inputRef = useRef(null)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)


  const capitalizeFirstLetter = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const formatSize = (str) => {
    if (!str) return ''
    return str.toUpperCase()
  }
  // Constants for file limits
  const MAX_IMAGES = 5
  const MAX_VIDEOS = 2
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024 // 50MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

  // Snackbar helper function
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    } else {
      setRating(0)
      setComment('')
      setImages([])
      setVideos([])
      setUploading(false)
      setSubmitting(false) // Reset submit loading
      setSnackbar({ open: false, message: '', severity: 'info' })
    }
  }, [open])

  // Handle comment change
  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  // Handle image upload
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)

    if (images.length + files.length > MAX_IMAGES) {
      showSnackbar(`Chỉ được upload tối đa ${MAX_IMAGES} ảnh`, 'warning')
      return
    }

    const validFiles = files.filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showSnackbar(
          `File ${file.name} không đúng định dạng. Chỉ chấp nhận: JPG, PNG, WebP`,
          'error'
        )
        return false
      }
      if (file.size > MAX_IMAGE_SIZE) {
        showSnackbar(
          `File ${file.name} quá lớn. Kích thước tối đa: 5MB`,
          'error'
        )
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)

    try {
      // Upload từng file lên Cloudinary
      const uploadPromises = validFiles.map(async (file) => {
        try {
          // Tạo preview trước
          const preview = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.readAsDataURL(file)
          })

          // Upload lên Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(
            file,
            CloudinaryImageFolder
          )

          // Thêm vào danh sách với URL từ Cloudinary
          const newImage = {
            id: Date.now() + Math.random(),
            url: cloudinaryUrl,
            preview: preview, // Giữ preview để hiển thị ngay
            name: file.name,
            size: file.size
          }

          console.log('New image object:', newImage)
          setImages((prev) => [...prev, newImage])
          return newImage
        } catch (error) {
          console.error('Lỗi upload ảnh:', error)
          showSnackbar(
            `Không thể upload ảnh ${file.name}. Vui lòng thử lại.`,
            'error'
          )
          throw error
        }
      })

      const results = await Promise.allSettled(uploadPromises)
      const successCount = results.filter(
        (result) => result.status === 'fulfilled'
      ).length
      const failureCount = results.filter(
        (result) => result.status === 'rejected'
      ).length

      if (successCount > 0) {
        showSnackbar(
          `Upload thành công ${successCount} ảnh${failureCount > 0 ? `, ${failureCount} ảnh thất bại` : ''}!`,
          'success'
        )
      }
    } catch (error) {
      console.error('Lỗi xử lý upload:', error)
      showSnackbar('Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.', 'error')
    } finally {
      setUploading(false)
    }

    // Reset input
    event.target.value = ''
  }

  // Handle video upload
  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files)

    if (videos.length + files.length > MAX_VIDEOS) {
      showSnackbar(`Chỉ được upload tối đa ${MAX_VIDEOS} video`, 'warning')
      return
    }

    const validFiles = files.filter((file) => {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        showSnackbar(
          `File ${file.name} không đúng định dạng. Chỉ chấp nhận: MP4, WebM, OGG`,
          'error'
        )
        return false
      }
      if (file.size > MAX_VIDEO_SIZE) {
        showSnackbar(
          `File ${file.name} quá lớn. Kích thước tối đa: 10MB`,
          'error'
        )
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)

    try {
      // Upload từng file lên Cloudinary
      const uploadPromises = validFiles.map(async (file) => {
        try {
          // Upload lên Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(
            file,
            CloudinaryVideoFolder
          )

          // Thêm vào danh sách với URL từ Cloudinary
          const newVideo = {
            id: Date.now() + Math.random(),
            url: cloudinaryUrl,
            name: file.name,
            size: file.size
          }

          console.log('New video object:', newVideo)
          setVideos((prev) => [...prev, newVideo])
          return newVideo
        } catch (error) {
          console.error('Lỗi upload video:', error)
          showSnackbar(
            `Không thể upload video ${file.name}. Vui lòng thử lại.`,
            'error'
          )
          throw error
        }
      })

      const results = await Promise.allSettled(uploadPromises)
      const successCount = results.filter(
        (result) => result.status === 'fulfilled'
      ).length
      const failureCount = results.filter(
        (result) => result.status === 'rejected'
      ).length

      if (successCount > 0) {
        showSnackbar(
          `Upload thành công ${successCount} video${failureCount > 0 ? `, ${failureCount} video thất bại` : ''}!`,
          'success'
        )
      }
    } catch (error) {
      console.error('Lỗi xử lý upload:', error)
      showSnackbar('Có lỗi xảy ra khi upload video. Vui lòng thử lại.', 'error')
    } finally {
      setUploading(false)
    }

    // Reset input
    event.target.value = ''
  }

  // Remove image
  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  // Remove video
  const removeVideo = (id) => {
    setVideos((prev) => prev.filter((vid) => vid.id !== id))
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async () => {
    if (rating && comment.trim() && !submitting) {
      setSubmitting(true)
      try {
        await onSubmit({
          productId,
          userId,
          rating,
          comment: comment,
          orderId,
          images: images.map((img) => img.url),
          videos: videos.map((vid) => vid.url)
        })
      } catch (error) {
        console.error('Error submitting review:', error)
      } finally {
        setSubmitting(false)
      }
    }
  }

  const isSubmitDisabled =
    !rating || !comment.trim() || uploading || submitting

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '70vh' // hoặc 60vh, tuỳ bạn muốn thấp bao nhiêu
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem', pb: 1 }}>
        Đánh Giá Sản Phẩm
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Product Display */}
        {orderItems?.length > 0 && (
          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
              mb: 3,
              pr: 1
            }}
          >
            {orderItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                  p: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Avatar
                  src={
                    item?.color?.image
                      ? optimizeCloudinaryUrl(item.color.image, {
                        width: 64,
                        height: 64
                      })
                      : '/default.jpg'
                  }
                  variant='rounded'
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography fontWeight={600} fontSize='1rem'>
                    {capitalizeFirstLetter(item?.name) || 'Sản phẩm'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Phân loại hàng: {capitalizeFirstLetter(item.color?.name)}, {formatSize(item.size)}
                  </Typography>
                  <Chip
                    label={`Số lượng: ${item.quantity}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Rating Section */}
        <Box mb={3}>
          <Typography
            variant='h6'
            fontWeight='600'
            color='var(--primary-color)'
            gutterBottom
          >
            Chất lượng sản phẩm
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size='large'
            sx={{ mb: 1 }}
          />
          <Typography variant='body2' color='text.secondary'>
            Vui lòng đánh giá từ 1-5 sao
          </Typography>
        </Box>

        {/* Comment Section with EditContent Filter */}
        <Box mb={3}>
          <Typography
            variant='h6'
            fontWeight='600'
            color='var(--primary-color)'
            gutterBottom
          >
            Nhận xét của bạn
          </Typography>

          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            placeholder='Hãy chia sẻ trải nghiệm của bạn với sản phẩm này... (Tránh chia sẻ thông tin cá nhân)'
            variant='outlined'
            helperText={`${comment.length}/500 ký tự`}
            inputProps={{ maxLength: 500 }}
          />
        </Box>

        {/* Media Upload Section */}
        <Box>
          <Typography
            variant='h6'
            fontWeight='600'
            color='var(--primary-color)'
            gutterBottom
          >
            Thêm ảnh và video (không bắt buộc)
          </Typography>

          {/* Upload Progress */}
          {uploading && (
            <Box mb={2}>
              <LinearProgress />
              <Typography variant='caption' color='text.secondary'>
                Đang tải lên...
              </Typography>
            </Box>
          )}

          {/* Upload Buttons */}
          <Stack direction='row' spacing={2} mb={2}>
            <input
              ref={imageInputRef}
              type='file'
              accept='image/jpeg,image/png,image/webp'
              multiple
              hidden
              onChange={handleImageUpload}
            />
            <input
              ref={videoInputRef}
              type='file'
              accept='video/mp4,video/webm,video/ogg'
              multiple
              hidden
              onChange={handleVideoUpload}
            />

            <Tooltip title={`Tối đa ${MAX_IMAGES} ảnh, mỗi ảnh < 5MB`}>
              <Button
                variant='outlined'
                startIcon={<PhotoCamera />}
                onClick={() => imageInputRef.current?.click()}
                disabled={images.length >= MAX_IMAGES || uploading}
                sx={{ textTransform: 'none' }}
              >
                Thêm ảnh ({images.length}/{MAX_IMAGES})
              </Button>
            </Tooltip>

            <Tooltip title={`Tối đa ${MAX_VIDEOS} video, mỗi video < 10MB`}>
              <Button
                variant='outlined'
                startIcon={<Videocam />}
                onClick={() => videoInputRef.current?.click()}
                disabled={videos.length >= MAX_VIDEOS || uploading}
                sx={{ textTransform: 'none' }}
              >
                Thêm video ({videos.length}/{MAX_VIDEOS})
              </Button>
            </Tooltip>
          </Stack>

          {/* Media Preview */}
          <Grid container spacing={2}>
            {/* Images */}
            {images.map((image) => (
              <Grid item xs={6} sm={4} md={3} key={image.id}>
                <Card sx={{ position: 'relative', width: 180 }}>
                  <CardMedia
                    component='img'
                    width='180'
                    height='120'
                    image={
                      image.url
                        ? optimizeCloudinaryUrl(image.url, {
                          width: 180,
                          height: 120
                        })
                        : image.preview
                    }
                    alt={image.name}
                    sx={{
                      objectFit: 'cover',
                      width: 180,
                      height: 120
                    }}
                  />
                  <IconButton
                    size='small'
                    onClick={() => removeImage(image.id)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <Delete fontSize='small' />
                  </IconButton>
                  <Box p={1}>
                    <Typography variant='caption' noWrap>
                      {image.name}
                    </Typography>
                    <Typography
                      variant='caption'
                      display='block'
                      color='text.secondary'
                    >
                      {formatFileSize(image.size)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}

            {/* Videos */}
            {videos.map((video) => (
              <Grid item xs={6} sm={4} md={3} key={video.id}>
                <Card sx={{ position: 'relative', width: 180 }}>
                  {video.url ? (
                    <CardMedia
                      component='img'
                      width='180'
                      height='120'
                      image={getVideoThumbnail(video.url)}
                      alt={video.name}
                      sx={{
                        objectFit: 'cover',
                        position: 'relative',
                        width: 180,
                        height: 120
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 180,
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'grey.100'
                      }}
                    >
                      <Videocam sx={{ fontSize: 40, color: 'grey.500' }} />
                    </Box>
                  )}
                  {/* Video play overlay */}
                  {video.url && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Videocam sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                  )}
                  <IconButton
                    size='small'
                    onClick={() => removeVideo(video.id)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <Delete fontSize='small' />
                  </IconButton>
                  <Box p={1}>
                    <Typography variant='caption' noWrap>
                      {video.name}
                    </Typography>
                    <Typography
                      variant='caption'
                      display='block'
                      color='text.secondary'
                    >
                      {formatFileSize(video.size)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Upload Guidelines */}
          <Alert severity='info' sx={{ mt: 2 }}>
            <Typography variant='body2'>
              <strong>Hướng dẫn:</strong>
            </Typography>
            <ul
              style={{
                margin: '4px 0',
                paddingLeft: '20px',
                fontSize: '0.875rem'
              }}
            >
              <li>Ảnh: JPG, PNG, WebP - Tối đa 5MB/ảnh</li>
              <li>Video: MP4, WebM, OGG - Tối đa 10MB/video</li>
              <li>Chỉ upload ảnh/video liên quan đến sản phẩm</li>
              <li>Không upload nội dung nhạy cảm hoặc vi phạm</li>
            </ul>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          color='inherit'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          color='primary'
          variant='contained'
          disabled={isSubmitDisabled}
          startIcon={submitting ? <CircularProgress size={16} /> : null}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {submitting ? 'Đang gửi...' : uploading ? 'Đang tải...' : 'Gửi đánh giá'}
        </Button>
      </DialogActions>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  )
}

export default ReviewModal

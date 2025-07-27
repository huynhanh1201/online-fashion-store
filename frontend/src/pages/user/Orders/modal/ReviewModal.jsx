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

const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return null
  return videoUrl
    .replace('/video/upload/', '/video/upload/so_0,w_200,h_150,c_fill,f_jpg/')
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
  const [submitting, setSubmitting] = useState(false)
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

  const MAX_IMAGES = 5
  const MAX_VIDEOS = 2
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

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
      setSubmitting(false)
      setSnackbar({ open: false, message: '', severity: 'info' })
    }
  }, [open])

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

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
      const uploadPromises = validFiles.map(async (file) => {
        try {
          const preview = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.readAsDataURL(file)
          })

          const cloudinaryUrl = await uploadToCloudinary(
            file,
            CloudinaryImageFolder
          )

          const newImage = {
            id: Date.now() + Math.random(),
            url: cloudinaryUrl,
            preview: preview,
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

    event.target.value = ''
  }

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
      const uploadPromises = validFiles.map(async (file) => {
        try {
          const cloudinaryUrl = await uploadToCloudinary(
            file,
            CloudinaryVideoFolder
          )

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

    event.target.value = ''
  }

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const removeVideo = (id) => {
    setVideos((prev) => prev.filter((vid) => vid.id !== id))
  }

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
          maxHeight: { xs: '80vh', sm: '85vh', md: '90vh' },
          width: { xs: '95%', sm: '90%', md: '80%' },
          m: { xs: 1, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{
        fontWeight: 'bold',
        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
        pb: 1
      }}>
        Đánh Giá Sản Phẩm
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {orderItems?.length > 0 && (
          <Box
            sx={{
              maxHeight: { xs: 120, sm: 160, md: 200 },
              overflowY: 'auto',
              mb: 2,
              pr: 1
            }}
          >
            {orderItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                  p: { xs: 1, sm: 1.5, md: 2 },
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Avatar
                  src={
                    item?.color?.image
                      ? optimizeCloudinaryUrl(item.color.image, {
                        width: 48,
                        height: 48
                      })
                      : '/default.jpg'
                  }
                  variant='rounded'
                  sx={{ width: { xs: 40, sm: 48, md: 56 }, height: { xs: 40, sm: 48, md: 56 } }}
                />
                <Box>
                  <Typography
                    fontWeight={600}
                    fontSize={{ xs: '0.85rem', sm: '0.95rem', md: '1rem' }}
                  >
                    {capitalizeFirstLetter(item?.name) || 'Sản phẩm'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' } }}
                  >
                    Phân loại hàng: {capitalizeFirstLetter(item.color?.name)}, {formatSize(item.size)}
                  </Typography>
                  <Chip
                    label={`Số lượng: ${item.quantity}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' }, height: { xs: 16, sm: 18 } }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Box mb={2}>
          <Typography
            variant='h6'
            fontWeight='600'
            color='var(--primary-color)'
            gutterBottom
            fontSize={{ xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }}
          >
            Chất lượng sản phẩm
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size='large'
            sx={{ mb: 1 }}
          />
          <Typography
            variant='body2'
            color='text.secondary'
            fontSize={{ xs: '0.75rem', sm: '0.85rem', md: '0.875rem' }}
          >
            Vui lòng đánh giá từ 1-5 sao
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography
            variant='h6'
            fontWeight='600'
            color='var(--primary-color)'
            gutterBottom
            fontSize={{ xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }}
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
            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}
          />
        </Box>

        <Box>
          <Typography
            variant='h6'
            fontWeight='600'
            color='var(--primary-color)'
            gutterBottom
            fontSize={{ xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }}
          >
            Thêm ảnh và video (không bắt buộc)
          </Typography>

          {uploading && (
            <Box mb={2}>
              <LinearProgress />
              <Typography
                variant='caption'
                color='text.secondary'
                fontSize={{ xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }}
              >
                Đang tải lên...
              </Typography>
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            mb={2}
          >
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
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' },
                  ml: { xs: 0, sm: 1 }
                }}
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
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' }
                }}
              >
                Thêm video ({videos.length}/{MAX_VIDEOS})
              </Button>
            </Tooltip>
          </Stack>

          <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            {images.map((image) => (
              <Grid item xs={6} sm={4} md={3} key={image.id}>
                <Card sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  maxWidth: { xs: '150px', sm: '180px', md: '200px' }
                }}>
                  <CardMedia
                    component='img'
                    image={
                      image.url
                        ? optimizeCloudinaryUrl(image.url, {
                          width: 200,
                          height: 150
                        })
                        : image.preview
                    }
                    alt={image.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
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
                    <Typography
                      variant='caption'
                      noWrap
                      fontSize={{ xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }}
                    >
                      {image.name}
                    </Typography>
                    <Typography
                      variant='caption'
                      display='block'
                      color='text.secondary'
                      fontSize={{ xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }}
                    >
                      {formatFileSize(image.size)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}

            {videos.map((video) => (
              <Grid item xs={6} sm={4} md={3} key={video.id}>
                <Card sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  maxWidth: { xs: '150px', sm: '180px', md: '200px' }
                }}>
                  {video.url ? (
                    <CardMedia
                      component="img"
                      image={getVideoThumbnail(video.url)}
                      alt={video.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'grey.100',
                      }}
                    >
                      <Videocam sx={{ fontSize: { xs: 28, sm: 32, md: 40 }, color: 'grey.500' }} />
                    </Box>
                  )}
                  {video.url && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Videocam sx={{ fontSize: { xs: 20, sm: 22, md: 24 }, color: 'white' }} />
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
                    <Typography
                      variant='caption'
                      noWrap
                      fontSize={{ xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }}
                    >
                      {video.name}
                    </Typography>
                    <Typography
                      variant='caption'
                      display='block'
                      color='text.secondary'
                      fontSize={{ xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }}
                    >
                      {formatFileSize(video.size)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity='info' sx={{ mt: 2 }}>
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' }, mb: 1 }}
            >
              Hướng dẫn:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' } }}>
              <li>Ảnh: JPG, PNG, WebP - Tối đa 5MB/ảnh</li>
              <li>Video: MP4, WebM, OGG - Tối đa 10MB/video</li>
              <li>Chỉ upload ảnh/video liên quan đến sản phẩm</li>
              <li>Không upload nội dung nhạy cảm hoặc vi phạm</li>
            </Box>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          color='inherit'
          variant='outlined'
          sx={{
            textTransform: 'none',
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' }
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          color='primary'
          variant='contained'
          disabled={isSubmitDisabled}
          startIcon={submitting ? <CircularProgress size={14} /> : null}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' }
          }}
        >
          {submitting ? 'Đang gửi...' : uploading ? 'Đang tải...' : 'Gửi đánh giá'}
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: { xs: 6, sm: 8, md: 12 } }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' } }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  )
}

export default ReviewModal
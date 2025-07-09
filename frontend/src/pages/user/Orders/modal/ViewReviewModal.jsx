import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Rating,
  Avatar,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Grid,
  Card,
  CardMedia,
  Backdrop
} from '@mui/material'
import {
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon,
  Videocam as VideocamIcon
} from '@mui/icons-material'
import { getUserReviewForProduct } from '~/services/reviewService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const ViewReviewModal = ({ open, onClose, userId, productId, orderId, productName }) => {
  const [loading, setLoading] = useState(false)
  const [reviewData, setReviewData] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchReview = async () => {
      if (!open || !userId || !productId || !orderId) return

      setLoading(true)
      try {
        const response = await getUserReviewForProduct(userId, productId, orderId)
        if (response && response.length > 0) {
          setReviewData(response[0]) // Lấy review đầu tiên
        }
      } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReview()
  }, [open, userId, productId, orderId])

  const handleClose = () => {
    setReviewData(null)
    setSelectedImage(null)
    setLightboxOpen(false)
    onClose()
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setLightboxOpen(true)
  }

  const handleCloseLightbox = () => {
    setLightboxOpen(false)
    setSelectedImage(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // const getVideoThumbnail = (videoUrl) => {
  //   // Tạo thumbnail từ video URL (Cloudinary)
  //   if (videoUrl.includes('cloudinary')) {
  //     return videoUrl.replace('/video/upload/', '/video/upload/so_auto/')
  //   }
  //   return videoUrl
  // }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2, position: 'relative' }}>
        <Typography variant="h6" fontWeight="600" color="var(--primary-color)">
          Đánh giá của bạn
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {productName}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            minWidth: 'auto',
            p: 1
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : reviewData ? (
          <Stack spacing={3}>
            {/* Rating và thời gian */}
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Rating
                  value={reviewData.rating}
                  readOnly
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#ffc107'
                    }
                  }}
                />
                <Typography variant="h6" fontWeight="600" color="var(--primary-color)">
                  {reviewData.rating}/5
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Đánh giá vào {formatDate(reviewData.createdAt)}
              </Typography>
            </Box>

            <Divider />

            {/* Nội dung đánh giá */}
            {reviewData.comment && (
              <Box>
                <Typography variant="subtitle1" fontWeight="600" mb={1}>
                  Nhận xét:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: 'grey.50',
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    lineHeight: 1.6
                  }}
                >
                  {reviewData.comment}
                </Typography>
              </Box>
            )}

            {/* Media đánh giá */}
            {((reviewData.images && reviewData.images.length > 0) ||
              (reviewData.videos && reviewData.videos.length > 0)) && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="600" mb={2}>
                    Ảnh & Video của bạn ({(reviewData.images?.length || 0) + (reviewData.videos?.length || 0)}):
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Hiển thị ảnh */}
                    {reviewData.images?.map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={`image-${index}`}>
                        <Card
                          sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: 3
                            },
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => handleImageClick(image)}
                        >
                          <CardMedia
                            component="img"
                            width="180"
                            height="120"
                            image={optimizeCloudinaryUrl(image, {
                              width: 180,
                              height: 120
                            })}
                            alt={`Đánh giá ${index + 1}`}
                            sx={{
                              objectFit: 'cover',
                              width: 180,
                              height: 120
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}

                    {/* Hiển thị video */}
                    {reviewData.videos?.map((video, index) => (
                      <Grid item xs={6} sm={4} md={3} key={`video-${index}`}>
                        <Card
                          sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: 3
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CardMedia
                            component="video"
                            width="180"
                            height="120"
                            src={video}
                            controls
                            sx={{
                              objectFit: 'cover',
                              width: 180,
                              height: 120
                            }}
                          />
                          {/* Video overlay icon */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <VideocamIcon sx={{ fontSize: 16, color: 'white' }} />
                            <Typography variant="caption" color="white">
                              Video
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

            {/* Trạng thái đánh giá */}
            <Box display="flex" gap={1}>
              <Chip
                label="Đã đánh giá"
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
              {reviewData.moderationStatus && (
                <Chip
                  label={
                    reviewData.moderationStatus === 'approved' ? 'Đã duyệt' :
                      reviewData.moderationStatus === 'pending' ? 'Chờ duyệt' :
                        'Bị từ chối'
                  }
                  color={
                    reviewData.moderationStatus === 'approved' ? 'success' :
                      reviewData.moderationStatus === 'pending' ? 'warning' :
                        'error'
                  }
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Stack>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography color="text.secondary">
              Không tìm thấy đánh giá của bạn cho sản phẩm này
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: 'var(--primary-color)',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              backgroundColor: 'var(--accent-color)'
            }
          }}
        >
          Đóng
        </Button>
      </DialogActions>

      {/* Image Lightbox */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          backgroundColor: 'rgba(0, 0, 0, 0.9)'
        }}
        open={lightboxOpen}
        onClick={handleCloseLightbox}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {selectedImage && (
            <>
              <img
                src={optimizeCloudinaryUrl(selectedImage, {
                  width: 1200,
                  height: 800,
                  quality: 'auto'
                })}
                alt="Xem ảnh lớn"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
              />
              {/* <Button
                onClick={handleCloseLightbox}
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  minWidth: 'auto',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                  }
                }}
              >
                <CloseIcon />
              </Button> */}
            </>
          )}
        </Box>
      </Backdrop>
    </Dialog>
  )
}

export default ViewReviewModal
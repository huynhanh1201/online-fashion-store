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
  Backdrop,
} from '@mui/material'
import {
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon,
  Videocam as VideocamIcon,
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
        console.log('Response from getUserReviewForProduct:', response, 'for orderId:', orderId)

        if (response && response.length > 0) {
          const reviewForOrder = response.find((review) => review.orderId === orderId)
          if (reviewForOrder) {
            console.log('Found review for orderId:', orderId, reviewForOrder)
            setReviewData(reviewForOrder)
          } else {
            console.warn(
              'Không tìm thấy review cho orderId:',
              orderId,
              'Available reviews:',
              response.map((r) => ({ id: r.id, orderId: r.orderId }))
            )
            setReviewData(response[0])
          }
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
      minute: '2-digit',
    })
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          m: { xs: 1, sm: 2 },
          maxHeight: { xs: '85vh', sm: '85vh', md: '80vh' },
          width: { xs: '95%', sm: '90%', md: '80%' },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          position: 'relative',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="600"
          color="var(--primary-color)"
          sx={{
            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
            lineHeight: 1.2,
          }}
        >
          Đánh giá của bạn
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' } }}
        >
          {productName}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: { xs: 4, sm: 8 },
            top: { xs: 4, sm: 8 },
            minWidth: 'auto',
            p: { xs: 0.5, sm: 1 },
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: 18, sm: 22, md: 24 } }} />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ py: { xs: 1, sm: 2, md: 3 }, px: { xs: 2, sm: 3, md: 4 } }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={32} />
          </Box>
        ) : reviewData ? (
          <Stack spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            <Box>
              <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5, md: 2 }} mb={1}>
                <Rating
                  value={reviewData.rating}
                  readOnly
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#ffc107',
                    },
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight="600"
                  color="var(--primary-color)"
                  sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' } }}
                >
                  {reviewData.rating}/5
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' } }}
              >
                Đánh giá vào {formatDate(reviewData.createdAt)}
              </Typography>
            </Box>

            <Divider />

            {reviewData.comment && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  mb={1}
                  sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}
                >
                  Nhận xét:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: 'grey.50',
                    p: { xs: 1, sm: 1.5, md: 2 },
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    lineHeight: 1.6,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  }}
                >
                  {reviewData.comment}
                </Typography>
              </Box>
            )}

            {((reviewData.images && reviewData.images.length > 0) ||
              (reviewData.videos && reviewData.videos.length > 0)) && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    mb={2}
                    sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}
                  >
                    Ảnh & Video của bạn (
                    {(reviewData.images?.length || 0) + (reviewData.videos?.length || 0)}):
                  </Typography>
                  <Grid
                    container
                    spacing={{ xs: 1, sm: 1.5, md: 2 }}
                    sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
                  >
                    {reviewData.images?.map((image, index) => (
                      <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={`image-${index}`}
                      >
                        <Card
                          sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: 3,
                            },
                            transition: 'all 0.2s ease',
                            aspectRatio: '4/3',
                            width: '100%',
                            maxWidth: { xs: '150px', sm: '180px', md: '200px' },
                            overflow: 'hidden',
                          }}
                          onClick={() => handleImageClick(image)}
                        >
                          <CardMedia
                            component="img"
                            image={optimizeCloudinaryUrl(image, {
                              width: 200,
                              height: 150,
                              crop: 'fill',
                            })}
                            alt={`Đánh giá ${index + 1}`}
                            sx={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}

                    {reviewData.videos?.map((video, index) => (
                      <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={`video-${index}`}
                      >
                        <Card
                          sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: 3,
                            },
                            transition: 'all 0.2s ease',
                            aspectRatio: '4/3',
                            width: '100%',
                            maxWidth: { xs: '150px', sm: '180px', md: '200px' },
                            overflow: 'hidden',
                          }}
                        >
                          <CardMedia
                            component="video"
                            src={video}
                            controls
                            sx={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                            }}
                          />
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
                              gap: 0.5,
                            }}
                          >
                            <VideocamIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, color: 'white' }} />
                            <Typography
                              variant="caption"
                              color="white"
                              sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' } }}
                            >
                              Video
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

            <Box display="flex" gap={1}>
              <Chip
                label="Đã đánh giá"
                color="success"
                size="small"
                sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}
              />
            </Box>
          </Stack>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
            >
              Không tìm thấy đánh giá của bạn cho sản phẩm này
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, sm: 2, md: 2 }, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: 'var(--primary-color)',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 0.5, sm: 0.75, md: 1 },
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' },
            '&:hover': {
              backgroundColor: 'var(--accent-color)',
            },
          }}
        >
          Đóng
        </Button>
      </DialogActions>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
        open={lightboxOpen}
        onClick={handleCloseLightbox}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: { xs: '90vw', sm: '85vw', md: '80vw' },
            maxHeight: { xs: '90vh', sm: '85vh', md: '80vh' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selectedImage && (
            <img
              src={optimizeCloudinaryUrl(selectedImage, {
                width: 1200,
                height: 800,
                quality: 'auto',
                crop: 'fit',
              })}
              alt="Xem ảnh lớn"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: { xs: 4, sm: 6, md: 8 },
              }}
            />
          )}
        </Box>
      </Backdrop>
    </Dialog>
  )
}

export default ViewReviewModal    
import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
  Grid
} from '@mui/material'
import {
  Verified as VerifiedIcon,
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material'
import { getReviews } from '~/services/reviewService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import { Link } from 'react-router-dom'

const ProductReview = ({ productId, avgRating = 0 }) => {
  const [reviews, setReviews] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await getReviews(productId, 1, 5) // page 1, limit 5

        // response giờ có cấu trúc {data: [...], meta: {...}}
        const reviewsData = response.data || []
        const metaData = response.meta || {}

        // API đã filter những review đã được duyệt (moderationStatus=approved)
        setReviews(reviewsData)
        setTotalReviews(metaData.total || 0)
        setTotalPages(metaData.totalPages || 1)
        setCurrentPage(1)
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá:', err)
      } finally {
        setLoading(false)
      }
    }
    if (productId) fetchReviews()
  }, [productId])

  const loadMoreReviews = async () => {
    if (loading || currentPage >= totalPages) return

    try {
      setLoading(true)
      const nextPage = currentPage + 1
      const response = await getReviews(productId, nextPage, 5)

      const reviewsData = response.data || []
      // API đã filter những review đã được duyệt (moderationStatus=approved)

      setReviews((prev) => [...prev, ...reviewsData])
      setCurrentPage(nextPage)
    } catch (err) {
      console.error('Lỗi khi tải thêm đánh giá:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
  }

  const handleVideoClick = (videoUrl) => {
    setSelectedVideo(videoUrl)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
    setSelectedVideo(null)
  }

  return (
    <Box sx={{ maxWidth: '100%', mt: 1 }}>
      <Typography
        variant='h5'
        gutterBottom
        sx={{ color: '#1A3C7B', fontWeight: 600 }}
      >
        Đánh giá & nhận xét
      </Typography>

      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Typography
          variant='subtitle1'
          sx={{ color: '#1A3C7B', fontWeight: 600, fontSize: '3.4rem' }}
        >
          {avgRating}
        </Typography>
        <Rating value={Number(avgRating)} precision={0.1} readOnly />
        <Typography variant='subtitle1' sx={{ color: '#1A3C7B' }}>
          ({totalReviews} đánh giá)
        </Typography>
      </Box>

      <List>
        {reviews.map((review) => (
          <React.Fragment key={review._id}>
            <Divider />
            <ListItem disablePadding alignItems='flex-start' sx={{ mt: 3 }}>
              <ListItemAvatar>
                <Avatar src={review.userId?.avatarUrl || '/default.jpg'} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    display='flex'
                    alignItems='center'
                    gap={1}
                    flexWrap='wrap'
                  >
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      sx={{ color: '#1A3C7B' }}
                    >
                      {review.userId?.name || 'Ẩn danh'}
                    </Typography>
                    {review.isVerified && (
                      <Chip
                        icon={<VerifiedIcon />}
                        label='Đã mua hàng'
                        size='small'
                        color='success'
                        variant='outlined'
                      />
                    )}
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Rating
                      value={review.rating}
                      readOnly
                      size='small'
                      sx={{ color: '#faaf00', mb: 1 }}
                    />
                    <Typography
                      variant='body2'
                      color='text.primary'
                      sx={{ mb: 1 }}
                      component='div'
                    >
                      {review.comment}
                    </Typography>

                    {/* Hiển thị media đánh giá (video đầu tiên + ảnh) */}
                    {((review.videos && review.videos.length > 0) ||
                      (review.images && review.images.length > 0)) && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ mb: 1, display: 'block' }}
                        >
                          Ảnh và video đánh giá:
                        </Typography>
                        <Grid container spacing={1}>
                          {/* Hiển thị video đầu tiên nếu có */}
                          {review.videos && review.videos.length > 0 && (
                            <Grid item key='video-0'>
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: 120,
                                  height: 80,
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  border: '1px solid #ddd',
                                  '&:hover': {
                                    opacity: 0.8
                                  }
                                }}
                                onClick={() =>
                                  handleVideoClick(review.videos[0])
                                }
                              >
                                <video
                                  src={review.videos[0]}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <PlayArrowIcon
                                    sx={{ color: 'white', fontSize: 20 }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          )}

                          {/* Hiển thị tất cả ảnh */}
                          {review.images &&
                            review.images.map((image, index) => (
                              <Grid item key={`image-${index}`}>
                                <Box
                                  component='img'
                                  src={optimizeCloudinaryUrl(image)}
                                  alt={`Review image ${index + 1}`}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    border: '1px solid #ddd',
                                    '&:hover': {
                                      opacity: 0.8
                                    }
                                  }}
                                  onClick={() => handleImageClick(image)}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Box>
                    )}

                    <Typography variant='caption' color='text.secondary'>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {/* <Divider variant='inset' component='li' /> */}
          </React.Fragment>
        ))}
      </List>

      {/* Nút xem thêm */}
      {currentPage < totalPages && (
        <Box display='flex' justifyContent='center' mt={3} mb={2}>
          <Button
            variant='outlined'
            onClick={loadMoreReviews}
            disabled={loading}
            sx={{
              color: '#1A3C7B',
              borderColor: '#1A3C7B',
              '&:hover': {
                borderColor: '#1A3C7B',
                backgroundColor: 'rgba(26, 60, 123, 0.04)'
              }
            }}
          >
            {loading ? 'Đang tải...' : 'Xem thêm đánh giá'}
          </Button>
        </Box>
      )}

      {/* Modal hiển thị ảnh phóng to */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseModal}
        maxWidth='md'
        fullWidth
      >
        <DialogContent
          sx={{ p: 0, position: 'relative', margin: 0, display: 'flex' }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Box
              component='img'
              src={selectedImage}
              alt='Review image'
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block',
                margin: 0
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal hiển thị video */}
      <Dialog
        open={!!selectedVideo}
        onClose={handleCloseModal}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            m: 0,
            overflow: 'hidden',
            '& .MuiDialogContent-root': {
              p: '0 !important',
              m: '0 !important',
              paddingBottom: '0 !important'
            }
          }
        }}
      >
        <DialogContent
          sx={{
            p: '0 !important',
            position: 'relative',
            margin: '0 !important',
            display: 'block',
            lineHeight: 0,
            fontSize: 0,
            overflow: 'hidden'
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedVideo && (
            <Box
              component='video'
              src={selectedVideo}
              controls
              autoPlay
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                display: 'block',
                margin: 0,
                padding: 0,
                border: 'none',
                outline: 'none',
                verticalAlign: 'top',
                lineHeight: 0,
                marginBottom: '-1px'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ProductReview

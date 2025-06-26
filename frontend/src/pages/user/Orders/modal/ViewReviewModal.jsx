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
  Divider
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { getUserReviewForProduct } from '~/services/reviewService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const ViewReviewModal = ({ open, onClose, userId, productId, orderId, productName }) => {
  const [loading, setLoading] = useState(false)
  const [reviewData, setReviewData] = useState(null)

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
    onClose()
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
        <Typography variant="h6" fontWeight="600" color="#1a3c7b">
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
                <Typography variant="h6" fontWeight="600" color="#1a3c7b">
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

            {/* Hình ảnh đánh giá */}
            {reviewData.images && reviewData.images.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="600" mb={2}>
                  Hình ảnh ({reviewData.images.length}):
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {reviewData.images.map((image, index) => (
                    <Avatar
                      key={index}
                      src={optimizeCloudinaryUrl(image)}
                      alt={`Đánh giá ${index + 1}`}
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: 'grey.200',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: '#1a3c7b',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      variant="rounded"
                    />
                  ))}
                </Box>
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
            backgroundColor: '#1a3c7b',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              backgroundColor: '#162f63'
            }
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewReviewModal
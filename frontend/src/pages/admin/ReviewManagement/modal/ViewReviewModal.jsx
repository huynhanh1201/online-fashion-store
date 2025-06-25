import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Stack,
  Avatar
} from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const formatDate = (date) => {
  if (!date) return 'Không xác định'
  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const ViewReviewModal = ({ open, onClose, review, onApprove }) => {
  const handleApprove = () => {
    if (review && review._id) {
      onApprove(review._id, { moderationStatus: 'approved' })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Chi tiết đánh giá</DialogTitle>
      <Divider />
      <DialogContent sx={{ maxHeight: '70vh' }}>
        {review ? (
          <Box display='flex' flexDirection='column' gap={2}>
            <Box>
              <Typography variant='subtitle2' fontWeight='bold'>
                Nội dung đánh giá
              </Typography>
              <Typography>{review.comment || 'Không có nội dung'}</Typography>
            </Box>

            <Box>
              <Typography variant='subtitle2' fontWeight='bold'>
                Số sao
              </Typography>
              <Typography>{review.rating}/5</Typography>
            </Box>

            <Box>
              <Typography variant='subtitle2' fontWeight='bold'>
                Trạng thái kiểm duyệt
              </Typography>
              <Chip
                label={
                  review.moderationStatus === 'approved'
                    ? 'Đã duyệt'
                    : review.moderationStatus === 'rejected'
                      ? 'Bị từ chối'
                      : 'Chờ duyệt'
                }
                color={
                  review.moderationStatus === 'approved'
                    ? 'success'
                    : review.moderationStatus === 'rejected'
                      ? 'error'
                      : 'warning'
                }
              />
            </Box>

            {review.moderatedBy && (
              <Box>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Người duyệt
                </Typography>
                <Typography>{review.moderatedBy}</Typography>
              </Box>
            )}

            {review.moderatedAt && (
              <Box>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Ngày duyệt
                </Typography>
                <Typography>{formatDate(review.moderatedAt)}</Typography>
              </Box>
            )}

            <Box>
              <Typography variant='subtitle2' fontWeight='bold'>
                Người đánh giá
              </Typography>
              <Typography>{review.userId || 'Không xác định'}</Typography>
            </Box>

            <Box>
              <Typography variant='subtitle2' fontWeight='bold'>
                Sản phẩm
              </Typography>
              <Typography>{review.productId || 'Không xác định'}</Typography>
            </Box>

            <Box>
              <Typography variant='subtitle2' fontWeight='bold'>
                Đánh giá xác thực
              </Typography>
              <Typography>{review.isVerified ? 'Có' : 'Không'}</Typography>
            </Box>

            {review.images?.length > 0 && (
              <Box>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Ảnh đánh giá
                </Typography>
                <Stack direction='row' spacing={1} flexWrap='wrap'>
                  {review.images.map((img, idx) => (
                    <Avatar
                      key={idx}
                      src={img}
                      variant='rounded'
                      sx={{ width: 72, height: 72 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {review.videos?.length > 0 && (
              <Box>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Video đánh giá
                </Typography>
                <Stack spacing={1}>
                  {review.videos.map((video, idx) => (
                    <video
                      key={idx}
                      src={video}
                      controls
                      width='100%'
                      style={{ maxWidth: 400 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        ) : (
          <Box textAlign='center' color='text.secondary' py={4}>
            <ImageNotSupportedIcon fontSize='large' />
            <Typography>Không có dữ liệu đánh giá</Typography>
          </Box>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='inherit' variant='outlined'>
          Đóng
        </Button>
        {review?.moderationStatus === 'pending' && (
          <Button
            onClick={handleApprove}
            color='primary'
            variant='contained'
            sx={{ textTransform: 'none' }}
          >
            Duyệt
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ViewReviewModal

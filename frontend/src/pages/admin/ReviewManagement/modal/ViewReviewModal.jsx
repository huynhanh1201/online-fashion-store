import React, { useState } from 'react'
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
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import CloseIcon from '@mui/icons-material/Close'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import StarIcon from '@mui/icons-material/Star'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
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
  const [mediaPreview, setMediaPreview] = useState({
    open: false,
    items: [], // danh sách media
    type: '', // 'image' hoặc 'video'
    selectedIndex: 0
  })

  const handleApprove = (type) => {
    if (type === 'approved' && review && review._id) {
      onApprove(review._id, { moderationStatus: 'approved' })
    } else {
      onApprove(review._id, { moderationStatus: 'rejected' })
    }
  }

  const openMedia = (type, src, index = 0) => {
    const items = type === 'image' ? review.images : review.videos
    setMediaPreview({
      open: true,
      type,
      items,
      selectedIndex: index
    })
  }

  const closeMedia = () => {
    setMediaPreview({ open: false, type: '', items: [], selectedIndex: 0 })
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='md'
        BackdropProps={{ sx: StyleAdmin.OverlayModal }}
      >
        <Box>
          <DialogTitle sx={{ pb: 1 }}>Chi tiết đánh giá</DialogTitle>
          <Button
            onClick={onClose}
            color='error'
            variant='outlined'
            sx={{ textTransform: 'none', ml: 3, mb: 2, mt: 0 }}
          >
            Đóng
          </Button>
        </Box>
        <Divider />
        <DialogContent sx={{ maxHeight: '65vh' }}>
          {review ? (
            <>
              {/* Table chứa các thông tin chính */}
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>
                      Sản phẩm
                    </TableCell>
                    <TableCell>
                      {review.productId?.name ||
                        review.productId?._id ||
                        'Không xác định'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Số sao</TableCell>
                    <TableCell>
                      {review.rating}/5{' '}
                      <StarIcon
                        sx={{ color: '#ffb400', fontSize: 18, ml: 0.5 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Người đánh giá
                    </TableCell>
                    <TableCell>
                      {review.userId ? (
                        <Typography>{review.userId.name}</Typography>
                      ) : (
                        'Không xác định'
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Trạng thái kiểm duyệt
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          review.moderationStatus === 'approved'
                            ? 'Đã duyệt'
                            : review.moderationStatus === 'rejected'
                              ? 'Từ chối'
                              : 'Chờ duyệt'
                        }
                        color={
                          review.moderationStatus === 'approved'
                            ? 'success'
                            : review.moderationStatus === 'rejected'
                              ? 'error'
                              : 'warning'
                        }
                        size='large'
                        sx={{ width: '130px', fontWeight: 800 }}
                      />
                    </TableCell>
                  </TableRow>
                  {review.moderatedAt && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Ngày duyệt
                      </TableCell>
                      <TableCell>{formatDate(review.moderatedAt)}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Đánh giá xác thực
                    </TableCell>
                    <TableCell>{review.isVerified ? 'Có' : 'Không'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* Ảnh và Video đánh giá */}
              {(review.images?.length > 0 || review.videos?.length > 0) && (
                <Box mt={2}>
                  <Typography fontWeight='bold' mb={1}>
                    Hình ảnh / Video đánh giá
                  </Typography>
                  <Stack direction='row' spacing={1} flexWrap='wrap'>
                    {/* Ảnh */}
                    {review.images?.map((img, idx) => (
                      <Avatar
                        key={`img-${idx}`}
                        src={optimizeCloudinaryUrl(img || '')}
                        variant='rounded'
                        sx={{
                          width: 100,
                          height: 100,
                          cursor: 'pointer',
                          border: '1px solid #ccc'
                        }}
                        onClick={() => openMedia('image', img)}
                      />
                    ))}
                    {/* Video */}
                    {review.videos?.map((video, idx) => (
                      <Box
                        key={`video-${idx}`}
                        onClick={() => openMedia('video', video)}
                        sx={{
                          width: 100,
                          height: 100,
                          position: 'relative',
                          cursor: 'pointer',
                          border: '1px solid #ccc',
                          backgroundColor: 'var(--surface-color)'
                        }}
                      >
                        <video
                          src={video}
                          muted
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Nội dung đánh giá */}
              <Box mt={2}>
                <Typography fontWeight='bold' mb={1}>
                  Nội dung đánh giá
                </Typography>
                <Typography>{review.comment || 'Không có nội dung'}</Typography>
              </Box>
            </>
          ) : (
            <Box textAlign='center' color='text.secondary' py={4}>
              <ImageNotSupportedIcon fontSize='large' />
              <Typography>Không có dữ liệu đánh giá</Typography>
            </Box>
          )}
        </DialogContent>

        <Divider />
        <DialogActions sx={{ padding: '16px 24px' }}>
          {review?.moderationStatus === 'pending' && (
            <Box>
              <Button
                onClick={() => handleApprove('approved')}
                color='primary'
                variant='contained'
                sx={{
                  backgroundColor: 'var(--primary-color)',
                  color: '#fff',
                  textTransform: 'none',
                  mr: 1,
                  width: 120
                }}
              >
                Duyệt
              </Button>
              <Button
                onClick={handleApprove}
                color='error'
                variant='contained'
                sx={{
                  textTransform: 'none',
                  width: 120
                }}
              >
                không duyệt
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* Fullscreen Media Viewer */}
      <Dialog open={mediaPreview.open} onClose={closeMedia} maxWidth='xl'>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          p={2}
        >
          <Typography fontWeight='bold'>Xem chi tiết</Typography>
          <IconButton onClick={closeMedia}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Dialog open={mediaPreview.open} onClose={closeMedia} maxWidth='xl'>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            p={2}
          >
            <Typography fontWeight='bold'>Xem chi tiết</Typography>
            <IconButton onClick={closeMedia}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <DialogContent sx={{ p: 0 }}>
            {mediaPreview?.items?.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  maxHeight: '90vh',
                  minWidth: '912px',
                  minHeight: '513px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    mediaPreview.type === 'image' ? '#f5f5f5' : '#000'
                }}
              >
                {mediaPreview.type === 'image' ? (
                  <Box
                    component='img'
                    src={optimizeCloudinaryUrl(
                      mediaPreview.items[mediaPreview.selectedIndex]
                    )}
                    alt='Ảnh'
                    loading='lazy'
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '90vh',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <video
                    src={mediaPreview.items[mediaPreview.selectedIndex]}
                    controls
                    autoPlay
                    preload='auto'
                    style={{
                      maxWidth: '100%',
                      maxHeight: '90vh',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Dialog>
    </>
  )
}

export default ViewReviewModal

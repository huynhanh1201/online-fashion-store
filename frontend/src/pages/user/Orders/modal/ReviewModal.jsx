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
} from '@mui/material'

const ReviewModal = ({ open, onClose, onSubmit, orderItems }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    } else {
      setRating(0)
      setComment('')
    }
  }, [open])

  const handleSubmit = () => {
    if (rating && comment.trim()) {
      onSubmit({ rating, comment })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>Đánh Giá Sản Phẩm</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {orderItems?.length > 0 && (
          <Box
            sx={{
              maxHeight: 220,
              minHeight: 160,
              overflowY: 'auto',
              mb: 3,
              pr: 1  // thêm padding phải để tránh che nội dung khi có thanh cuộn
            }}
          >

            {orderItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: '#f7f7f7',
                  borderRadius: 2,
                  p: 2,
                  mb: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <Avatar
                  src={item?.color?.image || '/default.jpg'}
                  variant="rounded"
                  sx={{ width: 72, height: 72 }}
                />
                <Box>
                  <Typography fontWeight={600}>{item?.name || 'Sản phẩm'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phân loại: {item?.color?.name}, {item?.size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Số lượng: x{item.quantity}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Chất lượng sản phẩm
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          size="large"
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Nhận xét của bạn
        </Typography>
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Hãy chia sẻ trải nghiệm của bạn với sản phẩm này..."
          variant="outlined"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Trở Lại
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!rating || !comment.trim()}
        >
          Hoàn Thành
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReviewModal

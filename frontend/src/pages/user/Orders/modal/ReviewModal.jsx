import React, { useState } from 'react'
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
} from '@mui/material'

const ReviewModal = ({ open, onClose, onSubmit, orderItems }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (rating && comment.trim()) {
      onSubmit({ rating, comment }) // Không đóng ở đây, để OrderDetail xử lý xong mới đóng
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Đánh Giá Sản Phẩm</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          {orderItems?.length > 0 && (
            <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2 }}>
              {orderItems.map((item) => (
                <Box key={item._id} sx={{ border: '1px solid #ddd', p: 2, mb: 1, backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={item?.color?.image || '/default.jpg'} variant="square" sx={{ width: 64, height: 64, borderRadius: 1 }} />
                  <Box>
                    <Typography variant="subtitle1">{item?.name || 'Sản phẩm'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phân loại hàng: {item?.color?.name}, {item?.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">x{item.quantity}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Typography variant="subtitle1" gutterBottom>Chất lượng sản phẩm</Typography>
          <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} size="large" />

          <Typography variant="subtitle1" gutterBottom>Nhận xét:</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Trở Lại</Button>
        <Button onClick={handleSubmit} color="error" variant="contained" disabled={!rating || !comment.trim()}>
          Hoàn Thành
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReviewModal

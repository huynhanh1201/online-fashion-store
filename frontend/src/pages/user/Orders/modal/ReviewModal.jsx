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
  // State cho form
  const [rating, setRating] = useState(0)
  const [usage, setUsage] = useState('')
  const [advantages, setAdvantages] = useState('')

  // Xử lý submit
  const handleSubmit = () => {
    if (rating && (usage || advantages)) {
      onSubmit({ rating, usage, advantages })
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Đánh Giá Sản Phẩm</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          {/* Danh sách sản phẩm với thanh cuộn */}
          {orderItems && orderItems.length > 0 ? (
            <Box
              sx={{
                maxHeight: '200px', // Giới hạn chiều cao
                overflowY: 'auto', // Thêm thanh cuộn dọc
                mb: 2
              }}
            >
              {orderItems.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    border: '1px solid #ddd',
                    p: 2,
                    mb: 1,
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={item?.color?.image || '/default.jpg'}
                    variant="square"
                    sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover' }}
                  />
                  <Box>
                    <Typography variant="subtitle1">{item?.name || 'Sản phẩm'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phân loại hàng: {item?.color?.name}, {item?.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      x{item.quantity}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>Không có sản phẩm để đánh giá</Typography>
          )}

          {/* Đánh giá sao */}
          <Typography variant="subtitle1" gutterBottom>
            Chất lượng sản phẩm
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />

          {/* Điểm tốt */}
          <Typography variant="subtitle1" gutterBottom>
            Điểm tốt của sản phẩm:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={advantages}
            onChange={(e) => setAdvantages(e.target.value)}
            placeholder="Hãy chia sẻ nhận xét để bạn tích vẽ sản phẩm này trong những lần mua sắm tiếp theo."
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Trở Lại
        </Button>
        <Button
          onClick={handleSubmit}
          color="error"
          variant="contained"
          disabled={!rating || (!usage && !advantages)}
        >
          Hoàn Thành
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReviewModal
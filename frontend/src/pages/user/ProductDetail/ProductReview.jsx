import React, { useState } from 'react'
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
  Divider
} from '@mui/material'

const ProductReview = () => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: 'Sản phẩm rất tốt!',
      date: '2025-05-31'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      comment: 'Đúng mô tả, sẽ ủng hộ tiếp!',
      date: '2025-05-30'
    }
  ])

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === '') return

    const newReview = {
      id: Date.now(),
      name: 'Bạn',
      avatar: 'https://i.pravatar.cc/150?u=new',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    }

    setReviews([newReview, ...reviews])
    setRating(0)
    setComment('')
  }

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1)

  return (
    <Box
      sx={{
        maxWidth: '100%',
        mx: 'auto',
        p: 4,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid #ddd'
      }}
    >
      <Typography
        variant='h4'
        gutterBottom
        sx={{ color: '#1A3C7B', fontWeight: 600 }}
      >
        Đánh giá sản phẩm
      </Typography>

      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Rating value={Number(averageRating)} precision={0.1} readOnly />
        <Typography variant='subtitle1' sx={{ color: '#1A3C7B' }}>
          ({averageRating}/5 từ {reviews.length} đánh giá)
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant='subtitle1'
          gutterBottom
          sx={{ color: '#1A3C7B', fontWeight: 500 }}
        >
          Đánh giá của bạn
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          sx={{ color: '#faaf00' }}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label='Nhập bình luận'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant='contained'
          onClick={handleSubmit}
          sx={{
            mt: 2,
            backgroundColor: '#1A3C7B',
            '&:hover': { backgroundColor: '#152f61' }
          }}
        >
          Gửi đánh giá
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />
      <Typography
        variant='h5'
        gutterBottom
        sx={{ color: '#1A3C7B', fontWeight: 500 }}
      >
        Danh sách đánh giá
      </Typography>
      <List>
        {reviews.map((review) => (
          <React.Fragment key={review.id}>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar src={review.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display='flex' alignItems='center' gap={1}>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      sx={{ color: '#1A3C7B' }}
                    >
                      {review.name}
                    </Typography>
                    <Rating
                      value={review.rating}
                      readOnly
                      size='small'
                      sx={{ color: '#faaf00' }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant='body2' color='text.primary'>
                      {review.comment}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {review.date}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant='inset' component='li' />
          </React.Fragment>
        ))}
      </List>
    </Box>
  )
}

export default ProductReview

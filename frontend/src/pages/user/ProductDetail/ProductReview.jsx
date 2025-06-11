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
  Divider
} from '@mui/material'
import { getReviews, createReview } from '~/services/reviewService'


const ProductReview = ({ productId }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(productId)
        setReviews(data)
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá:', err)
      }
    }
    if (productId) fetchReviews()
  }, [productId])

  const handleSubmit = async () => {
    if (rating === 0 || comment.trim() === '') return
    try {
      const newReview = {
        productId,
        rating,
        comment
      }
      const saved = await createReview(newReview)
      setReviews([saved, ...reviews])
      setRating(0)
      setComment('')
    } catch (err) {
      console.error('Lỗi gửi đánh giá:', err)
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <Box sx={{ maxWidth: '100%', mt: 1 }}>
      <Typography variant='h5' gutterBottom sx={{ color: '#1A3C7B', fontWeight: 600 }}>
        Đánh giá & nhận xét {productId.name}
      </Typography>

      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Rating value={Number(averageRating)} precision={0.1} readOnly />
        <Typography variant='subtitle1' sx={{ color: '#1A3C7B' }}>
          ({averageRating}/5 từ {reviews.length} đánh giá)
        </Typography>
      </Box>


      <Divider sx={{ mb: 3 }} />
      <Typography variant='h5' gutterBottom sx={{ color: '#1A3C7B', fontWeight: 500 }}>
        Danh sách đánh giá
      </Typography>
      <List>
        {reviews.map((review) => (
          <React.Fragment key={review._id}>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar src={review.user?.avatarUrl || '/default.jpg'} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display='flex' alignItems='center' gap={1}>
                    <Typography variant='subtitle1' fontWeight='bold' sx={{ color: '#1A3C7B' }}>
                      {review.user?.name || 'Ẩn danh'}
                    </Typography>
                    <Rating value={review.rating} readOnly size='small' sx={{ color: '#faaf00' }} />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant='body2' color='text.primary'>
                      {review.comment}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
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

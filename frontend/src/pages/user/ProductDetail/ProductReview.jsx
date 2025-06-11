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
import { getReviews } from '~/services/reviewService'


const ProductReview = ({ productId }) => {
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


  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <Box sx={{ maxWidth: '100%', mt: 1 }}>
      <Typography variant='h5' gutterBottom sx={{ color: '#1A3C7B', fontWeight: 600 }}>
        Đánh giá & nhận xét
      </Typography>

      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Typography variant='subtitle1' sx={{ color: '#1A3C7B', fontWeight: 600, fontSize: '3.4rem' }}>
          {averageRating}
        </Typography>
        <Rating value={Number(averageRating)} precision={0.1} readOnly />
        <Typography variant='subtitle1' sx={{ color: '#1A3C7B' }}>
          ({reviews.length} đánh giá)
        </Typography>
      </Box>


      <Divider />
      <List>
        {reviews.map((review) => (
          <React.Fragment key={review._id}>
            <ListItem disablePadding alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar src={review.userId?.avatarUrl || '/default.jpg'} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display='flex' alignItems='center' gap={1}>
                    <Typography variant='subtitle1' fontWeight='bold' sx={{ color: '#1A3C7B' }}>
                      {review.userId?.name || 'Ẩn danh'}
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
            {/* <Divider variant='inset' component='li' /> */}
          </React.Fragment>
        ))}

      </List>

    </Box>
  )
}

export default ProductReview

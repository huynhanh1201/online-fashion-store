import React from 'react'
import { Box, Typography } from '@mui/material'

const ProductDescription = ({ description }) => (
  <Box sx={{ mt: 5 }}>
    <Typography variant='h6'>MÔ TẢ SẢN PHẨM</Typography>
    <Typography variant='body2'>{description || 'Không có mô tả.'}</Typography>
  </Box>
)

export default ProductDescription

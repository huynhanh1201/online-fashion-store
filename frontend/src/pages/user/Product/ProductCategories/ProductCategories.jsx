import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const categories = [
  {
    label: 'Áo',
    image:
      'https://bizweb.dktcdn.net/100/287/440/products/ao-thun-den-streetwear-nen-mua.png?v=1602834266997',
    link: '/ao'
  },
  {
    label: 'Quần',
    image:
      'https://dytbw3ui6vsu6.cloudfront.net/media/catalog/product/ADLV/25SS-BT-DJ-LG-DDP-LBU/25SS-BT-DJ-LG-DDP-LBU-002.webp',
    link: '/quan'
  },
  {
    label: 'Phụ kiện',
    image:
      'https://bizweb.dktcdn.net/thumb/large/100/323/626/products/fl285-newyork-vintage-blank-blue-02.jpg?v=1724387391903',
    link: '/phu-kien'
  }
]

const ProductCategories = () => {
  return (
    <Box
      sx={{ padding: '5px', borderRadius: '20px', margin: '30px', gap: '50px' }}
    >
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        sx={{ marginTop: '50px', gap: '100px' }}
      >
        {categories.map((category, index) => (
          <Box
            component={Link}
            to={category.link}
            key={index}
            sx={{
              textAlign: 'center',
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-block',
              '&:hover img': { transform: 'translateY(-8px)' }
            }}
          >
            <Box
              component='img'
              src={category.image}
              alt={`Nhóm ${category.label}`}
              sx={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            <Typography
              variant='h6'
              mt={1}
            >{`Nhóm ${category.label}`}</Typography>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default ProductCategories

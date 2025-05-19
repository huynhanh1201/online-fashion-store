import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

// Hàm cắt chuỗi tên
const truncate = (str, maxLength) => {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}

// Hàm rút gọn giá nếu > 10 triệu
const formatPrice = (price) => {
  if (!price) return '---'
  if (price >= 1_000_000_000) {
    const ty = price / 1_000_000_000
    return `${ty.toFixed(1)} Tỉ`
  } else if (price >= 10_000_000) {
    const tr = price / 1_000_000
    return `${tr.toFixed(1)} Tr`
  } else {
    return `${price.toLocaleString()}₫`
  }
}

const ProductCard = ({ product, handleAddToCart, isAdding }) => {
  return (
    <Card
      sx={{
        width: 283,
        height: 470,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{ padding: '10px', backgroundColor: '#fff', height: '350px' }}
      >
        <a
          href={`/productdetail/${product._id}`}
          style={{ textDecoration: 'none' }}
        >
          <CardMedia
            component='img'
            height='100%'
            width='100%'
            image={product.image?.[0] || '/default.jpg'}
            alt={product.name}
            sx={{ objectFit: 'contain' }}
          />
        </a>
      </div>
      <CardContent sx={{ mb: -2 }}>
        <a
          href={`/productdetail/${product._id}`}
          style={{ textDecoration: 'none' }}
          title={product.name}
        >
          <Typography
            variant='body1'
            sx={{
              fontWeight: 'bold',
              color: 'black',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {product.name}
          </Typography>
        </a>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label='add to favorites'>
          <FavoriteIcon />
        </IconButton>
        <IconButton
          onClick={() => handleAddToCart(product)}
          disabled={isAdding}
          aria-label='add to cart'
          sx={{ color: '#403535' }}
        >
          <AddShoppingCartIcon />
        </IconButton>
        <Box sx={{ ml: 'auto', pr: 1 }}>
          <Typography variant='subtitle1' fontWeight='bold'>
            {formatPrice(product.price)}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  )
}

export default ProductCard

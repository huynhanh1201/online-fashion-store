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

// Hàm cắt chuỗi
const truncate = (str, maxLength) => {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
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
          style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}
          title={product.name} // Tooltip xem tên đầy đủ
        >
          {truncate(product.name, 20)}
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
            {product.price ? `${product.price.toLocaleString()}₫` : '---'}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  )
}

export default ProductCard

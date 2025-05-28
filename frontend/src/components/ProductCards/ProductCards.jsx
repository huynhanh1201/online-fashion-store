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
import { useDispatch } from 'react-redux'
import { setSelectedItems as setSelectedItemsAction } from '~/redux/cart/cartSlice'

// Hàm cắt chuỗi tên
// const truncate = (str, maxLength) => {
//   if (!str) return ''
//   return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
// }

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
    return `${price.toLocaleString('vi-VN')} ₫`
  }
}


const ProductCard = ({ product, handleAddToCart, isAdding }) => {
  const dispatch = useDispatch()

  const handleSelectAndNavigate = () => {
    dispatch(setSelectedItemsAction([product._id]))
    window.location.href = `/productdetail/${product._id}`
  }

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
        style={{ padding: '10px', backgroundColor: '#fff', height: '350px', cursor: 'pointer' }}
        onClick={handleSelectAndNavigate}
      >
        <CardMedia
          component='img'
          height='100%'
          width='100%'
          image={product.image?.[0] || '/default.jpg'}
          alt={product.name}
          sx={{ objectFit: 'contain' }}
        />
      </div>

      <CardContent sx={{ mb: -2 }}>
        <Typography
          variant='body1'
          onClick={handleSelectAndNavigate}
          sx={{
            fontWeight: 'bold',
            color: 'black',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
          title={product.name}
        >
          {product.name}
        </Typography>
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

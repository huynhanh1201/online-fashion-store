import React, { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Badge,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Paper,
  Rating,
  Fab
} from '@mui/material'
import {
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Search,
  FilterList,
  KeyboardArrowUp
} from '@mui/icons-material'

const fashionProducts = [
  {
    id: 1,
    name: 'Áo Sơ Mi Trắng Classic',
    price: 850000,
    originalPrice: 1200000,
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    category: 'shirts',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    sale: 30
  },
  {
    id: 2,
    name: 'Váy Midi Hoa Nhí',
    price: 1250000,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    category: 'dresses',
    rating: 4.9,
    reviews: 89,
    isNew: false,
    sale: 0
  },
  {
    id: 3,
    name: 'Quần Jeans Skinny',
    price: 980000,
    originalPrice: 1400000,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
    category: 'pants',
    rating: 4.6,
    reviews: 156,
    isNew: false,
    sale: 25
  },
  {
    id: 4,
    name: 'Blazer Nữ Công Sở',
    price: 1850000,
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    category: 'jackets',
    rating: 4.7,
    reviews: 67,
    isNew: true,
    sale: 0
  },
  {
    id: 5,
    name: 'Áo Thun Oversize',
    price: 450000,
    originalPrice: 650000,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    category: 'tshirts',
    rating: 4.5,
    reviews: 203,
    isNew: false,
    sale: 35
  },
  {
    id: 6,
    name: 'Chân Váy Xòe Vintage',
    price: 750000,
    image:
      'https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=400&h=500&fit=crop',
    category: 'skirts',
    rating: 4.8,
    reviews: 92,
    isNew: true,
    sale: 0
  },
  {
    id: 7,
    name: 'Hoodie Unisex',
    price: 680000,
    originalPrice: 900000,
    image:
      'https://images.unsplash.com/photo-1556821840-3a9fbc86339e?w=400&h=500&fit=crop',
    category: 'hoodies',
    rating: 4.6,
    reviews: 178,
    isNew: false,
    sale: 20
  },
  {
    id: 8,
    name: 'Đầm Dạ Hội Sang Trọng',
    price: 2850000,
    image:
      'https://images.unsplash.com/photo-1566479179817-c46c7f80c695?w=400&h=500&fit=crop',
    category: 'dresses',
    rating: 4.9,
    reviews: 45,
    isNew: true,
    sale: 0
  }
]

const categories = [
  { value: 'all', label: 'Tất cả' },
  { value: 'shirts', label: 'Áo sơ mi' },
  { value: 'dresses', label: 'Váy đầm' },
  { value: 'pants', label: 'Quần' },
  { value: 'jackets', label: 'Áo khoác' },
  { value: 'tshirts', label: 'Áo thun' },
  { value: 'skirts', label: 'Chân váy' },
  { value: 'hoodies', label: 'Hoodie' }
]

export default function ProductListTest() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState(new Set())
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue)
  }

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const filteredProducts = fashionProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Container maxWidth='lg' sx={{ py: 4 }}>
        {/* Category Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.value}
                label={category.label}
                value={category.value}
              />
            ))}
          </Tabs>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component='img'
                    height='280'
                    image={product.image}
                    alt={product.name}
                    sx={{
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />

                  {/* Sale Badge */}
                  {product.sale > 0 && (
                    <Chip
                      label={`-${product.sale}%`}
                      color='error'
                      size='small'
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        fontWeight: 'bold'
                      }}
                    />
                  )}

                  {/* New Badge */}
                  {product.isNew && (
                    <Chip
                      label='Mới'
                      color='success'
                      size='small'
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 'bold'
                      }}
                    />
                  )}

                  {/* Favorite Button */}
                  <IconButton
                    onClick={() => toggleFavorite(product.id)}
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        bgcolor: 'white'
                      }
                    }}
                  >
                    {favorites.has(product.id) ? (
                      <Favorite color='error' />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography
                    variant='h6'
                    component='h3'
                    gutterBottom
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      lineHeight: 1.3
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      value={product.rating}
                      precision={0.1}
                      size='small'
                      readOnly
                    />
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ ml: 1 }}
                    >
                      ({product.reviews})
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant='h6'
                      color='primary'
                      sx={{ fontWeight: 'bold' }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                    {product.originalPrice && (
                      <Typography
                        variant='body2'
                        sx={{
                          textDecoration: 'line-through',
                          color: 'text.secondary'
                        }}
                      >
                        {formatPrice(product.originalPrice)}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    variant='contained'
                    startIcon={<ShoppingCart />}
                    onClick={() => addToCart(product)}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    Thêm vào giỏ
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8
            }}
          >
            <Typography variant='h5' color='text.secondary' gutterBottom>
              Không tìm thấy sản phẩm
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Thử thay đổi từ khóa tìm kiếm hoặc danh mục
            </Typography>
          </Box>
        )}
      </Container>

      {/* Scroll to Top Button */}
      <Fab
        color='primary'
        size='medium'
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Box>
  )
}

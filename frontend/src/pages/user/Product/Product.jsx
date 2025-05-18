import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Button,
  Snackbar,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
  Divider,
  styled
} from '@mui/material'
import { addToCart, getCart } from '~/services/cartService'
import useProducts from '~/hook/useProducts'
import { getCategories } from '~/services/categoryService'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ProductCard from '~/components/ProductCards/ProductCards'

const PRODUCTS_PER_PAGE = 12

// Styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 240,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  flexShrink: 0,
  height: 'auto',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiTypography-h6': {
    color: theme.palette.primary.dark,
    fontWeight: 600,
    marginBottom: theme.spacing(1)
  }
}))

const FilterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1)
}))

const Product = () => {
  const dispatch = useDispatch()
  const { products: allProducts, fetchProducts } = useProducts()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [errorCategories, setErrorCategories] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const { categories: fetchedCategories } = await getCategories(1, 1000)
        setCategories(fetchedCategories)
      } catch (err) {
        setErrorCategories(err)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories(), fetchProducts()
  }, [])

  const [filteredProducts, setFilteredProducts] = useState([])
  const [category, setCategory] = useState('')
  const [origin, setOrigin] = useState('')
  const [size, setSize] = useState([])
  const [color, setColor] = useState([])
  const [page, setPage] = useState(1)
  const [snackbar, setSnackbar] = useState(null) // { type, message }
  const [isAdding, setIsAdding] = useState({})

  // Filter
  useEffect(() => {
    let filtered = allProducts

    if (category) {
      filtered = filtered.filter((p) => p.category?._id === category)
    }
    if (origin) {
      filtered = filtered.filter((p) => p.origin === origin)
    }
    if (size.length) {
      filtered = filtered.filter((p) => size.includes(p.size))
    }
    if (color.length) {
      filtered = filtered.filter((p) => color.includes(p.color))
    }
    setFilteredProducts(filtered)
    setPage(1)
  }, [category, origin, size, color, allProducts])

  // Pagination slice
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  )
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)

  // Add to cart handler
  const handleAddToCart = async (product) => {
    if (isAdding[product._id]) return
    setIsAdding((prev) => ({ ...prev, [product._id]: true }))

    try {
      const updatedCart = await getCart()
      const existingItem = updatedCart?.cartItems?.find(
        (item) => item.productId._id === product._id
      )
      const currentQty = existingItem?.quantity || 0
      const maxQty = product.quantity

      if (currentQty >= maxQty) {
        setSnackbar({
          type: 'warning',
          message: 'Bạn đã thêm tối đa số lượng tồn kho!'
        })
        return
      }

      const res = await addToCart({
        cartItems: [{ productId: product._id, quantity: 1 }]
      })

      dispatch(setCartItems(res?.cartItems || updatedCart?.cartItems || []))
      setSnackbar({
        type: 'success',
        message: 'Thêm sản phẩm vào giỏ hàng thành công!'
      })
    } catch (error) {
      console.error('Thêm vào giỏ hàng lỗi:', error)
      setSnackbar({ type: 'error', message: 'Thêm sản phẩm thất bại!' })
    } finally {
      setTimeout(() => {
        setIsAdding((prev) => ({ ...prev, [product._id]: false }))
      }, 500)
    }
  }

  // Filter handlers
  const handleCategoryChange = (e) => setCategory(e.target.value)
  const handleOriginChange = (e) => setOrigin(e.target.value)
  const handleSizeChange = (e) => {
    const value = e.target.name
    setSize((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }
  const handleColorChange = (e) => {
    const value = e.target.name
    setColor((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }
  const handlePageChange = (_, value) => setPage(value)
  const handleSearch = () => setPage(1)
  const handleReset = () => {
    setCategory('')
    setOrigin('')
    setSize([])
    setColor([])
    setPage(1)
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        gap: 2
      }}
    >
      {/* Sidebar */}
      <SidebarContainer>
        <Typography variant='h6' gutterBottom>
          Bộ lọc tìm kiếm
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <FilterTitle variant='subtitle1'>Danh mục</FilterTitle>
        {loadingCategories ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : errorCategories ? (
          <Typography color='error' sx={{ mb: 2 }}>
            Lỗi tải danh mục
          </Typography>
        ) : (
          <FormControl fullWidth size='small' sx={{ mb: 2 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={category}
              label='Danh mục'
              onChange={handleCategoryChange}
            >
              <MenuItem value=''>Tất cả</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FilterTitle variant='subtitle1'>Xuất xứ</FilterTitle>
        <FormControl fullWidth size='small' sx={{ mb: 2 }}>
          <InputLabel>Xuất xứ</InputLabel>
          <Select value={origin} label='Xuất xứ' onChange={handleOriginChange}>
            <MenuItem value=''>Tất cả</MenuItem>
            <MenuItem value='vietnam'>Việt Nam</MenuItem>
            <MenuItem value='china'>Trung Quốc</MenuItem>
          </Select>
        </FormControl>

        <FilterTitle variant='subtitle1'>Kích thước</FilterTitle>
        <FormGroup>
          {['S', 'M', 'L', 'XL'].map((sizeOption) => (
            <FormControlLabel
              key={sizeOption}
              control={
                <Checkbox
                  checked={size.includes(sizeOption)}
                  onChange={handleSizeChange}
                  name={sizeOption}
                  size='small'
                />
              }
              label={sizeOption}
            />
          ))}
        </FormGroup>

        <FilterTitle variant='subtitle1' sx={{ mt: 2 }}>
          Màu sắc
        </FilterTitle>
        <FormGroup>
          {['Đỏ', 'Xanh', 'Đen', 'Trắng'].map((colorOption) => (
            <FormControlLabel
              key={colorOption}
              control={
                <Checkbox
                  checked={color.includes(colorOption)}
                  onChange={handleColorChange}
                  name={colorOption}
                  size='small'
                />
              }
              label={colorOption}
            />
          ))}
        </FormGroup>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSearch}
            fullWidth
          >
            Tìm
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleReset}
            fullWidth
          >
            Reset
          </Button>
        </Box>
      </SidebarContainer>

      {/* Product grid */}
      <Box sx={{ flexGrow: 1 }}>
        {allProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <CircularProgress />
            <Typography>Đang tải sản phẩm...</Typography>
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 10 }}>
            Không có sản phẩm phù hợp.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent='start'>
              {paginatedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={handleAddToCart}
                    isAdding={!!isAdding[product._id]}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color='primary'
              />
            </Box>
          </>
        )}
      </Box>

      {/* Snackbar */}
      {snackbar && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={snackbar.type}
            onClose={() => setSnackbar(null)}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}

export default Product

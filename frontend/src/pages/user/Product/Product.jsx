/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Button,
  Snackbar,
  Alert,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  styled
} from '@mui/material'
import { addToCart, getCart } from '~/services/cartService'
import useProducts from '~/hooks/useProducts'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ProductCard from '~/components/ProductCards/ProductCards'

const PRODUCTS_PER_PAGE = 4
const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 12px', // Điều chỉnh padding
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[400],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[600],
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '1px',
  },
}))
const Product = () => {
  const dispatch = useDispatch()
  const {
    products: allProducts,
    fetchProducts,
    loading: loadingProducts,
    error: errorProducts
  } = useProducts()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortOption, setSortOption] = useState('') // State cho tùy chọn sắp xếp
  const [page, setPage] = useState(1)
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})

  useEffect(() => {
    fetchProducts()
  }, [])

  // Logic sắp xếp sản phẩm
  useEffect(() => {
    let sortedProducts = [...allProducts]

    switch (sortOption) {
    case 'priceAsc':
      sortedProducts.sort((a, b) => (a.exportPrice || 0) - (b.exportPrice || 0))
      break
    case 'priceDesc':
      sortedProducts.sort((a, b) => (b.exportPrice || 0) - (a.exportPrice || 0))
      break
    case 'nameAsc':
      sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'nameDesc':
      sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
      break
    default:
      break
    }

    setFilteredProducts(sortedProducts)
    setPage(1)
  }, [allProducts, sortOption])

  // Pagination
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

  const handlePageChange = (_, value) => setPage(value)

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {/* Dropdown sắp xếp */}
      <FormControl
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          minWidth: 200,
          zIndex: 1200
        }}
      >
        <InputLabel id="sort-select-label">Sắp xếp theo</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sortOption}
          label="Sắp xếp theo"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="">Mặc định</MenuItem>
          <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
          <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
          <MenuItem value="nameAsc">Sản phẩm từ A-Z</MenuItem>
          <MenuItem value="nameDesc">Sản phẩm từ Z-A</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ flexGrow: 1, mt: 6 }}>
        {loadingProducts ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <CircularProgress />
            <Typography>Đang tải sản phẩm...</Typography>
          </Box>
        ) : errorProducts ? (
          <Typography sx={{ textAlign: 'center', mt: 10 }} color='error'>
            {errorProducts}
          </Typography>
        ) : allProducts.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 10 }}>
            Không có sản phẩm nào.
          </Typography>
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
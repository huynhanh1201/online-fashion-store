import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProducts } from '~/services/productService'
import ProductCard from '~/components/ProductCards/ProductCards.jsx'
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  styled
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'

const LOAD_COUNT = 5
const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 12px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center'
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[400]
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[600]
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '1px'
  }
}))

const styles = {
  container: {
    maxWidth: '1450px',
    minHeight: '100vh',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resultsHeader: {
    marginBottom: '2.5rem',
    padding: '0 1.5rem'
  },
  resultsTitle: {
    color: '#1A3C7B',
    fontSize: '2.2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #1A3C7B, #2a5298)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  resultsCount: {
    color: '#6b7280',
    fontSize: '1.1rem',
    margin: 0,
    fontWeight: '500'
  }
}

export default function SearchResults() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [visibleProducts, setVisibleProducts] = useState([])
  const [sortOption, setSortOption] = useState('')
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const location = useLocation()

  // Lấy truy vấn tìm kiếm từ URL
  const query = new URLSearchParams(location.search).get('search') || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { products: allProducts } = await getProducts(1, 20) // Giả sử API hỗ trợ phân trang
        const filtered = allProducts
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
          .map((p) => ({
            _id: p._id,
            name: p.name,
            exportPrice: p.exportPrice || 0,
            reviews: p.reviews || Math.floor(Math.random() * 1000) + 100,
            image: p.image?.[0] || '/fallback.jpg',
            category: p.category || 'Không xác định',
            brand: p.brand || 'Không xác định'
          }))

        if (filtered.length === 0) {
          setProducts([])
          setErrorMessage('Không tìm thấy sản phẩm phù hợp')
        } else {
          setProducts(filtered)
          setFilteredProducts(filtered)
          setVisibleProducts(filtered.slice(0, LOAD_COUNT))
          setErrorMessage('')
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error)
        setProducts([])
        setErrorMessage('Có lỗi xảy ra khi tìm kiếm sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  // Sắp xếp
  useEffect(() => {
    let sortedProducts = [...products]
    switch (sortOption) {
      case 'priceAsc':
        sortedProducts.sort(
          (a, b) => (a.exportPrice || 0) - (b.exportPrice || 0)
        )
        break
      case 'priceDesc':
        sortedProducts.sort(
          (a, b) => (b.exportPrice || 0) - (a.exportPrice || 0)
        )
        break
      case 'nameAsc':
        sortedProducts.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
        )
        break
      case 'nameDesc':
        sortedProducts.sort((a, b) =>
          (b.name || '').localeCompare(a.name || '')
        )
        break
      default:
        break
    }

    setFilteredProducts(sortedProducts)
    setVisibleProducts(sortedProducts.slice(0, LOAD_COUNT))
  }, [products, sortOption])

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loading &&
        visibleProducts.length < filteredProducts.length
      ) {
        setLoading(true)
        setTimeout(() => {
          setVisibleProducts((prev) => [
            ...prev,
            ...filteredProducts.slice(prev.length, prev.length + LOAD_COUNT)
          ])
          setLoading(false)
        }, 500)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [filteredProducts, visibleProducts, loading])

  const handleAddToCart = async (product) => {
    if (isAdding[product._id]) return
    setIsAdding((prev) => ({ ...prev, [product._id]: true }))

    try {
      const updatedCart = await getCart()
      const existingItem = updatedCart?.cartItems?.find(
        (item) => item.productId._id === product._id
      )
      const currentQty = existingItem?.quantity || 0
      const maxQty = product.quantity || 10 // Giả định maxQty nếu không có

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

  return (
    <div style={styles.container}>
      <main style={{ padding: '0 1.5rem' }}>
        <div style={styles.header}>
          <div>
            <section style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>
                Kết quả tìm kiếm cho: "{query || 'Tất cả'}"
              </h2>
              <p style={styles.resultsCount}>
                Tìm thấy {products.length} sản phẩm phù hợp
              </p>
            </section>
          </div>
          <div>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id='sort-select-label'>Sắp xếp theo</InputLabel>
              <CustomSelect
                labelId='sort-select-label'
                value={sortOption}
                label='Sắp xếp theo'
                onChange={(e) => setSortOption(e.target.value)}
              >
                <MenuItem value=''>Mặc định</MenuItem>
                <MenuItem value='priceAsc'>Giá tăng dần</MenuItem>
                <MenuItem value='priceDesc'>Giá giảm dần</MenuItem>
                <MenuItem value='nameAsc'>Sản phẩm từ A-Z</MenuItem>
                <MenuItem value='nameDesc'>Sản phẩm từ Z-A</MenuItem>
              </CustomSelect>
            </FormControl>
          </div>
        </div>

        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <CircularProgress />
            <Typography>Đang tải sản phẩm...</Typography>
          </Box>
        ) : errorMessage ? (
          <Typography sx={{ textAlign: 'center', mt: 10 }} color='error'>
            {errorMessage}
          </Typography>
        ) : products.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 10 }}>
            Không có sản phẩm nào.
          </Typography>
        ) : (
          <div className='product-grid'>
            {visibleProducts.map((product) => (
              <Grid key={product._id}>
                <ProductCard
                  product={product}
                  handleAddToCart={handleAddToCart}
                  isAdding={!!isAdding[product._id]}
                />
              </Grid>
            ))}
            {loading && (
              <Box sx={{ textAlign: 'center', mt: 2, width: '100%' }}>
                <CircularProgress size={24} />
                <Typography variant='body2'>
                  Đang tải thêm sản phẩm...
                </Typography>
              </Box>
            )}
          </div>
        )}
      </main>

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
    </div>
  )
}

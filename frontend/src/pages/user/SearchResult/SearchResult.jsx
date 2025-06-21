import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProducts } from '~/services/productService'
import ProductCard from '~/components/ProductCards/ProductCards.jsx'
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
  styled,
  Pagination,
  Breadcrumbs,
  Link
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const ITEMS_PER_PAGE = 10

// Custom styled button to mimic the dropdown in the image
const SortDropdownButton = styled('button')(({ theme }) => ({
  border: '1px solid #222',
  background: '#fff',
  borderRadius: 0,
  padding: '4px ',
  fontSize: 15,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  position: 'relative',
  minWidth: 180,
  fontFamily: 'inherit',
  transition: 'border 0.2s',
  outline: 'none',
  '&:hover, &:focus': {
    border: '1.5px solid #111'
  }
}))

const SortMenu = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '110%',
  right: 0,
  background: '#fff',
  border: '1px solid #222',
  borderRadius: 0,
  minWidth: 180,
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
}))

const SortMenuItem = styled('div')(({ theme }) => ({
  padding: '10px 18px',
  fontSize: 14,
  cursor: 'pointer',
  color: '#222',
  background: '#fff',
  transition: 'background 0.2s, color 0.2s, font-weight 0.2s',
  '&:hover': {
    background: '#e3e6f0',
    color: '#1976d2',
    fontWeight: 600
  }
}))

const sortOptions = [
  { value: '', label: 'Mặc định' },
  { value: 'priceAsc', label: 'Giá tăng dần' },
  { value: 'priceDesc', label: 'Giá giảm dần' },
  { value: 'nameAsc', label: 'Sản phẩm từ A-Z' },
  { value: 'nameDesc', label: 'Sản phẩm từ Z-A' }
]

const styles = {
  container: {
    margin: '0 auto',
    maxWidth: '1800px',
    minHeight: '100vh',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    marginBottom: '2rem'
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
    flex: 1
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
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '2rem'
  }
}

export default function SearchResults() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortOption, setSortOption] = useState('')
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [page, setPage] = useState(1)
  const location = useLocation()

  // Lấy truy vấn tìm kiếm từ URL
  const query = new URLSearchParams(location.search).get('search') || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { products: allProducts } = await getProducts(1, 20)
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
    setPage(1) // Reset to first page when sorting changes
  }, [products, sortOption])

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleAddToCart = async (product) => {
    if (isAdding[product._id]) return
    setIsAdding((prev) => ({ ...prev, [product._id]: true }))

    try {
      const updatedCart = await getCart()
      const existingItem = updatedCart?.cartItems?.find(
        (item) => item.productId._id === product._id
      )
      const currentQty = existingItem?.quantity || 0
      const maxQty = product.quantity || 10

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

  // For closing menu on outside click
  React.useEffect(() => {
    if (!sortMenuOpen) return
    const handleClick = (e) => {
      if (!e.target.closest('.sort-dropdown-root')) setSortMenuOpen(false)
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [sortMenuOpen])

  // Get label for current sort option
  const currentSort =
    sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0]

  return (
    <div style={styles.container}>
      <Box
        sx={{
          bottom: { xs: '20px', sm: '30px', md: '40px' },
          left: { xs: '20px', sm: '30px', md: '40px' },
          right: { xs: '20px', sm: '30px', md: '40px' },
          padding: '12px',
          maxWidth: '1800px',
          margin: '0 auto'
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize='small' />}
          aria-label='breadcrumb'
        >
          <Link
            underline='hover'
            sx={{
              maxWidth: '1800px',
              display: 'flex',
              alignItems: 'center',
              color: '#007bff',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              }
            }}
            href='/'
          >
            Trang chủ
          </Link>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              fontWeight: 500
            }}
          >
           Kết quả tìm kiếm
          </Typography>
        </Breadcrumbs>
      </Box>
      <main style={{ padding: '0 1.5rem' }}>
        <div style={styles.header}>
          <div style={styles.resultsHeader}>
            <h2 style={styles.resultsTitle}>
              Kết quả tìm kiếm cho: "{query || 'Tất cả'}"
            </h2>
            <p style={styles.resultsCount}>
              Tìm thấy {products.length} sản phẩm phù hợp
            </p>
          </div>
          <div style={styles.sortContainer}>
            {/* Custom Dropdown Sort Button */}
            <Box className='sort-dropdown-root' sx={{ position: 'relative' }}>
              <SortDropdownButton
                onClick={() => setSortMenuOpen((open) => !open)}
                tabIndex={0}
                aria-haspopup='listbox'
                aria-expanded={sortMenuOpen}
              >
                <span style={{ fontWeight: 400 }}>{currentSort.label}</span>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        lineHeight: 1,
                        fontSize: 15,
                        fontWeight: 700,
                        marginBottom: -2
                      }}
                    >
                      A
                    </span>
                    <span
                      style={{ lineHeight: 1, fontSize: 15, fontWeight: 700 }}
                    >
                      Z
                    </span>
                  </span>
                  <ArrowDownwardIcon
                    sx={{ fontSize: 20, marginBottom: '-2px' }}
                  />
                </Box>
              </SortDropdownButton>
              {sortMenuOpen && (
                <SortMenu>
                  {sortOptions.map((opt) => (
                    <SortMenuItem
                      key={opt.value}
                      onClick={() => {
                        setSortOption(opt.value)
                        setSortMenuOpen(false)
                      }}
                      style={{
                        fontWeight: sortOption === opt.value ? 600 : 400,
                        background:
                          sortOption === opt.value ? '#f5f5f5' : '#fff'
                      }}
                    >
                      {opt.label}
                    </SortMenuItem>
                  ))}
                </SortMenu>
              )}
            </Box>
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
          <>
            <div className='product-grid'>
              {paginatedProducts.map((product) => (
                <Grid key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={handleAddToCart}
                    isAdding={!!isAdding[product._id]}
                  />
                </Grid>
              ))}
            </div>

            <Box
              sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}
            >
              <Pagination
                count={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color='primary'
                size='small'
                boundaryCount={1}
                siblingCount={1}
                shape='rounded'
                sx={{
                  '& .MuiPagination-ul': {
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '8px 0',
                  },
                  mt: 3,
                  mb: 2,
                  '& .MuiPaginationItem-root': {
                    borderRadius: '6px',
                    border: '1.5px solid #e0e0e0',
                    fontWeight: 500,
                    fontSize: '1rem',
                    minWidth: 44,
                    minHeight: 44,
                    color: '#757575',
                    background: '#fff',
                    boxShadow: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#000',
                      background: '#fafafa',
                      color: '#111',
                    },
                    '&.Mui-selected': {
                      background: '#111',
                      color: '#fff',
                      borderColor: '#111',
                    },
                  },
                }}
              />
            </Box>
          </>
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

import React, { useEffect, useState } from 'react'
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
  Link,
  PaginationItem
} from '@mui/material'
import { addToCart, getCart } from '~/services/cartService'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ProductCard from '~/components/ProductCards/ProductCards'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import { getProducts } from '~/services/productService'

const ITEMS_PER_PAGE = 15

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
  { value: 'createdAtDesc', label: 'Sản phẩm mới nhất' },
  { value: 'priceAsc', label: 'Giá tăng dần' },
  { value: 'priceDesc', label: 'Giá giảm dần' },
  { value: 'nameAsc', label: 'Sản phẩm từ A-Z' },
  { value: 'nameDesc', label: 'Sản phẩm từ Z-A' }
]

const NewProducts = () => {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortOption, setSortOption] = useState('createdAtDesc') // Default to newest first
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const [sortMenuOpen, setSortMenuOpen] = useState(false)

  // Fetch products with pagination and sorting
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Map sort option to API sort parameter (chỉ cho backend sort)
      const backendSortMap = {
        nameAsc: 'name_asc',
        nameDesc: 'name_desc'
      }

      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        sort: backendSortMap[sortOption] || ''
      }

      console.log('Fetching products with params:', params)

      const response = await getProducts(params)
      console.log('API Response:', response)

      if (!response) {
        throw new Error('Không nhận được phản hồi từ server')
      }

      if (!Array.isArray(response.products)) {
        console.error('Products không phải là array:', response.products)
        throw new Error('Dữ liệu sản phẩm không hợp lệ')
      }

      let sortedProducts = [...response.products]

      // Lọc sản phẩm tạo trong 7 ngày gần nhất
      const now = new Date()
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 7)
      sortedProducts = sortedProducts.filter(p => {
        const createdAt = new Date(p.createdAt)
        return createdAt >= sevenDaysAgo && createdAt <= now
      })

      // Client-side sorting cho giá và ngày tạo
      if (sortOption === 'priceAsc') {
        sortedProducts.sort((a, b) => (a.exportPrice || 0) - (b.exportPrice || 0))
      } else if (sortOption === 'priceDesc') {
        sortedProducts.sort((a, b) => (b.exportPrice || 0) - (a.exportPrice || 0))
      } else if (sortOption === 'createdAtDesc') {
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }

      setProducts(sortedProducts)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Chi tiết lỗi:', error)
      setError(
        error.message ||
        'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.'
      )
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products when page or sort changes
  useEffect(() => {
    console.log('Effect triggered - page:', page, 'sortOption:', sortOption)
    fetchProducts()
  }, [page, sortOption])

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (option) => {
    setSortOption(option)
    setPage(1) // Reset to first page when sort changes
  }

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
    <Box sx={{ minHeight: '100vh' }}>
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
            Hàng mới
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ p: 2, maxWidth: '1800px', mx: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}
        >
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
                      handleSortChange(opt.value)
                      setSortMenuOpen(false)
                    }}
                    style={{
                      fontWeight: sortOption === opt.value ? 600 : 400,
                      background: sortOption === opt.value ? '#f5f5f5' : '#fff'
                    }}
                  >
                    {opt.label}
                  </SortMenuItem>
                ))}
              </SortMenu>
            )}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <CircularProgress />
              <Typography>Đang tải sản phẩm...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Typography color='error' gutterBottom>
                {error}
              </Typography>
              <Typography
                color='primary'
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => fetchProducts()}
              >
                Thử lại
              </Typography>
            </Box>
          ) : products.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 10 }}>
              Không có sản phẩm nào.
            </Typography>
          ) : (
            <>
              <div className='product-grid'>
                {products.map((product) => (
                  <div key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={handleAddToCart}
                      isAdding={!!isAdding[product._id]}
                    />
                  </div>
                ))}
              </div>

              <Box
                sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 , alignItems: 'center'}}
              >

<Pagination
  count={totalPages}
  page={page}
  onChange={handlePageChange}
  boundaryCount={1}
  siblingCount={1}
  shape="rounded"
  size="small"
  color="primary"
  renderItem={(item) => {
    if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
      return (
        <span
          style={{
            padding: '8px 12px',
            fontWeight: 'bold',
            color: '#999',
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ...
        </span>
         )
    }

         return <PaginationItem {...item} />
         }}
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
    </Box>
  )
}

export default NewProducts
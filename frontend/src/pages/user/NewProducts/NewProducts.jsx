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
import NavigateNext from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { getProducts } from '~/services/productService'
import { useNavigate } from 'react-router-dom'

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
  { value: 'featured', label: 'Sản phẩm mới nhất' },
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
  const navigate = useNavigate()
  // Fetch products with pagination and sorting
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const backendSortMap = {
        nameAsc: 'name_asc',
        nameDesc: 'name_desc',
        priceAsc: 'price_asc',
        priceDesc: 'price_desc',
        featured: 'newest'
      }

      const params = {
        page: Number(page),
        limit: Number(ITEMS_PER_PAGE),
        sort: backendSortMap[sortOption] || 'newest',
        destroy: false,
        status: 'active',
        label: 'new'
      }

      console.log('Fetching products with params:', params)

      const response = await getProducts(params)

      if (!response || !Array.isArray(response.products)) {
        throw new Error('Lỗi dữ liệu từ server')
      }

      let fetchedProducts = [...response.products] // tạo bản sao để sort

      // Xử lý sort ở frontend
      switch (sortOption) {
        case 'nameAsc':
          fetchedProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'nameDesc':
          fetchedProducts.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'priceAsc':
          fetchedProducts.sort((a, b) => {
            const priceA =
              a.minSalePriceVariant?.finalSalePrice > 0
                ? a.minSalePriceVariant.finalSalePrice
                : a.exportPrice
            const priceB =
              b.minSalePriceVariant?.finalSalePrice > 0
                ? b.minSalePriceVariant.finalSalePrice
                : b.exportPrice
            return priceA - priceB
          })
          break
        case 'priceDesc':
          fetchedProducts.sort((a, b) => {
            const priceA =
              a.minSalePriceVariant?.finalSalePrice > 0
                ? a.minSalePriceVariant.finalSalePrice
                : a.exportPrice
            const priceB =
              b.minSalePriceVariant?.finalSalePrice > 0
                ? b.minSalePriceVariant.finalSalePrice
                : b.exportPrice
            return priceB - priceA
          })
          break
        case 'featured':
        default:
          // Không sort, giữ nguyên
          break
      }
      const totalProducts = response.total || fetchedProducts.length
      const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE) || 1

      setProducts(fetchedProducts)
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Lỗi fetch sản phẩm:', error)
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

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

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
    <Box sx={{ minHeight: '70vh' }}>
      <Box
        sx={{
          bottom: { xs: '20px', sm: '30px', md: '40px' },
          left: { xs: '20px', sm: '30px', md: '40px' },
          right: { xs: '20px', sm: '30px', md: '40px' },
          padding: '12px',
          maxWidth: '96vw',
          margin: '0 auto'
        }}
      >
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          aria-label='breadcrumb'
        >
          <Link
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#007bff',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              },
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
            // component={Link}
            // to='/product'
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
      <Box sx={{ p: 2, maxWidth: '96vw', mx: 'auto' }}>
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
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Inventory2OutlinedIcon
                sx={{ fontSize: 80, color: '#ccc', mb: 2 }}
              />
              <Typography variant='h6' sx={{ color: '#666', mb: 1 }}>
                Sản phẩm mới chưa được thêm
              </Typography>
              <Typography variant='body2' sx={{ color: '#999' }}>
                Hiện tại chưa có sản phẩm mới nào trong 7 ngày gần đây
              </Typography>
            </Box>
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
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                  mb: 2,
                  alignItems: 'center'
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  boundaryCount={1}
                  siblingCount={1}
                  shape='rounded'
                  size='small'
                  color='primary'
                  renderItem={(item) => {
                    if (
                      item.type === 'start-ellipsis' ||
                      item.type === 'end-ellipsis'
                    ) {
                      return (
                        <span
                          style={{
                            padding: '8px 12px',
                            fontWeight: 'bold',
                            color: '#999',
                            fontSize: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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

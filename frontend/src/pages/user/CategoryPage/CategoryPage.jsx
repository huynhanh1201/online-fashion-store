import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Divider,
  Snackbar,
  Pagination,
  styled,
  PaginationItem,
  Breadcrumbs,
  Link
} from '@mui/material'
import NavigateNext from '@mui/icons-material/NavigateNext'
import { getCategoryBySlug } from '~/services/categoryService'
import { getProductsByCategory } from '~/services/productService'
import ProductCard from '~/components/ProductCards/ProductCards'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import { addToCart, getCart } from '~/services/cartService'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

const ITEMS_PER_PAGE = 12

// Custom styled components
const SortDropdownButton = styled('button')(({ theme }) => ({
  border: '1px solid #222',
  background: '#fff',
  borderRadius: 0,
  padding: '4px',
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
  { value: 'featured', label: 'Sản phẩm nổi bật' },
  { value: 'priceAsc', label: 'Giá tăng dần' },
  { value: 'priceDesc', label: 'Giá giảm dần' },
  { value: 'nameAsc', label: 'Sản phẩm từ A-Z' },
  { value: 'nameDesc', label: 'Sản phẩm từ Z-A' }
]

const CategoryPage = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortOption, setSortOption] = useState('featured')
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const [page, setPage] = useState(1)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()
  const sortProductsClientSide = (products, sortOption) => {
    const sortedProducts = [...products] // tạo bản sao để tránh mutate
    switch (sortOption) {
      case 'nameAsc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'nameDesc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'priceAsc':
        sortedProducts.sort((a, b) => {
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
        sortedProducts.sort((a, b) => {
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
        break
    }
    return sortedProducts
  }

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch category by slug
        const categoryData = await getCategoryBySlug(slug)
        if (!categoryData) {
          setError('Không tìm thấy danh mục')
          return
        }

        setCategory(categoryData)
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err)
        setError('Có lỗi xảy ra khi tải danh mục')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategory()
    }
  }, [slug])

  // Fetch products with backend sorting
  const fetchProducts = async () => {
    if (!category?._id) return

    try {
      setLoading(true)
      setError('')

      const response = await getProductsByCategory(
        category._id,
        Number(page),
        Number(ITEMS_PER_PAGE),
        sortOption
      )

      let fetchedProducts = response.products || []
      const totalPages = response.totalPages || 1

      if (!Array.isArray(fetchedProducts)) {
        throw new Error('Dữ liệu sản phẩm không hợp lệ')
      }

      // ✅ Sort lại ở frontend dù backend có sắp xếp
      const sorted = sortProductsClientSide(fetchedProducts, sortOption)

      setProducts(sorted)
      setTotalPages(totalPages)
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm:', err)
      setError('Có lỗi xảy ra khi tải sản phẩm')
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products when dependencies change
  useEffect(() => {
    if (category?._id) {
      fetchProducts()
    }
  }, [category, sortOption, page])

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

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])
  useEffect(() => {
    if (!sortMenuOpen) return
    const handleClick = (e) => {
      if (!e.target.closest('.sort-dropdown-root')) setSortMenuOpen(false)
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [sortMenuOpen])

  const currentSort =
    sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0]

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='80vh'
        sx={{ backgroundColor: 'var(--surface-color)' }}
      >
        <CircularProgress size={60} thickness={3} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth='xl' sx={{ py: 8 }}>
        <Alert
          severity='error'
          sx={{
            maxWidth: 600,
            mx: 'auto',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {error}
        </Alert>
      </Container>
    )
  }

  if (!category) {
    return (
      <Container maxWidth='xl' sx={{ py: 8 }}>
        <Alert
          severity='warning'
          sx={{
            maxWidth: 600,
            mx: 'auto',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          Không tìm thấy danh mục
        </Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 1 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize='small' />}
        aria-label='breadcrumb'
        sx={{ px: 3, py: 1, mb: 2 }}
      >
        <Link
          component={Link}
          to='/'
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#007bff',
            textDecoration: 'none',
            minWidth: 0,
            p: 0,
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
          {' '}
          {category ? category.name : 'Danh mục sản phẩm'}
        </Typography>
      </Breadcrumbs>
      {/* Category Banner Section */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
          width: '100%',
          height: {
            md: '200px',
            lg: '300px',
            xl: 'auto'
          },
          position: 'relative',
          overflow: 'hidden',
          mb: 4
        }}
      >
        <img
          src={optimizeCloudinaryUrl(
            category?.banner ||
              category?.image ||
              'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
            { width: 1920, height: 400 }
          )}
          alt='category banner'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>

      {/* Products Section */}
      <Box sx={{ p: 2, maxWidth: '96vw', mx: 'auto' }}>
        {/* Sort Controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}
        >
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

        {/* Products Grid */}
        <Box sx={{ flexGrow: 1 }}>
          {products.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 10 }}>
              Không tìm thấy sản phẩm nào trong danh mục này. Vui lòng kiểm tra
              danh mục hoặc thử lại sau.
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

              {/* Pagination */}
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
          {/* Snackbar */}
          {snackbar && (
            <Snackbar
              open
              autoHideDuration={3000}
              onClose={() => setSnackbar(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
    </Box>
  )
}

export default CategoryPage

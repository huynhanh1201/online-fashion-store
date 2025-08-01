import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getProducts } from '~/services/productService'
import ProductCard from '~/components/ProductCards/ProductCards.jsx'
import '~/assets/HomeCSS/Content.css'
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  styled,
  Pagination,
  Breadcrumbs,
  Button,
  PaginationItem,
  Link
} from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import NavigateNext from '@mui/icons-material/NavigateNext'

const ITEMS_PER_PAGE = 10

const SortDropdownButton = styled('button')({
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
})

const SortMenu = styled('div')({
  position: 'absolute',
  top: '110%',
  right: 0,
  background: '#fff',
  border: '1px solid #222',
  borderRadius: 0,
  minWidth: 180,
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
})

const SortMenuItem = styled('div')({
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
})

const sortOptions = [
  { value: '', label: 'Sản phẩm nổi bật' },
  { value: 'priceAsc', label: 'Giá tăng dần' },
  { value: 'priceDesc', label: 'Giá giảm dần' },
  { value: 'nameDesc', label: 'Sản phẩm từ A-Z' },
  { value: 'nameAsc', label: 'Sản phẩm từ Z-A' }
]
const styles = {
  container: {
    margin: '0 auto',
    maxWidth: '96vw',
    minHeight: '100vh', // Đảm bảo luôn đủ chiều cao để có scrollbar
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflowY: 'auto' // Đảm bảo có scrollbar khi cần
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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

function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

export default function SearchResults() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortOption, setSortOption] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [page, setPage] = useState(1)
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search).get('search') || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const backendSortMap = {
          priceAsc: 'price_asc',
          priceDesc: 'price_desc',
          nameAsc: 'name_asc',
          nameDesc: 'name_desc',
          '': ''
        }

        const params = {
          page: 1,
          limit: 1000,
          sort: backendSortMap[sortOption] || 'newest',
          filters: {}
        }

        const { products: allProducts } = await getProducts(params)
        console.log('All products fetched:', allProducts)
        // Lọc theo tên
        let filtered = allProducts
          .filter((p) =>
            removeVietnameseTones(p.name || '').includes(
              removeVietnameseTones(query.trim())
            )
          )
          .map((p) => ({
            _id: p._id,
            name: p.name,
            exportPrice: p.exportPrice || 0,
            firstVariantDiscountPrice: p.firstVariantDiscountPrice || 0,
            createdAt: p.createdAt,
            soldCount: p.soldCount || 0,
            avgRating: p.avgRating || 0,
            reviews: p.reviews || Math.floor(Math.random() * 1000) + 100,
            image: p.image || ['/fallback.jpg'],
            category: p.category || 'Không xác định',
            brand: p.brand || 'Không xác định',
            quantity: p.quantity || 0,
            minSalePriceVariant: p.minSalePriceVariant || nul
          }))
        console.log('Filtered products:', filtered)
        // Sắp xếp ở frontend
        switch (sortOption) {
          case 'nameAsc':
            filtered.sort((a, b) => a.name.localeCompare(b.name))
            break
          case 'nameDesc':
            filtered.sort((a, b) => b.name.localeCompare(a.name))
            break
          case 'priceAsc':
            filtered.sort((a, b) => {
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
            filtered.sort((a, b) => {
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
          case 'newest':
          default:
            filtered.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
            break
        }

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
  }, [query, sortOption])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [query])

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1

  // Close sort menu on outside click
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

  return (
    <div style={styles.container}>
      <Box sx={{ maxWidth: '1800px', margin: '0 auto', padding: '12px' }}>
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
            Sản phẩm tìm kiếm
          </Typography>
        </Breadcrumbs>
      </Box>
      <main style={{ padding: '0 1.5rem' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}
        >
          <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
            <h2 style={styles.resultsTitle}>
              Kết quả tìm kiếm cho: "{query || 'Tất cả'}"
            </h2>
            <p style={styles.resultsCount}>
              Tìm thấy {filteredProducts.length} sản phẩm phù hợp
            </p>
          </Box>

          <Box sx={{ flexShrink: 0, ml: 'auto' }}>
            <Box className='sort-dropdown-root' sx={{ position: 'relative' }}>
              <SortDropdownButton
                onClick={() => setSortMenuOpen((open) => !open)}
                tabIndex={0}
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
                        fontSize: 15,
                        fontWeight: 700,
                        marginBottom: -2
                      }}
                    >
                      A
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Z</span>
                  </span>
                  <ArrowDownwardIcon sx={{ fontSize: 20 }} />
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
                        setPage(1)
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
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <CircularProgress />
            <Typography>Đang tải sản phẩm...</Typography>
          </Box>
        ) : errorMessage ? (
          <Typography sx={{ textAlign: 'center', mt: 10 }} color='error'>
            {errorMessage}
          </Typography>
        ) : filteredProducts.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 10 }}>
            Không có sản phẩm nào.
          </Typography>
        ) : (
          <>
            <div className='product-grid'>
              {paginatedProducts.map((product) => (
                <Grid key={product._id}>
                  <ProductCard product={product} isFlashSale={false} />
                </Grid>
              ))}
            </div>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                shape='rounded'
                color='primary'
                size='small'
                renderItem={(item) =>
                  item.type === 'start-ellipsis' ||
                  item.type === 'end-ellipsis' ? (
                    <span style={{ padding: '8px 12px', color: '#999' }}>
                      ...
                    </span>
                  ) : (
                    <PaginationItem {...item} />
                  )
                }
              />
            </Box>
          </>
        )}
      </main>
    </div>
  )
}

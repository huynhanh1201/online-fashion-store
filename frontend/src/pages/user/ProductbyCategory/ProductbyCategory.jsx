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
  PaginationItem
} from '@mui/material'
import { addToCart, getCart } from '~/services/cartService'
import useProducts from '~/hooks/useProducts'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ProductCard from '~/components/ProductCards/ProductCards'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useParams } from 'react-router-dom'
import { getCategoryById, getChildCategories } from '~/services/categoryService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

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

const ProductbyCategory = () => {
  const { categoryId } = useParams()
  const dispatch = useDispatch()
  const {
    products: allProducts,
    fetchProducts,
    loading: loadingProducts,
    error: errorProducts
  } = useProducts(1, 1000)

  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortOption, setSortOption] = useState('featured')
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const [page, setPage] = useState(1)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [category, setCategory] = useState(null)
  const [loadingCategory, setLoadingCategory] = useState(true)
  const [childCategories, setChildCategories] = useState([])
  const [allCategoryIds, setAllCategoryIds] = useState([])

  useEffect(() => {
    const fetchCategoryAndChildren = async () => {
      try {
        setLoadingCategory(true)
        
        // Fetch parent category
        const response = await getCategoryById(categoryId)
        setCategory(response)
        
        // Fetch child categories
        const children = await getChildCategories(categoryId)
        setChildCategories(children)
        
        // Create array of all category IDs (parent + children)
        const categoryIds = [categoryId, ...children.map(child => child._id)]
        setAllCategoryIds(categoryIds)
        
      } catch (error) {
        console.error('Error fetching category:', error)
      } finally {
        setLoadingCategory(false)
      }
    }

    if (categoryId) {
      fetchCategoryAndChildren()
    }
  }, [categoryId])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!allProducts.length && !loadingProducts) return

    let sortedProducts = [...allProducts]

    if (allCategoryIds.length > 0) {
      // Lọc sản phẩm theo tất cả categoryIds (parent + children)
      sortedProducts = sortedProducts.filter((product) => {
        const productCategoryId = product.categoryId?._id || product.categoryId
        return allCategoryIds.includes(productCategoryId)
      })

      // Sắp xếp sản phẩm
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
          // Sắp xếp theo ngày tạo mới nhất
          sortedProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          break
      }

      console.log(
        'Chi tiết sản phẩm sau khi lọc:',
        sortedProducts.map((p) => ({
          id: p._id,
          name: p.name,
          categoryId: p.categoryId?._id || p.categoryId,
          price: p.exportPrice,
          createdAt: p.createdAt
        }))
      )
    }

    setFilteredProducts(sortedProducts)
    setPage(1)
  }, [allProducts, sortOption, allCategoryIds, loadingProducts])

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

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  React.useEffect(() => {
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
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', sm: '300px', md: '400px' },
          backgroundImage: category?.banner 
            ? `url(${optimizeCloudinaryUrl(category.banner, { width: 1920, height: 400 })})`
            : category?.image
            ? `url(${optimizeCloudinaryUrl(category.image, { width: 1920, height: 400 })})`
            : 'url(https://file.hstatic.net/1000360022/collection/ao-thun_cd23d8082c514c839615e1646371ba71.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          mb: 4
        }}
      >
      </Box>

      {/* Title dưới banner */}
      <Box sx={{ textAlign: 'center', mt: -3, mb: 4 }}>
        <Typography
          variant='h2'
          sx={{
            color: 'var(--text-color)',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
            mb: 2,
            lineHeight: 1.1
          }}
        >
          {loadingCategory
            ? 'Đang tải...'
            : category?.name || 'Danh mục sản phẩm'}
        </Typography>
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

        <Box sx={{ flexGrow: 1 }}>
          {loadingProducts || loadingCategory ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <CircularProgress />
              <Typography>Đang tải sản phẩm...</Typography>
            </Box>
          ) : errorProducts ? (
            <Typography sx={{ textAlign: 'center', mt: 10 }} color='error'>
              Lỗi khi tải sản phẩm: {errorProducts.message || errorProducts}
            </Typography>
          ) : filteredProducts.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 10 }}>
              Không tìm thấy sản phẩm nào trong danh mục này. Vui lòng kiểm tra
              danh mục hoặc thử lại sau.
            </Typography>
          ) : (
            <>
              <div className='product-grid'>
                {filteredProducts.map((product) => (
                  <div key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={handleAddToCart}
                      isAdding={!!isAdding[product._id]}
                    />
                  </div>
                ))}
              </div>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 , alignItems: 'center'}}>
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

export default ProductbyCategory

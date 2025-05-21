import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Button,
  Snackbar,
  Alert,
  Pagination,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
  Divider,
  styled,
  IconButton,
  Drawer
} from '@mui/material'
import FilterListAltIcon from '@mui/icons-material/FilterListAlt'
import { addToCart, getCart } from '~/services/cartService'
import useProducts from '~/hooks/useProducts'
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
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}))

const FilterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1)
}))

const MobileFilterIcon = styled(IconButton)(({ theme }) => ({
  display: 'none',
  '@media (max-width: 800px)': {
    display: 'block !important',
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1300,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))

const DrawerContainer = styled(Box)(({ theme }) => ({
  width: 280,
  marginTop: '20px',
  padding: theme.spacing(2),
  backgroundColor: '#fff'
}))

const Product = () => {
  const dispatch = useDispatch()
  const {
    products: allProducts,
    fetchProducts,
    loading: loadingProducts,
    error: errorProducts
  } = useProducts()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [errorCategories, setErrorCategories] = useState(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const { categories: fetchedCategories, total } = await getCategories(
          1,
          1000
        )
        if (!fetchedCategories || fetchedCategories.length === 0) {
          throw new Error('Không có danh mục nào được tải')
        }
        console.log(
          `Tải được ${fetchedCategories.length} danh mục`,
          fetchedCategories
        ) // Debug
        setCategories(fetchedCategories)
      } catch (err) {
        setErrorCategories('Không thể tải danh mục: ' + err.message)
        console.error('Chi tiết lỗi danh mục:', err)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
    fetchProducts()
  }, [])

  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get('category')
    return category ? [category] : []
  })
  const [selectedOrigins, setSelectedOrigins] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [page, setPage] = useState(1)
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})

  const priceRanges = [
    { label: 'Dưới 100k', min: 0, max: 100000 },
    { label: '100k - 200k', min: 100000, max: 200000 },
    { label: '200k - 500k', min: 200000, max: 500000 },
    { label: 'Trên 500k', min: 500000, max: Infinity }
  ]

  // Filter logic
  useEffect(() => {
    if (!allProducts.length || !categories.length) {
      console.log(
        'Chưa tải đủ dữ liệu: allProducts=',
        allProducts.length,
        'categories=',
        categories.length
      ) // Debug
      setFilteredProducts([])
      return
    }

    console.log(
      'Sản phẩm:',
      allProducts.map((p) => ({
        _id: p._id,
        name: p.name,
        categoryId: p.categoryId,
        price: p.price
      }))
    ) // Debug
    console.log(
      'Danh mục:',
      categories.map((c) => ({ _id: c._id, name: c.name }))
    ) // Debug
    console.log('Danh mục đã chọn:', selectedCategories) // Debug
    console.log('Khoảng giá đã chọn:', selectedPriceRanges) // Debug

    let filtered = [...allProducts]

    if (selectedCategories.length) {
      filtered = filtered.filter((p) => {
        if (!p.categoryId) {
          console.warn(`Sản phẩm ${p._id} (${p.name}) thiếu categoryId`)
          return false
        }
        const categoryId =
          typeof p.categoryId === 'object' && p.categoryId?._id
            ? p.categoryId._id
            : p.categoryId
        const match = selectedCategories.includes(categoryId)
        console.log(
          `Sản phẩm ${p._id} (${p.name}): categoryId=${JSON.stringify(p.categoryId)}, normalized=${categoryId}, selectedCategories=${selectedCategories.join(', ')}, khớp=${match}`
        ) // Debug
        return match
      })
    }
    if (selectedOrigins.length) {
      filtered = filtered.filter((p) => selectedOrigins.includes(p.origin))
    }
    if (selectedSizes.length) {
      filtered = filtered.filter(
        (p) => p.sizes && p.sizes.some((size) => selectedSizes.includes(size))
      )
    }
    if (selectedColors.length) {
      filtered = filtered.filter(
        (p) =>
          p.colors && p.colors.some((color) => selectedColors.includes(color))
      )
    }
    if (selectedPriceRanges.length) {
      filtered = filtered.filter((p) => {
        if (!p.price && p.price !== 0) {
          console.warn(
            `Sản phẩm ${p._id} (${p.name}) thiếu hoặc giá không hợp lệ: price=${p.price}`
          )
          return false
        }
        const price =
          typeof p.price === 'string' ? parseFloat(p.price) : p.price
        if (isNaN(price)) {
          console.warn(
            `Sản phẩm ${p._id} (${p.name}) giá không phải số: price=${p.price}`
          )
          return false
        }
        const match = selectedPriceRanges.some((range) => {
          const rangeData = priceRanges.find((pr) => pr.label === range)
          if (!rangeData) {
            console.warn(`Không tìm thấy khoảng giá: ${range}`)
            return false
          }
          const { min, max } = rangeData
          return price >= min && price <= max
        })
        console.log(
          `Sản phẩm ${p._id} (${p.name}): price=${price}, selectedPriceRanges=${selectedPriceRanges.join(', ')}, khớp=${match}`
        ) // Debug
        return match
      })
    }

    console.log(
      'Sản phẩm sau khi lọc:',
      filtered.map((p) => ({
        _id: p._id,
        name: p.name,
        categoryId: p.categoryId,
        price: p.price
      }))
    ) // Debug
    setFilteredProducts(filtered)
    setPage(1)
  }, [
    selectedCategories,
    selectedOrigins,
    selectedSizes,
    selectedColors,
    selectedPriceRanges,
    allProducts,
    categories
  ])

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

  // Filter handlers
  const handleCategoryChange = (e) => {
    const value = e.target.name
    console.log('Chọn danh mục:', value) // Debug
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleOriginChange = (e) => {
    const value = e.target.name
    setSelectedOrigins((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSizeChange = (e) => {
    const value = e.target.name
    setSelectedSizes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleColorChange = (e) => {
    const value = e.target.name
    setSelectedColors((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handlePriceRangeChange = (e) => {
    const value = e.target.name
    console.log('Chọn khoảng giá:', value) // Debug
    setSelectedPriceRanges((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handlePageChange = (_, value) => setPage(value)

  const handleSearch = () => {
    setPage(1)
    setMobileFilterOpen(false)
  }

  const handleReset = () => {
    setSelectedCategories([])
    setSelectedOrigins([])
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedPriceRanges([])
    setPage(1)
  }

  const toggleMobileFilter = () => {
    setMobileFilterOpen((prev) => !prev)
    console.log('Toggle filter:', !mobileFilterOpen) // Debug
  }

  const renderFilterContent = () => (
    <>
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
          {errorCategories}
        </Typography>
      ) : categories.length === 0 ? (
        <Typography sx={{ mb: 2 }}>Không có danh mục nào</Typography>
      ) : (
        <FormGroup>
          {categories.map((cat) => (
            <FormControlLabel
              key={cat._id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(cat._id)}
                  onChange={handleCategoryChange}
                  name={cat._id}
                  size='small'
                />
              }
              label={cat.name}
            />
          ))}
        </FormGroup>
      )}

      <FilterTitle variant='subtitle1'>Xuất xứ</FilterTitle>
      <FormGroup>
        {['Việt Nam', 'Trung Quốc'].map((originOption) => (
          <FormControlLabel
            key={originOption}
            control={
              <Checkbox
                checked={selectedOrigins.includes(originOption)}
                onChange={handleOriginChange}
                name={originOption}
                size='small'
              />
            }
            label={originOption}
          />
        ))}
      </FormGroup>

      <FilterTitle variant='subtitle1'>Kích thước</FilterTitle>
      <FormGroup>
        {['S', 'M', 'L', 'XL'].map((sizeOption) => (
          <FormControlLabel
            key={sizeOption}
            control={
              <Checkbox
                checked={selectedSizes.includes(sizeOption)}
                onChange={handleSizeChange}
                name={sizeOption}
                size='small'
              />
            }
            label={sizeOption}
          />
        ))}
      </FormGroup>

      <FilterTitle variant='subtitle1'>Màu sắc</FilterTitle>
      <FormGroup>
        {['Đỏ', 'Xanh', 'Đen', 'Trắng'].map((colorOption) => (
          <FormControlLabel
            key={colorOption}
            control={
              <Checkbox
                checked={selectedColors.includes(colorOption)}
                onChange={handleColorChange}
                name={colorOption}
                size='small'
              />
            }
            label={colorOption}
          />
        ))}
      </FormGroup>

      <FilterTitle variant='subtitle1'>Khoảng giá</FilterTitle>
      <FormGroup>
        {priceRanges.map((range) => (
          <FormControlLabel
            key={range.label}
            control={
              <Checkbox
                checked={selectedPriceRanges.includes(range.label)}
                onChange={handlePriceRangeChange}
                name={range.label}
                size='small'
              />
            }
            label={range.label}
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
    </>
  )

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
      <SidebarContainer>{renderFilterContent()}</SidebarContainer>

      <Box
        sx={{
          position: 'fixed',
          top: 100,
          right: 16,
          zIndex: 1200,
          color: '#1A3C7B',
          p: 1,
          cursor: 'pointer',
          display: { xs: 'flex', md: 'none' }, // Hiện trên mobile
          alignItems: 'center',
          gap: 0.5
        }}
        onClick={toggleMobileFilter}
      >
        <FilterListAltIcon sx={{ fontSize: 24 }} />
        <Typography variant='body2' sx={{ fontSize: 14, fontWeight: 500 }}>
          Filter
        </Typography>
      </Box>

      <Drawer
        anchor='right'
        open={mobileFilterOpen}
        onClose={toggleMobileFilter}
        sx={{
          zIndex: 1100, // cao hơn header nhưng thấp hơn icon
          mt: 10
        }}
      >
        <DrawerContainer>{renderFilterContent()}</DrawerContainer>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
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

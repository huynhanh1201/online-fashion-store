import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
  styled,
  Pagination
} from '@mui/material';
import { addToCart, getCart } from '~/services/cartService';
import useProducts from '~/hooks/useProducts';
import { useDispatch } from 'react-redux';
import { setCartItems } from '~/redux/cart/cartSlice';
import ProductCard from '~/components/ProductCards/ProductCards';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useParams } from 'react-router-dom';
import { getCategoryById } from '~/services/categoryService';

const ITEMS_PER_PAGE = 6;

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
}));

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
}));

const SortMenuItem = styled('div')(({ theme }) => ({
  padding: '10px 18px',
  fontSize: 14,
  cursor: 'pointer',
  color: '#222',
  background: '#fff',
  '&:hover': {
    background: '#f5f5f5'
  }
}));

const sortOptions = [
  { value: 'featured', label: 'Sản phẩm nổi bật' },
  { value: 'priceAsc', label: 'Giá tăng dần' },
  { value: 'priceDesc', label: 'Giá giảm dần' },
  { value: 'nameAsc', label: 'Sản phẩm từ A-Z' },
  { value: 'nameDesc', label: 'Sản phẩm từ Z-A' }
];

const ProductbyCategory = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const {
    products: allProducts,
    fetchProducts,
    loading: loadingProducts,
    error: errorProducts
  } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('featured');
  const [snackbar, setSnackbar] = useState(null);
  const [isAdding, setIsAdding] = useState({});
  const [page, setPage] = useState(1);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoadingCategory(true);
        const response = await getCategoryById(categoryId);
        setCategory(response);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoadingCategory(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!allProducts.length && !loadingProducts) return;

    let sortedProducts = [...allProducts];

    if (categoryId) {
      sortedProducts = sortedProducts.filter(product => 
        product.categoryId?._id === categoryId || product.categoryId === categoryId
      );
    }

    switch (sortOption) {
      case 'priceAsc':
        sortedProducts.sort((a, b) => (a.exportPrice || 0) - (b.exportPrice || 0));
        break;
      case 'priceDesc':
        sortedProducts.sort((a, b) => (b.exportPrice || 0) - (a.exportPrice || 0));
        break;
      case 'nameAsc':
        sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'nameDesc':
        sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        // For featured products, sort by some criteria like popularity or date
        sortedProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    setFilteredProducts(sortedProducts);
    setPage(1);
  }, [allProducts, sortOption, categoryId, loadingProducts]);

  const handleAddToCart = async (product) => {
    if (isAdding[product._id]) return;
    setIsAdding((prev) => ({ ...prev, [product._id]: true }));

    try {
      const updatedCart = await getCart();
      const existingItem = updatedCart?.cartItems?.find(
        (item) => item.productId._id === product._id
      );
      const currentQty = existingItem?.quantity || 0;
      const maxQty = product.quantity;

      if (currentQty >= maxQty) {
        setSnackbar({
          type: 'warning',
          message: 'Bạn đã thêm tối đa số lượng tồn kho!'
        });
        return;
      }

      const res = await addToCart({
        cartItems: [{ productId: product._id, quantity: 1 }]
      });

      dispatch(setCartItems(res?.cartItems || updatedCart?.cartItems || []));
      setSnackbar({
        type: 'success',
        message: 'Thêm sản phẩm vào giỏ hàng thành công!'
      });
    } catch (error) {
      console.error('Thêm vào giỏ hàng lỗi:', error);
      setSnackbar({ type: 'error', message: 'Thêm sản phẩm thất bại!' });
    } finally {
      setTimeout(() => {
        setIsAdding((prev) => ({ ...prev, [product._id]: false }));
      }, 500);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    if (!sortMenuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.sort-dropdown-root')) setSortMenuOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [sortMenuOpen]);

  const currentSort = sortOptions.find(opt => opt.value === sortOption) || sortOptions[0];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', sm: '300px', md: '400px' },
          backgroundImage: category?.image || 'url(https://file.hstatic.net/1000360022/collection/ao-thun_cd23d8082c514c839615e1646371ba71.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          mb: 4
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              textAlign: 'center',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {loadingCategory ? 'Đang tải...' : category?.name || 'Danh mục sản phẩm'}
          </Typography>
        </Box>
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
          <Box className="sort-dropdown-root" sx={{ position: 'relative' }}>
            <SortDropdownButton
              onClick={() => setSortMenuOpen((open) => !open)}
              tabIndex={0}
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}
            >
              <span style={{ fontWeight: 400 }}>{currentSort.label}</span>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ lineHeight: 1, fontSize: 15, fontWeight: 700, marginBottom: -2 }}>A</span>
                  <span style={{ lineHeight: 1, fontSize: 15, fontWeight: 700 }}>Z</span>
                </span>
                <ArrowDownwardIcon sx={{ fontSize: 20, marginBottom: '-2px' }} />
              </Box>
            </SortDropdownButton>
            {sortMenuOpen && (
              <SortMenu>
                {sortOptions.map((opt) => (
                  <SortMenuItem
                    key={opt.value}
                    onClick={() => {
                      setSortOption(opt.value);
                      setSortMenuOpen(false);
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
            <Typography sx={{ textAlign: 'center', mt: 10 }} color="error">
              Lỗi khi tải sản phẩm: {errorProducts.message || errorProducts}
            </Typography>
          ) : filteredProducts.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 10 }}>
              Không tìm thấy sản phẩm nào trong danh mục này. Vui lòng kiểm tra danh mục hoặc thử lại sau.
            </Typography>
          ) : (
            <>
              <div className="product-grid">

                  {paginatedProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                      <ProductCard
                        product={product}
                        handleAddToCart={handleAddToCart}
                        isAdding={!!isAdding[product._id]}
                      />
                    </Grid>
                  ))}
      
              </div>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                <Pagination
                  count={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
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
  );
};

export default ProductbyCategory;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Grid,
  Box,
  Skeleton,
  Link,
  Pagination,
  styled,
  Button
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  ArrowDownward as ArrowDownwardIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getCollectionBySlug } from '~/services/collectionService';
import { getProductsByCategory } from '~/services/productService';
import ProductCard from '~/components/ProductCards/ProductCards';

// Page wrapper
const PageWrapper = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: 0,
  margin: 0
}));

// Hero section
const HeroSection = styled('div')(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '80px 0 60px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  }
}));

const HeroContent = styled('div')(({ theme }) => ({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 20px',
  position: 'relative',
  zIndex: 2
}));

const BackButton = styled(Button)(({ theme }) => ({
  color: 'white',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '25px',
  padding: '8px 20px',
  marginBottom: '30px',
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    borderColor: 'white',
    transform: 'translateY(-2px)'
  }
}));

const CollectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem'
  }
}));

const CollectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  textAlign: 'center',
  opacity: 0.9,
  maxWidth: '600px',
  margin: '0 auto 30px',
  lineHeight: 1.6
}));

const StatsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  marginTop: '30px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center'
  }
}));

const StatItem = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: '20px',
  background: 'rgba(255,255,255,0.15)',
  borderRadius: '15px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    background: 'rgba(255,255,255,0.2)'
  }
}));

const StatNumber = styled('div')(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '5px'
}));

const StatLabel = styled('div')(({ theme }) => ({
  fontSize: '0.9rem',
  opacity: 0.8
}));

// Content section
const ContentSection = styled('div')(({ theme }) => ({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '60px 20px',
  background: 'white',
  borderRadius: '30px 30px 0 0',
  marginTop: '-30px',
  position: 'relative',
  zIndex: 2,
  boxShadow: '0 -20px 40px rgba(0,0,0,0.1)'
}));

// Sort dropdown
const SortContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: '40px'
}));

const SortDropdownButton = styled('button')(({ theme }) => ({
  border: '2px solid #667eea',
  background: 'white',
  borderRadius: '12px',
  padding: '12px 20px',
  fontSize: 15,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  position: 'relative',
  minWidth: 200,
  fontFamily: 'inherit',
  transition: 'all 0.3s ease',
  outline: 'none',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
  '&:hover, &:focus': {
    border: '2px solid #5a67d8',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
    transform: 'translateY(-2px)'
  }
}));

const SortMenu = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '120%',
  right: 0,
  background: 'white',
  border: '2px solid #667eea',
  borderRadius: '12px',
  minWidth: 200,
  zIndex: 10,
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  overflow: 'hidden'
}));

const SortMenuItem = styled('div')(({ theme }) => ({
  padding: '15px 20px',
  fontSize: 14,
  cursor: 'pointer',
  color: '#333',
  background: 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#f8fafc',
    color: '#667eea'
  },
  '&:first-of-type': {
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
  },
  '&:last-of-type': {
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px'
  }
}));

// Products grid
const ProductsGrid = styled(Grid)(({ theme }) => ({
  marginTop: '30px',
  '& .MuiGrid-item': {
    display: 'flex'
  }
}));

// Pagination
const CustomPagination = styled(Pagination)(({ theme }) => ({
  marginTop: '40px',
  '& .MuiPaginationItem-root': {
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 48,
    minHeight: 48,
    color: '#64748b',
    background: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#667eea',
      background: '#f8fafc',
      color: '#667eea',
      transform: 'translateY(-2px)'
    },
    '&.Mui-selected': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderColor: '#667eea',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    }
  }
}));

// Empty state
const EmptyState = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: '80px 20px',
  '& .MuiSvgIcon-root': {
    fontSize: '80px',
    color: '#cbd5e1',
    marginBottom: '20px'
  }
}));

const sortOptions = [
  { value: 'createdAtDesc', label: 'Sản phẩm mới nhất' },
  { value: 'priceAsc', label: 'Giá tăng dần' },
  { value: 'priceDesc', label: 'Giá giảm dần' },
  { value: 'nameAsc', label: 'Sản phẩm từ A-Z' },
  { value: 'nameDesc', label: 'Sản phẩm từ Z-A' }
];

const CollectionDetail = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState('createdAtDesc');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const ITEMS_PER_PAGE = 12;

  // Fetch collection by slug
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const collectionData = await getCollectionBySlug(slug);
        setCollection(collectionData);
        
        if (collectionData && collectionData.products && collectionData.products.length > 0) {
          await fetchCollectionProducts(collectionData.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin collection');
        setCollection(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  // Fetch products for collection
  const fetchCollectionProducts = async (productIds) => {
    try {
      const allProducts = [];
      const categoryIds = [...new Set(productIds.map(p => p.categoryId))];
      
      for (const categoryId of categoryIds) {
        const response = await getProductsByCategory(categoryId, 1, 100);
        if (response.products) {
          allProducts.push(...response.products);
        }
      }
      
      const collectionProductIds = productIds.map(p => p._id);
      const filteredProducts = allProducts.filter(product => 
        collectionProductIds.includes(product._id)
      );
      
      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error fetching collection products:', err);
      setProducts([]);
    }
  };

  // Sort products based on sort option
  const getSortedProducts = () => {
    let sorted = [...products];

    switch (sortOption) {
      case 'nameAsc':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'nameDesc':
        sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      case 'priceAsc':
        sorted.sort((a, b) => (a.exportPrice || 0) - (b.exportPrice || 0));
        break;
      case 'priceDesc':
        sorted.sort((a, b) => (b.exportPrice || 0) - (a.exportPrice || 0));
        break;
      case 'createdAtDesc':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return sorted;
  };

  // Calculate pagination
  const sortedProducts = getSortedProducts();
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);
  const totalPagesCount = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setPage(1);
  };

  // For closing menu on outside click
  React.useEffect(() => {
    if (!sortMenuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.sort-dropdown-root')) setSortMenuOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [sortMenuOpen]);

  const currentSort = sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0];

  if (loading) {
    return (
      <PageWrapper>
        <HeroSection>
          <HeroContent>
            <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.3)' }} />
          </HeroContent>
        </HeroSection>
        <ContentSection>
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </Grid>
            ))}
          </Grid>
        </ContentSection>
      </PageWrapper>
    );
  }

  if (error || !collection) {
    return (
      <PageWrapper>
        <HeroSection>
          <HeroContent>
            <BackButton component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
              Quay về trang chủ
            </BackButton>
            <Typography variant="h3" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
              Collection không tồn tại
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
              {error || 'Không thể tải thông tin collection'}
            </Typography>
          </HeroContent>
        </HeroSection>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <BackButton component={RouterLink} to="/collections" startIcon={<ArrowBackIcon />}>
            Quay lại Collections
          </BackButton>

          <CollectionTitle variant="h1">
            {collection.name}
          </CollectionTitle>
          
          {collection.description && (
            <CollectionSubtitle variant="body1">
              {collection.description}
            </CollectionSubtitle>
          )}

          <StatsContainer>
            <StatItem>
              <StatNumber>{sortedProducts.length}</StatNumber>
              <StatLabel>Sản phẩm</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>
                {collection.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
              </StatNumber>
              <StatLabel>Trạng thái</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>
                {sortedProducts.length > 0 ? 
                  Math.round(sortedProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / sortedProducts.length * 10) / 10 
                  : 0
                }
              </StatNumber>
              <StatLabel>Đánh giá TB</StatLabel>
            </StatItem>
          </StatsContainer>
        </HeroContent>
      </HeroSection>

      {/* Content Section */}
      <ContentSection>
        {/* Sort Dropdown */}
        <SortContainer>
          <Box className='sort-dropdown-root' sx={{ position: 'relative' }}>
            <SortDropdownButton
              onClick={() => setSortMenuOpen((open) => !open)}
              tabIndex={0}
              aria-haspopup='listbox'
              aria-expanded={sortMenuOpen}
            >
              <span style={{ fontWeight: 500 }}>{currentSort.label}</span>
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
                      handleSortChange(opt.value);
                      setSortMenuOpen(false);
                    }}
                    style={{
                      fontWeight: sortOption === opt.value ? 600 : 400,
                      background: sortOption === opt.value ? '#f1f5f9' : 'white',
                      color: sortOption === opt.value ? '#667eea' : '#333'
                    }}
                  >
                    {opt.label}
                  </SortMenuItem>
                ))}
              </SortMenu>
            )}
          </Box>
        </SortContainer>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <ProductsGrid container spacing={3}>
              {currentProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </ProductsGrid>

            {/* Pagination */}
            {totalPagesCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CustomPagination
                  count={totalPagesCount}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <EmptyState>
            <ShoppingBagIcon />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Không có sản phẩm nào trong collection này
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng quay lại sau hoặc khám phá các collection khác
            </Typography>
          </EmptyState>
        )}
      </ContentSection>
    </PageWrapper>
  );
};

export default CollectionDetail; 
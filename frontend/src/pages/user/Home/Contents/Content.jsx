import React, { useEffect, useState } from 'react'
import '~/assets/HomeCSS/Content.css'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getProducts } from '~/services/productService.js'
import FlashSaleSection from '~/pages/user/Home/FlashSaleSection/FlashSaleSection.jsx'
import CouponList from '~/pages/user/Home/CouponList/CouponList.jsx'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { getBanners } from '~/services/admin/webConfig/bannerService.js'
import { getFeaturedCategories } from '~/services/admin/webConfig/featuredcategoryService.js'
import { getServiceHighlights } from '~/services/admin/webConfig/highlightedService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import ProductHorizontalScroll from '~/components/ProductCards/ProductHorizontalScroll'

const Content = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [middleBanners, setMiddleBanners] = useState([])
  const [bannerLoading, setBannerLoading] = useState(true)
  const [featuredCategories, setFeaturedCategories] = useState([])
  const [featuredCategoriesLoading, setFeaturedCategoriesLoading] = useState(true)
  const [serviceHighlights, setServiceHighlights] = useState([])
  const [serviceHighlightsLoading, setServiceHighlightsLoading] = useState(true)
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // Responsive logic for determining number of products to show
  const getResponsiveProductCount = () => {
    const { width } = screenSize

    if (width <= 480) return 4  // Mobile: 1-2 cards per row
    else if (width <= 768) return 6  // Tablet: 2-3 cards per row
    else if (width <= 1200) return 8  // Small desktop: 3-4 cards per row
    else return 12  // Large desktop: 4+ cards per row
  }

  // Handle window resize with debounce
  useEffect(() => {
    let timeoutId

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { products } = await getProducts(1, 1000)
        setProducts(products)
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Fetch middle banners
  useEffect(() => {
    const fetchMiddleBanners = async () => {
      try {
        const allBanners = await getBanners()
        const middleBanners = allBanners.filter(
          (banner) => banner.position === 'middle' && banner.visible === true
        )
        setMiddleBanners(middleBanners)
      } catch (error) {
        console.error('Error fetching middle banners:', error)
      } finally {
        setBannerLoading(false)
      }
    }

    fetchMiddleBanners()
  }, [])

  // Fetch featured categories
  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        const data = await getFeaturedCategories()
        setFeaturedCategories(data || [])
      } catch (error) {
        console.error('Error fetching featured categories:', error)
      } finally {
        setFeaturedCategoriesLoading(false)
      }
    }

    fetchFeaturedCategories()
  }, [])

  // Fetch service highlights
  useEffect(() => {
    const fetchServiceHighlights = async () => {
      try {
        const data = await getServiceHighlights()
        setServiceHighlights(data || [])
      } catch (error) {
        console.error('Error fetching service highlights:', error)
      } finally {
        setServiceHighlightsLoading(false)
      }
    }

    fetchServiceHighlights()
  }, [])

  // Extended fallback categories to ensure 12 items for 3-3-3-3 layout
  const fallbackCategories = [
    {
      title: 'Váy giá tốt chọn',
      subtitle: 'TechUrban',
      discount: '50%',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      imageUrl: 'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi',
    },
    {
      title: 'Sản phẩm DENIM',
      discount: '30%',
      gradient: 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)',
      imageUrl: 'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi',
    },
    {
      title: 'Đồ mặc HÀNG NGÀY',
      discount: '40%',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      imageUrl: 'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi',
    },
    {
      title: 'Đồ ĐI LÀM',
      discount: '25%',
      gradient: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)',
      imageUrl: 'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi',
    }
  ]

  // Use featured categories from API or fallback
  const categories = featuredCategoriesLoading || featuredCategories.length === 0
    ? fallbackCategories
    : featuredCategories
  // helper
  const getGridColumns = (desktop, tablet, mobile) => {
    const width = window.innerWidth;
    if (width >= 1024) return `repeat(${desktop}, 1fr)`; // desktop
    if (width >= 640) return `repeat(${tablet}, 1fr)`; // tablet
    return `repeat(${mobile}, 1fr)`; // mobile
  };

  // Get responsive product count
  const responsiveProductCount = getResponsiveProductCount()
  const [featureCols, setFeatureCols] = useState(getGridColumns(4, 2, 1));
  const [categoryCols, setCategoryCols] = useState(getGridColumns(4, 2, 1));

  useEffect(() => {
    const handleResize = () => {
      setFeatureCols(getGridColumns(4, 2, 1));
      setCategoryCols(getGridColumns(4, 2, 1));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <div className="content-container" style={{ width: '100%', maxWidth: '97vw' }} >
        {/* Features Section */}
        {!serviceHighlightsLoading && serviceHighlights.length > 0 && (
          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: featureCols, // ví dụ: 'repeat(4, 1fr)'
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {serviceHighlights.map((service, index) => (
              <div
                key={index}
                className="feature-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)', // hiệu ứng phân tách nhẹ
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                <div className="feature-icon" style={{ flexShrink: 0 }}>
                  {service.imageUrl ? (
                    <img
                      src={optimizeCloudinaryUrl(service.imageUrl, {
                        width: 40,
                        height: 40,
                        quality: 'auto',
                        format: 'auto',
                      })}
                      alt={service.title}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '50%',
                      }}
                    >
                      <span style={{ fontSize: '20px', color: '#9ca3af' }}></span>
                    </div>
                  )}
                </div>
                <div className="feature-text" style={{ flex: 1 }}>
                  <div
                    className="feature-title"
                    style={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#111827',
                      marginBottom: '4px',
                      textAlign: 'left',
                      lineHeight: '1.4',
                    }}
                  >
                    {service.title}
                  </div>
                  <div
                    className="feature-desc"
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      textAlign: 'left',
                      lineHeight: '1.4',
                    }}
                  >
                    {service.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>


        )}

        {/* Category Section */}
        <div
          className="category-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: categoryCols,
            gap: '12px',
          }}
        >
          {categories.map((category, index) => (
            <a
              key={index}
              href={
                featuredCategoriesLoading || featuredCategories.length === 0
                  ? category.link
                  : category.link || '#'
              }
              className="category-card"
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
            >
              <div
                className="category-image"
                style={{
                  aspectRatio: '4 / 3',
                  width: '100%',
                  backgroundImage:
                    featuredCategoriesLoading || featuredCategories.length === 0
                      ? `url(${category.imageUrl})`
                      : `url(${optimizeCloudinaryUrl(category.imageUrl, {
                        quality: 'auto',
                        format: 'auto',
                        crop: 'fit'
                      })})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <div className="category-overlay" style={{ background: 'rgba(0,0,0,0.3)', height: '100%' }}></div>
                {!featuredCategoriesLoading && featuredCategories.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '12px',
                      right: '12px',
                      color: 'white',
                      zIndex: 2,
                      maxWidth: '80%',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                      }}
                    >
                      {category.name}
                    </h3>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

      </div>

      <CouponList />
      <div className="content-container">
        {/* Middle Banners Section */}
        {!bannerLoading && middleBanners.length > 0 && (
          <div className="middle-banners-section">
            {middleBanners.map((banner, index) => (
              <div key={banner._id || index} className="middle-banner">
                {banner.link ? (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <img
                      src={optimizeCloudinaryUrl(banner.imageUrl, {
                        width: 1200,
                        height: 400,
                        quality: 'auto',
                        format: 'auto',
                      })}
                      alt={banner.title || `Banner ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    />
                  </a>
                ) : (
                  <img
                    src={optimizeCloudinaryUrl(banner.imageUrl, {
                      width: 1200,
                      height: 400,
                      quality: 'auto',
                      format: 'auto',
                    })}
                    alt={banner.title || `Banner ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Flash Sale Section */}
        <FlashSaleSection products={products} loading={loading} error={error} />
      </div>
      <Box
        sx={{
          width: '99vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pl: 1.3,
        }}
      >
        <ProductHorizontalScroll
          products={[...products].slice(-12).reverse()}
          maxVisible={6}
          itemWidth={260}
        />
        {(() => {
          // Lọc sản phẩm mới trong 7 ngày để kiểm tra có hiển thị nút "Xem tất cả" không
          const now = new Date()
          const sevenDaysAgo = new Date(now)
          sevenDaysAgo.setDate(now.getDate() - 7)
          const newProducts = products.filter(product => {
            const createdAt = new Date(product.createdAt)
            return createdAt >= sevenDaysAgo && createdAt <= now
          })

          return newProducts.length > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '32px' }}>
              <Link to="/productnews">
                <button className="cta-button" >Xem tất cả</button>
              </Link>
            </div>
          )
        })()}
      </Box>
    </>
  )
}

export default Content 
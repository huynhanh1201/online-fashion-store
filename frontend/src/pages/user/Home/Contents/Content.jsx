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
  const [featuredCategoriesLoading, setFeaturedCategoriesLoading] =
    useState(true)
  const [serviceHighlights, setServiceHighlights] = useState([])
  const [serviceHighlightsLoading, setServiceHighlightsLoading] = useState(true)
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Responsive logic for determining number of products to show
  const getResponsiveProductCount = () => {
    const { width } = screenSize

    // Breakpoints based on CSS media queries
    if (width <= 480) {
      // Mobile: 1-2 cards per row, show 4 products (2 rows)
      return 4
    } else if (width <= 768) {
      // Tablet: 2-3 cards per row, show 6 products (2 rows)
      return 6
    } else if (width <= 1200) {
      // Small desktop: 3-4 cards per row, show 8 products (2 rows)
      return 8
    } else {
      // Large desktop: 4+ cards per row, show 12 products (2 rows)
      return 12
    }
  }

  // Handle window resize with debounce
  useEffect(() => {
    let timeoutId

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 100) // Debounce 100ms
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
        // Filter banners with position 'middle' and visible = true
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

  // Fallback categories if API fails or no data
  const fallbackCategories = [
    {
      title: 'Váy giá tốt chọn',
      subtitle: 'TechUrban',
      discount: '50%',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      imageUrl:
        'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi'
    },
    {
      title: 'Sản phẩm DENIM',
      discount: '30%',
      gradient: 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)',
      imageUrl:
        'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi'
    },
    {
      title: 'Đồ mặc HÀNG NGÀY',
      discount: '40%',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      imageUrl:
        'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi'
    },
    {
      title: 'Đồ ĐI LÀM',
      discount: '25%',
      gradient: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)',
      imageUrl:
        'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png',
      link: '/categories/ao-so-mi'
    }
  ]

  // Use featured categories from API or fallback
  const categories =
    featuredCategoriesLoading || featuredCategories.length === 0
      ? fallbackCategories
      : featuredCategories

  // Get responsive product count
  const responsiveProductCount = getResponsiveProductCount()

  return (
    <>
      <div className='content-container'>
        {/* Features Section - Only show if there's data */}
        {!serviceHighlightsLoading && serviceHighlights.length > 0 && (
          <div className='features-grid'>
            {serviceHighlights.map((service, index) => (
              <div key={index} className='feature-card'>
                <div className='feature-icon'>
                  {service.imageUrl ? (
                    <img
                      src={optimizeCloudinaryUrl(service.imageUrl, {
                        width: 40,
                        height: 40,
                        quality: 'auto',
                        format: 'auto'
                      })}
                      alt={service.title}
                      style={{ width: 40, height: 40, objectFit: 'contain' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{ fontSize: '20px', color: '#9ca3af' }}>
                        ⚡
                      </span>
                    </div>
                  )}
                </div>
                <div className='feature-text'>
                  <div
                    className='feature-title'
                    style={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#222',
                      marginBottom: 2,
                      textAlign: 'left'
                    }}
                  >
                    {service.title}
                  </div>
                  <div
                    className='feature-desc'
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      textAlign: 'left'
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
        <div className='category-grid'>
          {categories.map((category, index) => (
            <a
              key={index}
              href={
                featuredCategoriesLoading || featuredCategories.length === 0
                  ? category.link
                  : category.link || '#'
              }
              className='category-card'
              style={{
                textDecoration: 'none',
                color: 'inherit',
                maxWidth: '400px',
                width: '100%'
              }}
            >
              <div
                className='category-image'
                style={{
                  backgroundImage:
                    featuredCategoriesLoading || featuredCategories.length === 0
                      ? `url(${category.imageUrl})`
                      : `url(${optimizeCloudinaryUrl(category.imageUrl, {
                          width: 480,
                          height: 300,
                          quality: 'auto',
                          format: 'auto'
                        })})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative'
                }}
              >
                <div className='category-overlay'></div>
                {/* Show category name if it's from API */}
                {!featuredCategoriesLoading &&
                  featuredCategories.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50px',
                        left: '20px',
                        right: '20px',
                        color: 'white',
                        zIndex: 2,
                        maxWidth: '50%',
                        width: '100%'
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '35px',
                          fontWeight: '600',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
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
      <Box sx={{ width: 'auto' }}>
        <CouponList />
      </Box>
      <div className='content-container'>
        {/* Middle Banners Section */}
        {!bannerLoading && middleBanners.length > 0 && (
          <div className='middle-banners-section'>
            {middleBanners.map((banner, index) => (
              <div key={banner._id || index} className='middle-banner'>
                {banner.link ? (
                  <a
                    href={banner.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <img
                      src={optimizeCloudinaryUrl(banner.imageUrl, {
                        width: 1200,
                        height: 400,
                        quality: 'auto',
                        format: 'auto'
                      })}
                      alt={banner.title || `Banner ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                  </a>
                ) : (
                  <img
                    src={optimizeCloudinaryUrl(banner.imageUrl, {
                      width: 1200,
                      height: 400,
                      quality: 'auto',
                      format: 'auto'
                    })}
                    alt={banner.title || `Banner ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      borderRadius: '8px'
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
          flexDirection: 'column', // Sắp xếp dọc
          justifyContent: 'center',
          alignItems: 'center',
          pl: 1.3
        }}
      >
        <ProductHorizontalScroll
          products={[...products].slice(-12).reverse()}
          maxVisible={6}
          itemWidth={260}
        />
        {products.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to='/productnews'>
              <button className='cta-button'>Xem tất cả</button>
            </Link>
          </div>
        )}
      </Box>
    </>
  )
}

export default Content

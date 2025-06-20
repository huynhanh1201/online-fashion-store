import React, { useEffect, useState } from 'react'
import '~/assets/HomeCSS/Content.css'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getProducts } from '~/services/productService.js'
import FlashSaleSection from '~/pages/user/Home/FlashSaleSection/FlashSaleSection.jsx'
import CouponList from '~/pages/user/Home/CouponList/CouponList.jsx'
import { Link } from 'react-router-dom'
import ProductsCardNew from '~/pages/user/NewProducts/ProductsCardNew'
import { getBanners } from '~/services/admin/webConfig/bannerService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const Content = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [middleBanners, setMiddleBanners] = useState([])
  const [bannerLoading, setBannerLoading] = useState(true)

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
        const middleBanners = allBanners.filter(banner => 
          banner.position === 'middle' && banner.visible === true
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

  // Sample data
  const categories = [
    {
      title: 'Váy giá tốt chọn',
      subtitle: 'TechUrban',
      discount: '50%',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      imageUrl:
        '//file.hstatic.net/1000360022/file/tuj_b955c48e5d86485da0b3f956170a82e5_grande.jpg',
      link: '/categories/ao-so-mi'
    },
    {
      title: 'Sản phẩm DENIM',
      discount: '30%',
      gradient: 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)',
      imageUrl:
        '//file.hstatic.net/1000360022/file/denim_4d32d2b2d0a246778670c27e4f1a0043_grande.jpg',
      link: '/categories/ao-so-mi'
    },
    {
      title: 'Đồ mặc HÀNG NGÀY',
      discount: '40%',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      imageUrl:
        '//file.hstatic.net/1000360022/file/hang_ngay_15b34a1891bb486c856e1562740c9ddd_grande.jpg',
      link: '/categories/ao-so-mi'
    },
    {
      title: 'Đồ ĐI LÀM',
      discount: '25%',
      gradient: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)',
      imageUrl:
        '//file.hstatic.net/1000360022/file/di_lam_7d49a1d48da348599c3047dd2cb92754_grande.jpg',
      link: '/categories/ao-so-mi'
    }
  ]

  return (
    <div className='content-container'>
      {/* Features Section */}
      <div className='features-grid'>
        {[
          {
            title: 'Miễn phí vận chuyển',
            desc: 'Đơn hàng trên 500K',
            image:
              'https://file.hstatic.net/1000360022/file/giaohangnhanh_abaa5d524e464a0c8547a91ad9b50968.png'
          },
          {
            title: 'Ship COD toàn quốc',
            desc: 'Yên tâm mua sắm ',
            image:
              'https://file.hstatic.net/1000360022/file/cod_5631433f0ad24c949e44e512b8535c43.png' // ví dụ minh họa
          },
          {
            title: 'Đổi trả dễ dàng',
            desc: '7 ngày đổi trả',
            image:
              'https://file.hstatic.net/1000360022/file/giaohang_2943ae148bf64680bf20c3d881c898c9.png' // ví dụ minh họa
          },
          {
            title: 'Hotline: 0123456789',
            desc: 'Hỗ trợ bạn 24/24 ',
            image:
              'https://file.hstatic.net/1000360022/file/cod_5631433f0ad24c949e44e512b8535c43.png' // ví dụ minh họa
          }
        ].map((feature, index) => (
          <div key={index} className='feature-card'>
            <div className='feature-icon'>
              {feature.image ? (
                <img
                  src={feature.image}
                  alt={feature.title}
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
              ) : (
                feature.icon
              )}
            </div>
            <div className='feature-title'>{feature.title}</div>
            <div className='feature-desc'>{feature.desc}</div>
          </div>
        ))}
      </div>

      {/* Category Section */}
      <div className='category-grid'>
        {categories.map((category, index) => (
          <a
            key={index}
            href={category.link}
            className='category-card'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              className='category-image'
              style={{
                backgroundImage: `url(${category.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <div className='category-overlay'></div>
            </div>
          </a>
        ))}
      </div>
      <CouponList />
      
      {/* Middle Banners Section */}
      {!bannerLoading && middleBanners.length > 0 && (
        <div className='middle-banners-section'>
          {middleBanners.map((banner, index) => (
            <div key={banner._id || index} className='middle-banner'>
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

      {/* Stitch Products */}
      <div className='product-grid'>
        {[...products.slice(-5)].reverse().map((product) => (
          <ProductsCardNew key={product._id || product.id} product={product} />
        ))}
      </div>

      {products.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to='/productnews'>
            <button className='cta-button'>Xem tất cả</button>
          </Link>
        </div>
      )}

      {/* Flash Sale Section */}
      <FlashSaleSection products={products} loading={loading} error={error} />
    </div>
  )
}

export default Content

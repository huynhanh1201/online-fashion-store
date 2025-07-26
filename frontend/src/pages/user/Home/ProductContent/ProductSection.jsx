import ProductCard from '~/components/ProductCards/ProductCards.jsx'
import React, { useState, useEffect } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const styles = {
  section: {
    marginBottom: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    alignItems: 'start'
  },
  banner: {
    position: 'relative',
    height: '523px',
    borderRadius: '10px',
    overflow: 'hidden',
    gridColumn: '1',
    gridRow: '1'
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
    borderRadius: '10px',
  },
  bannerText: {
    position: 'absolute',
    bottom: '10px',      // thay vì top
    left: '10px',        // cách mép trái 30px
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    zIndex: 2,
    maxWidth: '80%'      // giúp text không bị tràn
  },
  bannerTitle: {
    margin: '0 0 8px 0',
    fontSize: '36px',     // giảm lại chút cho phù hợp vị trí
    fontWeight: 700,
    lineHeight: '1.2'
  },
  bannerDesc: {
    margin: '0',
    fontSize: '14px',
    opacity: 0.9,
    lineHeight: '1.4'
  }
,
  productItem: {
    width: '100%'
  },
  loadingContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '16px'
  },
  errorContainer: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '20px',
    color: '#d32f2f',
    fontSize: '16px'
  },
  noProducts: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    fontSize: '16px'
  }
}

const ProductGrid = ({ children }) => {
  const gridStyles = {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(4, 1fr)'
  }

  const mediaStyles = `
    @media (max-width: 1200px) {
      .product-grid-dynamic {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    @media (max-width: 900px) {
      .product-grid-dynamic {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 600px) {
      .product-grid-dynamic {
        grid-template-columns: repeat(1, 1fr) !important;
      }
    }
  `

  return (
    <>
      <style>{mediaStyles}</style>
      <div className='product-grid-dynamic' style={gridStyles}>
        {children}
      </div>
    </>
  )
}

const ProductSection = ({
  bannerImg,
  bannerTitle,
  bannerDesc,
  products,
  loading,
  error
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={styles.section}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '290px 1fr',
          gap: isMobile ? '16px' : '20px',
          alignItems: isMobile ? 'stretch' : 'center', 
        }}
      >
        {/* Banner cho category hiện tại */}
        {products && products[0]?.categoryId ? (
          <Link to={`/productbycategory/${products[0].categoryId}`} style={{ textDecoration: 'none' }}>
            <div style={{ ...styles.banner, height: isMobile ? 220 : 523, cursor: 'pointer' }}>
              <img
                src={
                  bannerImg
                    ? bannerImg
                    : 'https://placehold.co/500x440?text=No+Category+Image'
                }
                alt={bannerTitle || 'Banner'}
                style={{ ...styles.bannerImg, height: isMobile ? 220 : '100%' }}
                onError={(e) => {
                  console.error('Banner image failed to load:', e.target.src)
                  e.target.src =
                    'https://placehold.co/500x440?text=Image+Error'
                }}
              />
              <div style={{
                ...styles.bannerText,
                top: isMobile ? 40 : 30,
                left: isMobile ? 20 : 10,
              }}>
                {/* <h2 style={{
                  ...styles.bannerTitle,
                  fontSize: isMobile ? 24 : 35,
                  marginBottom: isMobile ? 4 : 8
                }}>
                  {bannerTitle || 'Danh mục sản phẩm'}
                </h2> */}
                {bannerDesc && <p style={{ ...styles.bannerDesc, fontSize: isMobile ? 12 : 14 }}>{bannerDesc}</p>}
              </div>
            </div>
          </Link>
        ) : (
          <div style={{ ...styles.banner, height: isMobile ? 220 : 523 }}>
            <img
              src={
                bannerImg
                  ? bannerImg
                  : 'https://placehold.co/500x440?text=No+Category+Image'
              }
              alt={bannerTitle || 'Banner'}
              style={{ ...styles.bannerImg, height: isMobile ? 220 : '100%' }}
              onError={(e) => {
                console.error('Banner image failed to load:', e.target.src)
                e.target.src =
                  'https://placehold.co/500x440?text=Image+Error'
              }}
            />
            <div style={{
              ...styles.bannerText,
              top: isMobile ? 40 : 150,
              left: isMobile ? 20 : 70,
            }}>
              <h2 style={{
                ...styles.bannerTitle,
                fontSize: isMobile ? 24 : 50,
                marginBottom: isMobile ? 4 : 8
              }}>
                {bannerTitle || 'Danh mục sản phẩm'}
              </h2>
              {bannerDesc && <p style={{ ...styles.bannerDesc, fontSize: isMobile ? 12 : 14 }}>{bannerDesc}</p>}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <CircularProgress />
            <Typography>Đang tải sản phẩm...</Typography>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.errorContainer}>
            <Typography color='error'>{error}</Typography>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products && products.length > 0 ? (
          <ProductGrid>
            {products.slice(0, 4).map((product) => {
              // Xử lý ảnh sản phẩm
              let productImage =
                'https://placehold.co/500x440?text=No+Category+Image'

              if (product.image) {
                if (Array.isArray(product.image) && product.image.length > 0) {
                  productImage = product.image[0]
                } else if (typeof product.image === 'string') {
                  productImage = product.image
                }
              }

              return (
                <div key={product._id || product.id} style={styles.productItem}>
                  <ProductCard product={product} />
                </div>
              )
            })}
          </ProductGrid>
        ) : !loading && !error ? (
          <div style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>
            <Typography>Không có sản phẩm để hiển thị</Typography>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductSection

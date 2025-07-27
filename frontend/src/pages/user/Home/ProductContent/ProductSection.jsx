import React, { useState, useEffect } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import ProductCard from '~/components/ProductCards/ProductCards.jsx'

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
    borderRadius: '10px'
  },
  bannerText: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    zIndex: 2,
    maxWidth: '80%'
  },
  bannerTitle: {
    margin: '0 0 8px 0',
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: '1.2'
  },
  bannerDesc: {
    margin: '0',
    fontSize: '14px',
    opacity: 0.9,
    lineHeight: '1.4'
  },
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
  @media (max-width: 1400px) {
      .product-grid-dynamic {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    @media (max-width: 1200px) {
      .product-grid-dynamic {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 900px) {
      .product-grid-dynamic {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 680px) {
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
  const [screenSize, setScreenSize] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width <= 600) {
        setScreenSize('mobile')
      } else if (width <= 900) {
        setScreenSize('tablet')
      } else if (width <= 1200) {
        setScreenSize('laptop')
      } else if (width <= 1400) {
        setScreenSize('laptop-lage')
      } else if (width <= 1700) {
        setScreenSize('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  let visibleCount = 4
  if (screenSize === 'mobile') visibleCount = 1
  else if (screenSize === 'tablet') visibleCount = 2
  else if (screenSize === 'laptop') visibleCount = 2
  else if (screenSize === 'laptop-lage') visibleCount = 3
  else if (screenSize === 'desktop') visibleCount = 4

  return (
    <div style={styles.section}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            screenSize === 'tablet' || screenSize === 'mobile'
              ? '1fr'
              : '290px 1fr',
          gap: screenSize === 'mobile' ? '16px' : '20px',
          alignItems: screenSize === 'mobile' ? 'stretch' : 'center'
        }}
      >
        {products && products[0]?.categoryId ? (
          <Link
            to={`/productbycategory/${products[0].categoryId}`}
            style={{
              textDecoration: 'none',
              display:
                screenSize === 'tablet' || screenSize === 'mobile'
                  ? 'none'
                  : 'block'
            }}
          >
            <div
              style={{
                ...styles.banner,
                height: screenSize === 'mobile' ? 220 : 523,
                cursor: 'pointer'
              }}
            >
              <img
                src={
                  bannerImg
                    ? bannerImg
                    : 'https://placehold.co/500x440?text=No+Category+Image'
                }
                alt={bannerTitle || 'Banner'}
                style={{
                  ...styles.bannerImg,
                  height: screenSize === 'mobile' ? 220 : '100%'
                }}
                onError={(e) => {
                  console.error('Banner image failed to load:', e.target.src)
                  e.target.src = 'https://placehold.co/500x440?text=Image+Error'
                }}
              />
              <div
                style={{
                  ...styles.bannerText,
                  top: screenSize === 'mobile' ? 40 : 30,
                  left: screenSize === 'mobile' ? 20 : 10
                }}
              >
                {/* <h2
                  style={{
                    ...styles.bannerTitle,
                    fontSize: screenSize === 'mobile' ? 24 : 35,
                    marginBottom: screenSize === 'mobile' ? 4 : 8
                  }}
                >
                  {bannerTitle || 'Danh mục sản phẩm'}
                </h2> */}
                {/* {bannerDesc && (
                  <p
                    style={{
                      ...styles.bannerDesc,
                      fontSize: screenSize === 'mobile' ? 12 : 14
                    }}
                  >
                    {bannerDesc}
                  </p>
                )} */}
              </div>
            </div>
          </Link>
        ) : (
          <div
            style={{
              ...styles.banner,
              height: screenSize === 'mobile' ? 220 : 523
            }}
          >
            <img
              src={
                bannerImg
                  ? bannerImg
                  : 'https://placehold.co/500x440?text=No+Category+Image'
              }
              alt={bannerTitle || 'Banner'}
              style={{
                ...styles.bannerImg,
                height: screenSize === 'mobile' ? 220 : '100%'
              }}
              onError={(e) => {
                console.error('Banner image failed to load:', e.target.src)
                e.target.src = 'https://placehold.co/500x440?text=Image+Error'
              }}
            />
            <div
              style={{
                ...styles.bannerText,
                top: screenSize === 'mobile' ? 40 : 150,
                left: screenSize === 'mobile' ? 20 : 70
              }}
            >
              <h2
                style={{
                  ...styles.bannerTitle,
                  fontSize: screenSize === 'mobile' ? 24 : 50,
                  marginBottom: screenSize === 'mobile' ? 4 : 8
                }}
              >
                {bannerTitle || 'Danh mục sản phẩm'}
              </h2>
              {bannerDesc && (
                <p
                  style={{
                    ...styles.bannerDesc,
                    fontSize: screenSize === 'mobile' ? 12 : 14
                  }}
                >
                  {bannerDesc}
                </p>
              )}
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
            {products.slice(0, visibleCount).map((product) => {
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

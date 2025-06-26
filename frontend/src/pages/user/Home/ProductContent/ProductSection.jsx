import ProductCard from '~/components/ProductCards/ProductCards.jsx'
import React from 'react'
import { CircularProgress, Typography } from '@mui/material'

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
    borderRadius: '10px'
  },
  bannerText: {
    position: 'absolute',
    top: '150px',
    left: '70px',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  bannerTitle: {
    margin: '0 0 8px 0',
    fontSize: '50px',
    fontWeight: '1000'
  },
  bannerDesc: {
    margin: '0',
    fontSize: '14px',
    opacity: '0.9'
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

const ProductSection = ({
  bannerImg,
  bannerTitle,
  bannerDesc,
  products,
  loading,
  error
}) => {
  return (
    <div style={styles.section}>
      <div className='product-grid' style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '20px', alignItems: 'center' }}>
        {/* Banner cho category hiện tại */}
        <div style={styles.banner}>
          <img
            src={
              bannerImg
                ? bannerImg
                : 'https://placehold.co/500x440?text=No+Category+Image'
            }
            alt={bannerTitle || 'Banner'}
            style={styles.bannerImg}
            onError={(e) => {
              console.error('Banner image failed to load:', e.target.src)
              e.target.src =
                'https://placehold.co/500x440?text=Image+Error'
            }}
          />
          <div style={styles.bannerText}>
            <h2 style={styles.bannerTitle}>
              {bannerTitle || 'Danh mục sản phẩm'}
            </h2>
            {bannerDesc && <p style={styles.bannerDesc}>{bannerDesc}</p>}
          </div>
        </div>

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
          <div className="product-grid">
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
          </div>
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

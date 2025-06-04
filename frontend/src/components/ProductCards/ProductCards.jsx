import React from 'react'

// Mock Link component for demonstration
const Link = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
)

const renderStars = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <span style={styles.stars}>
      {'★'.repeat(fullStars)}
      {hasHalfStar && '☆'}
      {'☆'.repeat(emptyStars)}
    </span>
  )
}

const ProductCard = ({ product, isFlashSale = false }) => {
  // const quantity = Number(product.quantity) || 0
  // const inStock = quantity > 0

  return (
    <Link
      to={`/productdetail/${product._id}`}
      style={styles.productCardLink}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div
        style={{
          ...styles.productCard,
          ...(isFlashSale ? styles.flashSaleCard : {})
          // ...(inStock ? {} : styles.outOfStockCard)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
          e.currentTarget.style.borderColor = '#e0e0e0'
          const img = e.currentTarget.querySelector('img')
          if (img) img.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
          e.currentTarget.style.borderColor = '#f0f0f0'
          const img = e.currentTarget.querySelector('img')
          if (img) img.style.transform = 'scale(1)'
        }}
      >
        <div style={styles.productImage}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              ...styles.productImg
            }}
          />
          {product.discount > 0 && (
            <div style={styles.discountBadge}>-{product.discount}%</div>
          )}
        </div>
        <div style={styles.productInfo}>
          <h3 style={styles.productName}>{product.name}</h3>
          <div style={styles.priceRow}>
            <span style={styles.currentPrice}>
              {product.exportPrice.toLocaleString()}₫
            </span>
            {product.originalPrice && (
              <span style={styles.originalPrice}>
                {product.originalPrice.toLocaleString()}₫
              </span>
            )}
          </div>
          <div style={styles.productMeta}>
            <div style={styles.rating}>
              <span style={styles.star}>★</span>
              <span>{product.rating}</span>
            </div>
            <span style={styles.sold}>Đã bán {product.sold || '0'}</span>
          </div>
        </div>
        {/*{!inStock && <div style={styles.outOfStockOverlay}>Hết hàng</div>}*/}
      </div>
    </Link>
  )
}

const styles = {
  productCardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'transform 0.2s ease-in-out'
  },

  productCard: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '1px solid #f0f0f0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },

  flashSaleCard: {
    border: '1px solid #ff6b6b',
    position: 'relative'
  },

  outOfStockCard: {
    position: 'relative'
  },

  productImage: {
    position: 'relative',
    width: '100%',
    height: '350px',
    overflow: 'hidden',
    border: '8px solid white'
  },

  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },

  productInfo: {
    padding: '10px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  productName: {
    fontSize: '16px',
    fontWeight: '500 ',
    color: '#333',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  currentPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ff6b6b'
  },

  originalPrice: {
    fontSize: '14px',
    color: '#888',
    textDecoration: 'line-through',
    fontWeight: '500'
  },

  productMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '8px'
  },

  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px'
  },

  star: {
    color: '#ffd700',
    fontSize: '16px'
  },

  sold: {
    fontSize: '13px',
    color: '#888',
    fontWeight: '500'
  },

  stars: {
    color: '#ffd700',
    fontSize: '14px',
    letterSpacing: '1px'
  },

  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
    zIndex: 10
  }
}

// Media queries for responsive design (CSS-in-JS approach)
const useResponsiveStyles = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768)
  const [isSmallMobile, setIsSmallMobile] = React.useState(
    window.innerWidth <= 480
  )

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallMobile(window.innerWidth <= 480)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isSmallMobile) {
    return {
      productCard: {
        ...styles.productCard,
        borderRadius: '8px'
      },
      productImage: {
        ...styles.productImage,
        height: '180px'
      },
      productInfo: {
        ...styles.productInfo,
        padding: '10px',
        gap: '6px'
      },
      productName: {
        ...styles.productName,
        fontSize: '13px',
        minHeight: '36px'
      },
      currentPrice: {
        ...styles.currentPrice,
        fontSize: '15px'
      },
      productMeta: {
        ...styles.productMeta,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px'
      },
      rating: {
        ...styles.rating,
        fontSize: '12px'
      },
      sold: {
        ...styles.sold,
        fontSize: '12px'
      }
    }
  }

  if (isMobile) {
    return {
      productCard: {
        ...styles.productCard,
        borderRadius: '8px'
      },
      productImage: {
        ...styles.productImage,
        height: '200px'
      },
      productInfo: {
        ...styles.productInfo,
        padding: '12px'
      },
      productName: {
        ...styles.productName,
        fontSize: '14px',
        minHeight: '40px'
      },
      currentPrice: {
        ...styles.currentPrice,
        fontSize: '16px'
      },
      originalPrice: {
        ...styles.originalPrice,
        fontSize: '12px'
      },
      discountBadge: {
        ...styles.discountBadge,
        top: '8px',
        left: '8px',
        padding: '3px 8px',
        fontSize: '11px'
      }
    }
  }

  return styles
}

// Enhanced ProductCard with responsive styles
const ResponsiveProductCard = ({ product, isFlashSale = false }) => {
  const responsiveStyles = useResponsiveStyles()
  const quantity = Number(product.quantity) || 0
  const inStock = quantity > 0

  return (
    <Link
      to={`/productdetail/${product._id}`}
      style={responsiveStyles.productCardLink || styles.productCardLink}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div
        style={{
          ...(responsiveStyles.productCard || styles.productCard),
          ...(isFlashSale ? styles.flashSaleCard : {})
          // ...(inStock ? {} : styles.outOfStockCard)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
          e.currentTarget.style.borderColor = '#e0e0e0'
          const img = e.currentTarget.querySelector('img')
          if (img) img.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
          e.currentTarget.style.borderColor = '#f0f0f0'
          const img = e.currentTarget.querySelector('img')
          if (img) img.style.transform = 'scale(1)'
        }}
      >
        <div style={responsiveStyles.productImage || styles.productImage}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              ...styles.productImg,
              ...(inStock ? {} : styles.outOfStockImg)
            }}
          />
          {product.discount > 0 && (
            <div style={responsiveStyles.discountBadge || styles.discountBadge}>
              -{product.discount}%
            </div>
          )}
        </div>
        <div style={responsiveStyles.productInfo || styles.productInfo}>
          <h3 style={responsiveStyles.productName || styles.productName}>
            {product.name}
          </h3>
          <div style={styles.priceRow}>
            <span style={responsiveStyles.currentPrice || styles.currentPrice}>
              {typeof product?.exportPrice === 'number'
                ? product.exportPrice.toLocaleString() + '₫'
                : '—'}
            </span>

            {product.originalPrice && (
              <span
                style={responsiveStyles.originalPrice || styles.originalPrice}
              >
                {product.originalPrice.toLocaleString()}₫
              </span>
            )}
          </div>
          <div style={responsiveStyles.productMeta || styles.productMeta}>
            <div style={responsiveStyles.rating || styles.rating}>
              <span style={styles.star}>★</span>
              <span>{product.rating}</span>
            </div>
            <span style={responsiveStyles.sold || styles.sold}>
              Đã bán {product.sold || '0'}
            </span>
          </div>
        </div>
        {/*{!inStock && <div style={styles.outOfStockOverlay}>Hết hàng</div>}*/}
      </div>
    </Link>
  )
}

export default ResponsiveProductCard

import React from 'react'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const Link = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
)

const ProductCard = ({ product, isFlashSale = false }) => {
  if (!product || !product.image) {
    return <div style={styles.productCard}>No image available</div>
  }

  const imageUrl = Array.isArray(product.image) ? product.image[0] : product.image
  const optimizedImage = optimizeCloudinaryUrl(imageUrl)


  // console.log('Original image URL:', imageUrl)
  // console.log('Optimized image URL:', optimizedImage)

  const quantity = Number(product.quantity) || 0
  const inStock = quantity > 0

  // Hàm xử lý tên sản phẩm
  const truncateProductName = (name) => {
    if (!name) return ''
    return name.length > 17 ? name.substring(0, 20) + '...' : name
  }

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
        }}
      >
        <div
          style={styles.productImage}
          onMouseEnter={(e) => {
            const overlay = e.currentTarget.querySelector('.overlay')
            overlay.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            const overlay = e.currentTarget.querySelector('.overlay')
            overlay.style.opacity = '0'
          }}
        >
          <img
            src={optimizedImage}
            alt={product.name}
            style={{
              ...styles.productImg,
              ...(inStock ? {} : styles.outOfStockImg)
            }}
            loading="lazy"
          />
          {product.discount > 0 && (
            <div style={styles.discountBadge}>-{product.discount}%</div>
          )}
          <div className='overlay' style={styles.overlay}>
            <button
              style={styles.cartButton}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                alert(`Thêm ${product.name} vào giỏ hàng`)
              }}
            >
              🛒
            </button>
          </div>
        </div>

        <div style={styles.productInfo}>
          <h3 style={styles.productName} title={product.name}>
            {truncateProductName(product.name)}
          </h3>
          <div style={styles.priceRow}>
            <span style={styles.currentPrice}>
              {(product.exportPrice ?? 0).toLocaleString()}₫
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
    background: 'white',
    borderRadius: '6px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '2px solid #f0f0f0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '5px 5px',
    boxShadow: '0px 0px 4px 2px #dbdbdb80'
  },
  flashSaleCard: {
    border: '1px solid #ff6b6b',
    position: 'relative'
  },
  productImage: {
    position: 'relative',
    width: '100%',
    height: '400px',
    overflow: 'hidden',
    border: '8px solid white'
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s ease'
  },
  cartButton: {
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease'
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
    fontWeight: '500',
    color: '#333',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    margin: 0,
    padding: 0
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
  }
}

export default ProductCard
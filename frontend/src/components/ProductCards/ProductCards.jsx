import React from 'react'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import Sticker from '~/components/Sticker/Sticker'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, isFlashSale = false }) => {
  if (!product || !product.image) {
    return <div style={styles.productCard}>No image available</div>
  }
  const navigate = useNavigate()

  const images = Array.isArray(product.image) ? product.image : [product.image]
  const imageUrl1 = optimizeCloudinaryUrl(images[0])
  const imageUrl2 = optimizeCloudinaryUrl(images[1] || images[0])

  const [hovered, setHovered] = React.useState(false)

  const quantity = Number(product.quantity) || 0
  const inStock = quantity > 0

  // Hàm xử lý tên sản phẩm
  // const truncateProductName = (name) => {
  //   if (!name) return ''
  //   return name.length > 17 ? name.substring(0, 20) + '...' : name
  // }

  // Hàm render 5 sao rating
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
    const hasHalfStar = (rating || 0) % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Sao đầy
        stars.push(
          <span key={i} style={styles.starFilled}>
            ★
          </span>
        )
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Sao nửa (hiển thị như sao đầy cho đơn giản)
        stars.push(
          <span key={i} style={styles.starFilled}>
            ★
          </span>
        )
      } else {
        // Sao rỗng
        stars.push(
          <span key={i} style={styles.starEmpty}>
            ★
          </span>
        )
      }
    }

    return stars
  }

  // Calculate price based on product export price and first variant's discount price
  const calculateDisplayPrice = () => {
    const originalPrice = product?.exportPrice || 0
    const firstVariantDiscount = product?.firstVariantDiscountPrice || 0
    const displayPrice = Math.max(0, originalPrice - firstVariantDiscount)

    return {
      price: originalPrice,
      discountPrice: displayPrice,
      originalDiscountPrice: firstVariantDiscount
    }
  }

  const priceInfo = calculateDisplayPrice()

  const handleCardClick = () => {
    navigate(`/productdetail/${product._id}`)
  }

  return (
    <div
      style={styles.productCardLink}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      <div
        style={{
          ...styles.productCard,
          ...(isFlashSale ? styles.flashSaleCard : {})
        }}
      >
        {/* Sticker component */}
        <Sticker
          product={product}
          top={10}
          right={10}
          fontSize='12px'
          fontWeight={700}
          padding='4px 12px 4px 8px'
        />

        <div style={styles.productImage}>
          {/* Ảnh chính */}
          <img
            src={imageUrl1}
            alt={product.name}
            style={{
              ...styles.productImg,
              opacity: hovered ? 0 : 1,
              zIndex: hovered ? 1 : 2,
              position: 'absolute',
              transition: 'opacity 0.4s ease'
            }}
            loading='lazy'
          />
          {/* Ảnh hover (ảnh thứ 2 hoặc ảnh 1 nếu không có) */}
          <img
            src={imageUrl2}
            alt={product.name + ' hover'}
            style={{
              ...styles.productImg,
              opacity: hovered ? 1 : 0,
              zIndex: hovered ? 2 : 1,
              position: 'absolute',
              transition: 'opacity 0.7s ease'
            }}
            loading='lazy'
          />
        </div>
        <div style={styles.productInfo}>
          <h3 style={styles.productName} title={product.name}>
            {product.name}
          </h3>
          <div style={styles.priceRow}>
            {priceInfo.originalDiscountPrice > 0 ? (
              <>
                <span style={styles.flashSalePrice}>
                  {priceInfo.discountPrice.toLocaleString('vi-VN')}₫
                </span>
                <span style={styles.originalPrice}>
                  {priceInfo.price.toLocaleString('vi-VN')}₫
                </span>
                <span style={styles.discountBadge}>
                  -
                  {Math.round(
                    (priceInfo.originalDiscountPrice / priceInfo.price) * 100
                  )}
                  %
                </span>
              </>
            ) : (
              <span style={styles.currentPrice}>
                {(product.exportPrice ?? 0).toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          <div style={styles.productMeta}>
            <div style={styles.rating}>
              {renderStars(product.avgRating)}
              <span style={styles.ratingText}>({product.avgRating || 0})</span>
            </div>
            {/* <span style={styles.sold}>Đã bán {product.sold || '0'}</span> */}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  productCardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'transform 0.2s ease-in-out',
    cursor: 'pointer'
  },
  productCard: {
    background: 'white',
    borderRadius: '6px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '2px solid #f0f0f0',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
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
    border: '4px solid white',
    borderRadius: '6px'
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  discountBadge: {
    background: '#ff6b6b',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '4px'
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
    maxWidth: '95%',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
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
    marginTop: 'auto'
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
  starFilled: {
    color: '#ffd700',
    fontSize: '14px',
    marginRight: '1px'
  },
  starEmpty: {
    color: '#ddd',
    fontSize: '14px',
    marginRight: '1px'
  },
  ratingText: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '4px'
  },
  sold: {
    fontSize: '13px',
    color: '#888',
    fontWeight: '500'
  },
  flashSalePrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ff6b6b',
    marginRight: '8px'
  },
  flashSaleBadge: {
    background: 'linear-gradient(90deg, #ff9800 0%, #ff3d00 100%)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    borderRadius: '6px',
    padding: '2px 8px',
    marginLeft: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    boxShadow: '0 2px 8px rgba(255,61,0,0.15)'
  }
}

export default ProductCard

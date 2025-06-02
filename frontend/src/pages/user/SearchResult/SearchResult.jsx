import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProducts } from '~/services/productService'

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    backgroundColor: '#1A3C7B',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: 0,
    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  cartButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem'
  },
  select: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e0e6ed',
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: '#fafbfc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  filterButton: {
    width: '100%',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #1A3C7B, #2a5298)',
    border: 'none',
    color: 'white',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(26, 60, 123, 0.3)'
  },
  resultsHeader: {
    marginBottom: '2.5rem'
  },
  resultsTitle: {
    color: '#1A3C7B',
    fontSize: '2.2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #1A3C7B, #2a5298)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  resultsCount: {
    color: '#6b7280',
    fontSize: '1.1rem',
    margin: 0,
    fontWeight: '500'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '13px',
    overflow: 'hidden',
    boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    height: 'fit-content',
    border: '1px solid rgba(26, 60, 123, 0.05)'
  },
  productImageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    height: '400px'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  },
  discountBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'linear-gradient(135deg, #FF6B35, #ff8555)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
  },
  heartIcon: {
    fontSize: '1.3rem',
    transition: 'all 0.2s ease'
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    backdropFilter: 'blur(2px)'
  },
  productContent: {
    padding: '1.8rem'
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 0.8rem 0',
    color: '#1f2937',
    lineHeight: '1.4',
    height: '2.8rem',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.8rem'
  },
  stars: {
    color: '#fbbf24',
    fontSize: '1.1rem',
    marginRight: '0.6rem',
    textShadow: '0 1px 2px rgba(251, 191, 36, 0.3)'
  },
  reviewCount: {
    color: '#6b7280',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  brandChip: {
    display: 'inline-block',
    background:
      'linear-gradient(135deg, rgba(26, 60, 123, 0.1), rgba(26, 60, 123, 0.05))',
    color: '#1A3C7B',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    marginBottom: '1.2rem',
    border: '1px solid rgba(26, 60, 123, 0.2)',
    fontWeight: '600'
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '0.8rem'
  },
  currentPrice: {
    color: '#1A3C7B',
    fontSize: '1.4rem',
    fontWeight: 'bold'
  },
  originalPrice: {
    color: '#9ca3af',
    fontSize: '1rem',
    textDecoration: 'line-through',
    fontWeight: '500'
  },
  addToCartButton: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #1A3C7B, #2a5298)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 12px rgba(26, 60, 123, 0.3)'
  },
  disabledButton: {
    background: '#e5e7eb',
    color: '#9ca3af',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '3rem'
  },
  pageButton: {
    padding: '0.75rem 1.25rem',
    border: '2px solid #1A3C7B',
    backgroundColor: 'white',
    color: '#1A3C7B',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  activePageButton: {
    background: 'linear-gradient(135deg, #1A3C7B, #2a5298)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(26, 60, 123, 0.3)'
  }
}

export default function SearchResults() {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')
  const [favorites, setFavorites] = useState(new Set())
  const location = useLocation()

  // Lấy truy vấn tìm kiếm từ URL
  const query = new URLSearchParams(location.search).get('search') || ''

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0)
    const hasHalfStar = (rating || 0) % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <span style={styles.stars}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </span>
    )
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await getProducts(1, 20) // Giả sử API hỗ trợ phân trang
        const filtered = products
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
          .map((p) => ({
            id: p._id,
            name: p.name,
            price: p.exportPrice || 0,
            originalPrice: p.originalPrice || p.exportPrice * 1.1, // Giả lập nếu không có originalPrice
            rating: p.rating || 4.5, // Giá trị mặc định nếu không có
            reviews: p.reviews || Math.floor(Math.random() * 1000) + 100, // Giả lập
            image: p.image?.[0] || '/fallback.jpg',
            category: p.category || 'Không xác định', // Giả lập
            brand: p.brand || 'Không xác định', // Giả lập
            inStock: p.inStock !== undefined ? p.inStock : true, // Giả lập
            discount: p.discount || Math.floor(Math.random() * 10) + 5 // Giả lập
          }))

        if (filtered.length === 0) {
          setProducts([])
          setErrorMessage('Không tìm thấy sản phẩm phù hợp')
        } else {
          setProducts(filtered)
          setErrorMessage('')
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error)
        setProducts([])
        setErrorMessage('Có lỗi xảy ra khi tìm kiếm sản phẩm')
      }
    }

    const debounce = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query, currentPage])

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <section style={styles.resultsHeader}>
          <h2 style={styles.resultsTitle}>
            Kết quả tìm kiếm cho: "{query || 'Tất cả'}"
          </h2>
          <p style={styles.resultsCount}>
            Tìm thấy {products.length} sản phẩm phù hợp
          </p>
        </section>

        {errorMessage ? (
          <p style={styles.resultsCount}>{errorMessage}</p>
        ) : (
          <section style={styles.productsGrid}>
            {products.map((product) => (
              <div
                key={product.id}
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow =
                    '0 20px 40px rgba(26, 60, 123, 0.15)'
                  const img = e.currentTarget.querySelector('img')
                  if (img) img.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow =
                    '0 6px 25px rgba(0,0,0,0.08)'
                  const img = e.currentTarget.querySelector('img')
                  if (img) img.style.transform = 'scale(1)'
                }}
                onClick={() =>
                  (window.location.href = `/productdetail/${product.id}`)
                }
              >
                <div style={styles.productImageWrapper}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.productImage}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/fallback.jpg'
                    }}
                  />
                  {!product.inStock && (
                    <div style={styles.outOfStockOverlay}>Tạm hết hàng</div>
                  )}
                </div>

                <div style={styles.productContent}>
                  <h3 style={styles.productName}>{product.name}</h3>

                  <div style={styles.priceSection}>
                    <span style={styles.currentPrice}>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span style={styles.originalPrice}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    style={{
                      ...styles.addToCartButton,
                      ...(product.inStock ? {} : styles.disabledButton)
                    }}
                    disabled={!product.inStock}
                    onMouseEnter={(e) => {
                      if (product.inStock) {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow =
                          '0 6px 20px rgba(26, 60, 123, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.inStock) {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow =
                          '0 4px 12px rgba(26, 60, 123, 0.3)'
                      }
                    }}
                  >
                    🛒 {product.inStock ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        <div style={styles.pagination}>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              style={{
                ...styles.pageButton,
                ...(currentPage === page ? styles.activePageButton : {})
              }}
              onClick={() => setCurrentPage(page)}
              onMouseEnter={(e) => {
                if (currentPage !== page) {
                  e.target.style.backgroundColor = '#f3f4f6'
                  e.target.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page) {
                  e.target.style.backgroundColor = 'white'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

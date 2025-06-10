import ProductCard from '~/components/ProductCards/ProductCards.jsx'
import React from 'react'

const styles = {
  section: {
    marginBottom: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    alignItems: 'start' // Thêm để căn chỉnh items
  },
  banner: {
    position: 'relative',
    height: '420px',
    borderRadius: '10px',
    overflow: 'hidden',
    gridColumn: '1', // Đảm bảo banner luôn ở vị trí đầu
    gridRow: '1' // Đặt banner ở hàng đầu tiên
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px'
  },
  bannerText: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)' // Thêm shadow để text dễ đọc hơn
  },
  bannerTitle: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  bannerDesc: {
    margin: '0',
    fontSize: '14px',
    opacity: '0.9'
  },
  productItem: {
    width: '100%'
  },
  seeMore: {
    display: 'block',
    marginTop: '20px',
    textAlign: 'center'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  noProducts: {
    gridColumn: '1 / -1', // Span toàn bộ grid
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    fontSize: '16px'
  }
}

const ProductSection = ({ bannerImg, bannerTitle, bannerDesc, products }) => {
  // Debug: Log dữ liệu để kiểm tra
  console.log('ProductSection props:', {
    bannerImg,
    bannerTitle,
    bannerDesc,
    products
  })

  // Kiểm tra và xử lý dữ liệu products - FIX: products có cấu trúc { products: [...], total: number }
  let productArray = []

  if (products) {
    if (Array.isArray(products)) {
      // Trường hợp products là array trực tiếp
      productArray = products
    } else if (products.products && Array.isArray(products.products)) {
      // Trường hợp products có cấu trúc { products: [...], total: number }
      productArray = products.products
    }
  }

  const validProducts = productArray.filter(
    (product) => product && (product._id || product.id)
  )

  console.log('Product array extracted:', productArray)
  console.log('Valid products:', validProducts)

  return (
    <div style={styles.section}>
      <div style={styles.grid}>
        {/* Banner */}
        <div style={styles.banner}>
          <img
            src={
              bannerImg ||
              'https://file.hstatic.net/1000360022/file/5-_banner_web_-__nh_nh_m_s_n_ph_m_trang_ch__qu_n_short__848x544_.jpg'
            }
            alt={bannerTitle || 'Banner'}
            style={styles.bannerImg}
            onError={(e) => {
              console.error('Banner image failed to load:', e.target.src)
              e.target.src =
                'https://via.placeholder.com/500x440?text=Image+Error'
            }}
          />
          <div style={styles.bannerText}>
            <h2 style={styles.bannerTitle}>
              {bannerTitle || 'Danh mục sản phẩm'}
            </h2>
            {bannerDesc && <p style={styles.bannerDesc}>{bannerDesc}</p>}
          </div>
        </div>

        {/* Products */}
        {validProducts.length > 0 ? (
          validProducts.map((product, index) => {
            // Xử lý ảnh sản phẩm
            let productImage =
              'https://via.placeholder.com/220x220?text=No+Image'

            if (product.image) {
              if (Array.isArray(product.image) && product.image.length > 0) {
                productImage = product.image[0]
              } else if (typeof product.image === 'string') {
                productImage = product.image
              }
            }

            const productWithSingleImage = {
              ...product,
              image: productImage
            }

            return (
              <div
                key={product._id || product.id || `product-${index}`}
                style={styles.productItem}
              >
                <ProductCard product={productWithSingleImage} />
              </div>
            )
          })
        ) : (
          <div style={styles.noProducts}>
            <p>Không có sản phẩm để hiển thị</p>
            <small>Kiểm tra console để xem dữ liệu products</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductSection

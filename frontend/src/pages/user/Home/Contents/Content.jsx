import React from 'react'
import '~/assets/HomeCSS/Content.css'

const Content = () => {
  // Sample data
  const categories = [
    {
      title: 'Váy giá tốt chọn',
      subtitle: 'TechUrban',
      discount: '50%',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Sản phẩm DENIM',
      discount: '30%',
      gradient: 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)'
    },
    {
      title: 'Đồ mặc HÀNG NGÀY',
      discount: '40%',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)'
    },
    {
      title: 'Đồ ĐI LÀM',
      discount: '25%',
      gradient: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)'
    }
  ]

  const vouchers = [
    { amount: '150k', condition: 'Đơn từ 0Đ' },
    { amount: '30.000Đ', condition: 'Đơn từ 0Đ' },
    { amount: '99.000Đ', condition: 'Đơn từ 0Đ' },
    { amount: '100.000Đ', condition: 'Đơn từ 0Đ' }
  ]

  const stitchProducts = [
    {
      name: 'Áo Thun Stitch Chính Hãng Disney Unisex',
      price: '249.000đ',
      originalPrice: '350.000đ',
      discount: '29%',
      rating: 4.5,
      sold: '2.3k'
    },
    {
      name: 'Áo Thun Stitch Chính Hãng Disney Unisex',
      price: '249.000đ',
      originalPrice: '350.000đ',
      discount: '29%',
      rating: 4.5,
      sold: '2.3k'
    },
    {
      name: 'Áo Stitch Gaming',
      price: '156.000đ',
      originalPrice: '200.000đ',
      discount: '22%',
      rating: 4.7,
      sold: '1.8k'
    },
    {
      name: 'Áo Thun Stitch Gaming Stitch Đen Hàng Có Sẵn',
      price: '69.000đ',
      originalPrice: '120.000đ',
      discount: '43%',
      rating: 4.3,
      sold: '5.2k'
    },
    {
      name: 'Áo Thun Stitch Gaming Stitch Xanh Hàng Có Sẵn',
      price: '69.000đ',
      originalPrice: '120.000đ',
      discount: '43%',
      rating: 4.6,
      sold: '3.1k'
    },
    {
      name: 'Áo Thun Unisex Tay Chính Hãng Disney Cotton 100%',
      price: '249.000đ',
      originalPrice: '350.000đ',
      discount: '29%',
      rating: 4.8,
      sold: '890'
    }
  ]

  const flashSaleProducts = [
    {
      name: 'Áo Cotton Trơn Nam Basic Chống Nhăn',
      price: '55.000đ',
      originalPrice: '150.000đ',
      discount: '63%',
      sold: '12.5k',
      rating: 4.2
    },
    {
      name: 'Áo Thun Nam Tay Oversize Basics Streetwear',
      price: '79.000đ',
      originalPrice: '159.000đ',
      discount: '50%',
      sold: '8.9k',
      rating: 4.5
    },
    {
      name: 'Áo Thun WELCOME TO TEAM UP',
      price: '45.000đ',
      originalPrice: '89.000đ',
      discount: '49%',
      sold: '15.2k',
      rating: 4.1
    },
    {
      name: 'Quần Short Nam Thun Jogger',
      price: '89.000đ',
      originalPrice: '179.000đ',
      discount: '50%',
      sold: '6.7k',
      rating: 4.4
    },
    {
      name: 'Quần Jean Nam Ống Suông Straight Fit',
      price: '199.000đ',
      originalPrice: '399.000đ',
      discount: '50%',
      sold: '3.2k',
      rating: 4.6
    }
  ]

  const ProductCard = ({ product, isFlashSale = false }) => (
    <div className='product-card'>
      <div className='product-image'>
        <div
          className={`image-placeholder ${isFlashSale ? 'flash-sale-bg' : 'normal-bg'}`}
        >
          <span>📷 Product Image</span>
        </div>
        <div className='discount-badge'>-{product.discount}</div>
      </div>
      <div className='product-info'>
        <h3 className='product-name'>{product.name}</h3>
        <div className='price-row'>
          <span className='current-price'>{product.price}</span>
          <span className='original-price'>{product.originalPrice}</span>
        </div>
        <div className='product-meta'>
          <div className='rating'>
            <span className='star'>★</span>
            <span>{product.rating}</span>
          </div>
          <span className='sold'>Đã bán {product.sold}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className='content-container'>
      {/* Category Section */}
      <div className='category-grid'>
        {categories.map((category, index) => (
          <div key={index} className='category-card'>
            <div
              className='category-image'
              style={{ background: category.gradient }}
            >
              <div className='category-overlay'></div>
              <div className='category-content'>
                <div className='category-icon'>👔</div>
                <div>{category.title}</div>
                {category.subtitle && (
                  <div className='category-subtitle'>{category.subtitle}</div>
                )}
              </div>
            </div>
            <div className='category-info'>
              <span className='discount-chip'>Giảm {category.discount}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Stitch Collection Banner */}
      <div className='stitch-banner'>
        <div className='banner-icon'>🎮</div>
        <div className='banner-content'>
          <h2 className='banner-title'>CHÍNH THỨC MỞ BÁN</h2>
          <p className='banner-subtitle'>STITCH COLLECTION</p>
          <div className='banner-description'>
            🎯 Sản phẩm chính hãng Disney
          </div>
        </div>
      </div>

      {/* Stitch Products */}
      <div className='product-grid'>
        {stitchProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <button className='cta-button'>Xem tất cả Stitch Collection</button>
      </div>

      {/* Flash Sale Section */}
      <div className='flash-sale'>
        <div className='flash-sale-header'>
          <div className='flash-sale-title'>
            ⚡ FLASH SALE 24H
            <div className='countdown'>
              <div className='countdown-item'>16</div>
              <div className='countdown-item'>23</div>
              <div className='countdown-item'>59</div>
            </div>
          </div>
        </div>

        <div className='product-grid'>
          {flashSaleProducts.map((product, index) => (
            <ProductCard key={index} product={product} isFlashSale={true} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button className='view-all-button'>Xem tất cả Flash Sale</button>
        </div>
      </div>

      {/* Features Section */}
      <div className='features-grid'>
        {[
          { icon: '🚚', title: 'Giao hàng nhanh', desc: 'Trong 2 giờ' },
          { icon: '💯', title: 'Chính hãng', desc: '100% authentic' },
          { icon: '↩️', title: 'Đổi trả dễ dàng', desc: '7 ngày đổi trả' },
          { icon: '🎁', title: 'Quà tặng', desc: 'Với mỗi đơn hàng' }
        ].map((feature, index) => (
          <div key={index} className='feature-card'>
            <div className='feature-icon'>{feature.icon}</div>
            <div className='feature-title'>{feature.title}</div>
            <div className='feature-desc'>{feature.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Content

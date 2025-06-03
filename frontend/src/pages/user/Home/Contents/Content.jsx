import React from 'react'

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

  const styles = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Category Grid */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .category-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .category-image {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      text-align: center;
      position: relative;
    }

    .category-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.1);
    }

    .category-content {
      position: relative;
      z-index: 10;
    }

    .category-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .category-subtitle {
      font-size: 14px;
      opacity: 0.9;
    }

    .category-info {
      padding: 16px;
      text-align: center;
    }

    .discount-chip {
      display: inline-block;
      background: #f44336;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    /* Voucher Grid */
    .voucher-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .voucher-card {
      background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      color: white;
      cursor: pointer;
      transition: transform 0.2s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .voucher-card:hover {
      transform: scale(1.05);
    }

    .voucher-title {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .voucher-amount {
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 4px;
    }

    .voucher-condition {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .voucher-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .voucher-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Stitch Banner */
    .stitch-banner {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      border-radius: 24px;
      padding: 48px 32px;
      text-align: center;
      color: white;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }

    .banner-icon {
      position: absolute;
      right: 32px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 48px;
      opacity: 0.3;
    }

    .banner-content {
      position: relative;
      z-index: 10;
    }

    .banner-title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .banner-subtitle {
      font-size: 20px;
      opacity: 0.9;
      margin-bottom: 16px;
    }

    .banner-description {
      font-size: 14px;
      opacity: 0.75;
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .product-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .product-image {
      position: relative;
    }

    .image-placeholder {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }

    .normal-bg {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    }

    .flash-sale-bg {
      background: linear-gradient(135deg, #f5f5f5 0%, #e8f4f8 100%);
    }

    .image-placeholder::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%);
    }

    .discount-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: #f44336;
      color: white;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: bold;
    }

    .product-info {
      padding: 12px;
    }

    .product-name {
      font-size: 14px;
      color: #374151;
      line-height: 1.4;
      height: 40px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 8px;
      transition: color 0.2s ease;
    }

    .product-card:hover .product-name {
      color: #2196F3;
    }

    .price-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .current-price {
      color: #f44336;
      font-weight: bold;
      font-size: 16px;
    }

    .original-price {
      color: #9ca3af;
      text-decoration: line-through;
      font-size: 14px;
    }

    .product-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #6b7280;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .star {
      color: #fbbf24;
    }

    /* Flash Sale Section */
    .flash-sale {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border-radius: 24px;
      padding: 32px;
      color: white;
      margin-bottom: 32px;
    }

    .flash-sale-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .flash-sale-title {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 24px;
      font-weight: bold;
    }

    .countdown {
      display: flex;
      gap: 8px;
    }

    .countdown-item {
      background: #f44336;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      min-width: 40px;
      text-align: center;
    }

    .view-all-button {
      background: transparent;
      border: 2px solid white;
      color: white;
      padding: 12px 32px;
      border-radius: 24px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: block;
      margin: 0 auto;
    }

    .view-all-button:hover {
      background: white;
      color: #1e3c72;
    }

    .cta-button {
      background: #2196F3;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 24px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s ease;
      display: block;
      margin: 0 auto;
    }

    .cta-button:hover {
      background: #1976D2;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 32px;
    }

    .feature-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease;
    }

    .feature-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .feature-title {
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }

    .feature-desc {
      font-size: 14px;
      color: #6b7280;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .content-container {
        padding: 16px 12px;
      }

      .category-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .voucher-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .banner-title {
        font-size: 24px;
      }

      .banner-subtitle {
        font-size: 16px;
      }

      .stitch-banner {
        padding: 32px 20px;
      }

      .banner-icon {
        font-size: 32px;
        right: 20px;
      }

      .flash-sale {
        padding: 20px;
      }

      .flash-sale-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .flash-sale-title {
        font-size: 20px;
      }

      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .category-grid {
        grid-template-columns: 1fr;
      }

      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .product-name {
        font-size: 12px;
        height: 32px;
      }

      .current-price {
        font-size: 14px;
      }

      .original-price {
        font-size: 12px;
      }

      .voucher-grid {
        grid-template-columns: 1fr;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `

  return (
    <>
      <style>{styles}</style>
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

        {/* Voucher Section */}
        <div className='voucher-grid'>
          {vouchers.map((voucher, index) => (
            <div key={index} className='voucher-card'>
              <div className='voucher-title'>VOUCHER</div>
              <div className='voucher-amount'>{voucher.amount}</div>
              <div className='voucher-condition'>{voucher.condition}</div>
              <button className='voucher-button'>Lưu ngay</button>
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
    </>
  )
}

export default Content

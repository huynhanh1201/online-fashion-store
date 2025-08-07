import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCards'

const ProductHorizontalScroll = ({
  products = [],
  defaultCardsPerRow = 5,
  gap = 5
}) => {
  const [showAll, setShowAll] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [initialDisplayCount, setInitialDisplayCount] = useState(5) // Hiển thị 10 sản phẩm ban đầu (2 hàng)

  // Theo dõi chiều rộng màn hình
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lọc sản phẩm mới trong 7 ngày gần nhất
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  const newProducts = products.filter((product) => {
    const createdAt = new Date(product.createdAt)
    return createdAt >= sevenDaysAgo && createdAt <= now
  })

  // Xác định số card trên mỗi hàng dựa vào chiều rộng màn hình
  const getCardsPerRow = () => {
    if (windowWidth > 1500) {
      return defaultCardsPerRow // 5 cards on desktop
    }
    if (windowWidth > 1400) {
      return 4 // 5 cards on desktop
    }
    if (windowWidth > 900) {
      return 3
    }
    if (windowWidth > 600) {
      return 2 // 2 cards on tablet
    }
    return 2 // 2 cards on mobile
  }

  const cardsPerRow = getCardsPerRow()

  // Cập nhật số lượng hiển thị ban đầu dựa trên cardsPerRow
  useEffect(() => {
    setInitialDisplayCount(cardsPerRow * 1) // Hiển thị 2 hàng ban đầu
  }, [cardsPerRow])

  // Xác định số sản phẩm hiển thị
  const displayCount = showAll ? newProducts.length : initialDisplayCount
  const visibleProducts = newProducts.slice(0, displayCount)

  const handleShowMore = () => {
    setShowAll(true)
  }

  const handleShowLess = () => {
    setShowAll(false)
  }

  // Nếu không có sản phẩm mới, ẩn component hoàn toàn
  if (newProducts.length === 0) {
    return null
  }

  return (
    <div className='products-grid-container'>
      <div className='products-grid'>
        {visibleProducts.map((product) => (
          <div key={product._id || product.id} className='product-item'>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <style>{`
        .products-grid-container {
          width: 95vw;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: ${gap}px;
          margin-bottom: 20px;
        }
        
        .product-item {
          width: 100%;
        }
        
        .show-more-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .show-more-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .show-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .show-more-btn:active {
          transform: translateY(0);
        }
        
        @media (max-width: 1400px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        @media (max-width: 1300px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 900px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 680px) {
          .products-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 10px;
          }
          
          .show-more-btn {
            padding: 10px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default ProductHorizontalScroll

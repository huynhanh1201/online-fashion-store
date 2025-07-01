import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCards'

const ProductHorizontalScroll = ({ products = [], defaultCardsPerRow = 5, gap = 20 }) => {
  const [startIdx, setStartIdx] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Theo dõi chiều rộng màn hình
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lọc sản phẩm mới trong 7 ngày gần nhất
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const newProducts = products.filter(product => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= sevenDaysAgo && createdAt <= now;
  });

  // Xác định số card trên mỗi hàng dựa vào chiều rộng màn hình
  const getCardsPerRow = () => {
    if (windowWidth > 900) {
      return defaultCardsPerRow // 5 cards on desktop
    }
    if (windowWidth > 600) {
      return 3 // 3 cards on tablet
    }
    return 2 // 2 cards on mobile (like the reference image)
  }

  const cardsPerRow = getCardsPerRow()

  // Xử lý khi resize làm index bị lỗi
  useEffect(() => {
    if (startIdx + cardsPerRow > newProducts.length) {
      setStartIdx(Math.max(0, newProducts.length - cardsPerRow))
    }
  }, [windowWidth, newProducts.length, cardsPerRow, startIdx])

  const handleNext = () => {
    if (startIdx + cardsPerRow < newProducts.length) {
      setStartIdx(startIdx + 1)
    }
  }
  const handlePrev = () => {
    if (startIdx > 0) {
      setStartIdx(startIdx - 1)
    }
  }

  const visibleProducts = newProducts.slice(startIdx, startIdx + cardsPerRow)

  return (
    <div className='slide-container'>
      {products.length > cardsPerRow && (
        <button
          className={`scroll-btn left${startIdx === 0 ? ' disabled' : ''}`}
          onClick={handlePrev}
          disabled={startIdx === 0}
          aria-label='Cuộn trái'
        >
          {'<'}
        </button>
      )}
      <div className='slide-list'>
        <div
          className='slide-track'
          style={{
            display: 'flex',
            gap: gap,
            transform: `translateX(0)`,
            transition: 'transform 0.4s cubic-bezier(.4,1.3,.6,1)',
            width: '100%'
          }}
        >
          {visibleProducts.map((product) => (
            <div
              key={product._id || product.id}
              className='slide-item'
              style={{ flex: `0 0 calc((100% - ${(cardsPerRow - 1) * gap}px) / ${cardsPerRow})`, maxWidth: `calc((100% - ${(cardsPerRow - 1) * gap}px) / ${cardsPerRow})` }}
            >
              <ProductCard product={product} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </div>
      {products.length > cardsPerRow && (
        <button
          className={`scroll-btn right${startIdx + cardsPerRow >= products.length ? ' disabled' : ''}`}
          onClick={handleNext}
          disabled={startIdx + cardsPerRow >= products.length}
          aria-label='Cuộn phải'
        >
          {'>'}
        </button>
      )}
      <style>{`
        .slide-container {
          width: 100%;
          padding: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }
        .slide-list {
          flex: 1;
          overflow: hidden;
          padding: 0 36px;
        }
        .slide-track {
          display: flex;
          width: 100%;
          transition: transform 0.4s cubic-bezier(.4,1.3,.6,1);
        }
        .slide-item {
          box-sizing: border-box;
          transition: flex 0.3s ease, max-width 0.3s ease;
        }
        .scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          background: rgba(255,255,255,0.7);
          color: var(--primary-color);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 28px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(59,130,246,0.13);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          opacity: 1;
        }
        .scroll-btn.left { left: 0; }
        .scroll-btn.right { right: 0; }
        .scroll-btn:disabled,
        .scroll-btn.disabled {
          opacity: 0;
          pointer-events: none;
        }
        .scroll-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.95);
          color: var(--accent-color);
        }
        @media (max-width: 600px) {
          .scroll-btn {
            width: 36px;
            height: 36px;
            font-size: 22px;
          }
           .slide-list {
            padding: 0 12px;
          }
        }
      `}</style>
    </div>
  )
}

export default ProductHorizontalScroll 
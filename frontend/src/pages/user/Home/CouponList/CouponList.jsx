import React, { useEffect, useRef, useState } from 'react'
import { getDiscounts } from '~/services/discountService.js'

const CouponList = ({ onCouponSelect }) => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const scrollRef = useRef(null)
  const containerRef = useRef(null)

  // Số lượng coupon hiển thị tối đa trên màn hình
  const maxVisibleCoupons = 6 // Có thể điều chỉnh theo thiết kế

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { discounts } = await getDiscounts()
        const activeCoupons = discounts.filter(coupon => coupon.isActive === true)
        setCoupons(activeCoupons)
        
        // Kiểm tra xem có cần hiển thị arrow không
        setTimeout(() => {
          checkScrollArrows()
        }, 100)
      } catch (error) {
        console.error('Failed to fetch coupons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [])

  // Kiểm tra và cập nhật trạng thái hiển thị arrow
  const checkScrollArrows = () => {
    if (!scrollRef.current) return

    const scrollElement = scrollRef.current
    
    // Kiểm tra nút left arrow - chỉ hiển thị khi có thể scroll về trái
    setShowLeftArrow(scrollElement.scrollLeft > 10) // Thêm buffer 10px
    
    // Kiểm tra nút right arrow - chỉ hiển thị khi có thể scroll về phải
    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth
    setShowRightArrow(scrollElement.scrollLeft < maxScrollLeft - 10) // Thêm buffer 10px
  }

  // Thêm event listener để theo dõi scroll với debounce
  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      let timeoutId
      
      const debouncedCheck = () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(checkScrollArrows, 50)
      }
      
      scrollElement.addEventListener('scroll', debouncedCheck)
      window.addEventListener('resize', debouncedCheck)
      
      return () => {
        scrollElement.removeEventListener('scroll', debouncedCheck)
        window.removeEventListener('resize', debouncedCheck)
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const formatCurrencyShort = (value) => {
    if (value >= 1_000_000) return `${Math.floor(value / 1_000_000)}Tr`
    if (value >= 1_000) return `${Math.floor(value / 1_000)}K`
    return `${value.toLocaleString()}đ`
  }

  const handleCopy = (code) => {
    if (!code || code === 'N/A') return
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    if (onCouponSelect) {
      onCouponSelect(code)
    }
    setTimeout(() => setCopiedCode(''), 1500)
  }

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
    setTimeout(checkScrollArrows, 300) // Kiểm tra sau khi scroll hoàn thành
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
    setTimeout(checkScrollArrows, 300) // Kiểm tra sau khi scroll hoàn thành
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 20px'
        }}
      >
        <div className='spinner'></div>
      </div>
    )
  }

  if (!coupons.length) {
    return null
  }

  return (
    <div className='coupon-container'>
      <div className='coupon-wrapper' ref={containerRef}>
        <div className='coupon-scroll-wrapper'>
          {showLeftArrow && (
            <button className='scroll-btn left' onClick={scrollLeft}>
              ◀
            </button>
          )}

          <div className='coupon-grid-scroll' ref={scrollRef}>
            {coupons.map((coupon) => {
              const isPercent = coupon.type === 'percent'
              const isFreeShip =
                coupon.type === 'freeship' || coupon.amount === 0

              let mainText = ''
              let conditionText = ''

              if (isFreeShip) {
                mainText = 'FREESHIP'
                conditionText = 'mọi đơn hàng'
              } else if (isPercent) {
                mainText = `${coupon.amount}%`
                conditionText = `tối đa ${formatCurrencyShort(coupon.maxDiscountValue || coupon.amount * 10000)}`
              } else {
                mainText = formatCurrencyShort(coupon.amount)
                conditionText = `đơn từ ${formatCurrencyShort(coupon.minOrderValue)}`
              }

              return (
                <div key={coupon._id} className='coupon-card'>
                  <div className='coupon-header'>
                    <div className='voucher-label'>VOUCHER</div>
                    <div className='condition-text'>{conditionText}</div>
                  </div>

                  <div className='main-value-section'>
                    <div className='main-text'>{mainText}</div>
                  </div>

                  <div className='code-section'>
                    <div className='code-info'>
                      <div className='code-label'>
                        Mã: <span className='code-text'>{coupon.code}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(coupon.code)
                      }}
                      className={`copy-button ${copiedCode === coupon.code ? 'copied' : ''}`}
                    >
                      {copiedCode === coupon.code ? '✓ Đã copy' : 'Sao chép'}
                    </button>
                  </div>

                  {copiedCode === coupon.code && (
                    <div className='success-notification'>Đã sao chép mã!</div>
                  )}
                </div>
              )
            })}
          </div>

          {showRightArrow && (
            <button className='scroll-btn right' onClick={scrollRight}>
              ▶
            </button>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .coupon-container {
          padding: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .coupon-wrapper {
          max-width: 1800px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .coupon-scroll-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .coupon-grid-scroll {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 16px;
          padding: 10px 0;
          flex: 1;
        }

        .coupon-card {
          flex: 0 0 auto;
          width: 270px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid var(--primary-color);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .coupon-card:hover {
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
          transform: translateY(-3px);
          border-color: var(--accent-color);
        }

        .coupon-header {
          padding: 16px 20px 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 8px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        }

        .voucher-label {
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .condition-text {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          text-align: right;
          flex-shrink: 0;
        }

        .main-value-section {
          padding: 16px 20px 8px 20px;
          background: #ffffff;
        }

        .main-text {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary-color);
          text-align: center;
          text-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
        }

        .code-section {
          padding: 16px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .code-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .code-text {
          color: var(--primary-color);
          font-weight: 700;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .copy-button {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
          color: #ffffff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 80px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .copy-button:hover {
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .copy-button.copied {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .copy-button.copied:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .success-notification {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
          animation: slideUp 0.4s ease-out;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .scroll-btn {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-out;
        }

        .scroll-btn:hover {
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Custom scrollbar for coupon grid */
        .coupon-grid-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .coupon-grid-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .coupon-grid-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
          border-radius: 3px;
        }

        .coupon-grid-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
        }

        @media (max-width: 768px) {
          .coupon-card {
            width: 240px;
          }

          .main-text {
            font-size: 24px;
          }

          .coupon-header {
            padding: 14px 16px 10px 16px;
          }

          .code-section {
            padding: 14px 16px;
          }
        }

        @media (max-width: 480px) {
          .coupon-card {
            width: 220px;
          }

          .main-text {
            font-size: 22px;
          }

          .scroll-btn {
            padding: 10px 12px;
            font-size: 14px;
            min-width: 40px;
          }

          .copy-button {
            padding: 8px 12px;
            font-size: 10px;
            min-width: 70px;
          }
        }
      `}</style>
    </div>
  )
}

export default CouponList

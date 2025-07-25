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
  const [showAllDrawer, setShowAllDrawer] = useState(false)
  const [maxVisibleCoupons, setMaxVisibleCoupons] = useState(6)

  // Số lượng coupon hiển thị tối đa trên màn hình
  // const maxVisibleCoupons = 6 // Có thể điều chỉnh theo thiết kế

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const { discounts } = await getDiscounts()
        const activeCoupons = discounts.filter(
          (coupon) => coupon.isActive === true && coupon.destroy === false
        )
        setCoupons(activeCoupons)
      } catch (error) {
        console.error('Failed to fetch coupons:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [])

  useEffect(() => {
    // Responsive: cập nhật số lượng coupon tối đa theo kích thước màn hình
    const handleResize = () => {
      const w = window.innerWidth;
      if (w > 1800) {
        setMaxVisibleCoupons(5);
      } else if (w > 1600) {
        setMaxVisibleCoupons(4);
      } else if (w > 1079) {
        setMaxVisibleCoupons(3);
      } else if (w >= 1015 && w <= 1078) {
        setMaxVisibleCoupons(4);
      } else if (w > 900) {
        setMaxVisibleCoupons(4);
      } else {
        setMaxVisibleCoupons(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Kiểm tra và cập nhật trạng thái hiển thị arrow
  const checkScrollArrows = () => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const isScrollable = scrollElement.scrollWidth > scrollElement.clientWidth
    if (!isScrollable) {
      setShowLeftArrow(false)
      setShowRightArrow(false)
      return
    }

    setShowLeftArrow(scrollElement.scrollLeft > 10)
    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth
    setShowRightArrow(scrollElement.scrollLeft < maxScrollLeft - 10)
  }

  // Effect để kiểm tra arrow khi coupon được tải hoặc khi resize
  useEffect(() => {
    // Chờ DOM update sau khi loading xong
    if (loading) return

    const timer = setTimeout(() => {
      checkScrollArrows()
    }, 150)

    const debouncedCheck = () => checkScrollArrows()

    window.addEventListener('resize', debouncedCheck)
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', debouncedCheck)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', debouncedCheck)
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', debouncedCheck)
      }
    }
  }, [coupons, loading]) // Chạy lại khi coupon được tải

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
    scrollRef.current?.scrollBy({ left: -360, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 360, behavior: 'smooth' })
  }

  // Hiển thị coupon giới hạn
  const visibleCoupons = coupons.slice(0, maxVisibleCoupons)
  const shouldShowSeeAll = coupons.length > maxVisibleCoupons && maxVisibleCoupons < 9999

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
      <div className='coupon-wrapper'>
        <div className='coupon-grid-scroll' ref={scrollRef}>
          {visibleCoupons.map((coupon) => {
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
              <div key={coupon._id} className='coupon-card' style={{position:'relative'}}>
                <div className='coupon-left'>
                  <div className='voucher-label'>Mã giảm giá</div>
                  <div className='main-text'>{mainText}</div>
                  <div className='code-label'>Nhập mã: <span className='code-text'>{coupon.code}</span></div>
                </div>
                <div className='coupon-right'>
                  <div className='condition-text'>{conditionText}</div>
                  <div className='code-section' style={{position:'relative',zIndex:1}}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(coupon.code)
                      }}
                      className={`copy-button ${copiedCode === coupon.code ? 'copied' :''}`}
                    >
                      {copiedCode === coupon.code ? '✓ Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Nút Xem tất cả nằm ngay dưới list coupon */}
        {shouldShowSeeAll && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <button
              className='show-all-btn-custom'
              onClick={() => setShowAllDrawer(true)}
            >
              Xem tất cả
            </button>
          </div>
        )}
      </div>
      {/* Drawer hiển thị toàn bộ coupon */}
      {showAllDrawer && (
        <div className='coupon-drawer-overlay' onClick={() => setShowAllDrawer(false)}>
          <div className='coupon-drawer' onClick={e => e.stopPropagation()}>
            <button className='close-drawer-btn' onClick={() => setShowAllDrawer(false)}>&times;</button>
            <h2 style={{marginBottom: 16, textAlign: 'center'}}>Tất cả mã giảm giá</h2>
            <div className='coupon-modal-list'>
              {coupons.map((coupon) => {
                const isPercent = coupon.type === 'percent'
                const isFreeShip = coupon.type === 'freeship' || coupon.amount === 0
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
                  <div key={coupon._id} className='coupon-card' style={{marginTop: '50px'}}>
                    <div className='coupon-left'>
                      <div className='voucher-label'>Mã giảm giá</div>
                      <div className='main-text'>{mainText}</div>
                      <div className='code-label'>Nhập mã: <span className='code-text'>{coupon.code}</span></div>
                    </div>
                    <div className='coupon-right'>
                      <div className='condition-text'>{conditionText}</div>
                      <div className='code-section' style={{position:'relative',zIndex:1}}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(coupon.code)
                          }}
                          className={`copy-button ${copiedCode === coupon.code ? 'copied' :''}`}
                        >
                          {copiedCode === coupon.code ? '✓ Đã sao chép' : 'Sao chép'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {/* Styles */}
      <style>{`
        .coupon-container {
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .coupon-wrapper {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .coupon-grid-scroll {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          flex: 1;
          justify-content: center;
          width: '100%'
        }

        /* Không cần ẩn scrollbar nữa */

        .coupon-card {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          width: 320px;
          min-width: 340px;
          max-width: 340px;
          height: 90px;
          background: #fff;
          border: 1.5px solid var(--primary-color);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.06);
          transition: box-shadow 0.2s, border 0.2s;
          margin: 0 8px;
        }
        .coupon-card:hover {
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.13);
          border-color: var(--accent-color, #0a2259);
        }
        .coupon-left {
          flex: 1 1 0;
          padding: 14px 18px 10px 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .voucher-label {
          color: var(--primary-color);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .main-text {
          font-size: 26px;
          font-weight: 800;
          color: var(--primary-color);
          line-height: 1.1;
          margin-bottom: 2px;
        }
        .code-label {
          font-size: 13px;
          color: var(--primary-color);
          font-weight: 500;
        }
        .code-text {
          color: var(--primary-color);
          font-weight: 700;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          letter-spacing: 0.5px;
        }
        .coupon-right {
          flex: 0 0 120px;
          min-width: 120px;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          padding: 12px 14px 12px 0;
        }
        .code-section {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-end;
          align-items: center;
          width: 100%;
        }
        .condition-text {
          font-size: 12px;
          color: var(--primary-color);
          font-weight: 600;
          margin-bottom: 18px;
        }
        .copy-button {
          background: var(--primary-color);
          color: #fff;
          border: none;
          padding: 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          min-width: 90px;
          text-transform: none;
          letter-spacing: 0.2px;
        }
        .copy-button:hover {
          background: var(--accent-color);
          color: #fff;
        }
        .copy-button.copied {
          background: #10b981;
        }
        .copy-button.copied:hover {
          background: #059669;
        }
        .success-notification {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
          animation: slideUp 0.4s ease-out;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .scroll-btn {
          background: rgba(255,255,255,0.7);
          color: var(--primary-color);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 28px;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(59,130,246,0.13);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          opacity: 1;
          animation: fadeIn 0.3s ease-out;
        }
        .scroll-btn:disabled,
        .scroll-btn.disabled {
          opacity: 0;
          cursor: default;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .scroll-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.95);
          color: var(--accent-color);
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
        
        @media (max-width: 600px) {
          .coupon-card {
            width: 340px;
            min-width: 340px;
            max-width: 340px;
            height: 80px;
          }
          .main-text {
            font-size: 18px;
          }
          .coupon-right {
            flex-basis: 120px;
            min-width: 120px;
            padding: 10px 6px 10px 0;
          }
          .copy-button {
            padding: 6px 10px;
            font-size: 12px;
            min-width: 70px;
          }
          .condition-text {
            font-size: 11px;
            margin-bottom: 10px;
          }
        }
        .show-all-btn {
          background: var(--primary-color);
          color: #fff;
          border: none;
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 0;
          margin-top: 0;
          transition: background 0.2s;
        }
        .show-all-btn:hover {
          background: var(--accent-color);
        }
        .coupon-drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          align-items: stretch;
        }
        .coupon-drawer {
          background: #fff;
          border-radius: 12px 0 0 12px;
          max-width: 480px;
          width: 90vw;
          height: 100vh;
          overflow-y: auto;
          box-shadow: -4px 0 32px rgba(0,0,0,0.18);
          padding: 32px 18px 24px 18px;
          position: relative;
          animation: slideInDrawer 0.25s cubic-bezier(.4,0,.2,1);
          justify-content: center;
          align-items: center;
        }
        @keyframes slideInDrawer {
          from {
            transform: translateX(100%);
            opacity: 0.5;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .close-drawer-btn {
          position: absolute;
          top: 12px;
          right: 18px;
          background: none;
          border: none;
          font-size: 2rem;
          color: #888;
          cursor: pointer;
          z-index: 10;
        }
        .close-drawer-btn:hover {
          color: var(--primary-color);
        }
        .coupon-modal-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 600px) {
          .coupon-drawer {
            max-width: 98vw;
            padding: 18px 2vw 12px 2vw;
          }
        }
        @media (max-width: 900px) {
          .coupon-grid-scroll {
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            padding: 10px 0;
          }
          .coupon-card {
            width: 48vw;
            min-width: unset;
            max-width: 100%;
            margin: 8px 4px;
          }
          .coupon-drawer {
            max-width: 80vw;
            width: 80vw;
            min-width: 0;
            right: 0;
            left: auto;
            border-radius: 12px 0 0 12px;
            padding: 18px 2vw 12px 2vw;
          }
        }
        .show-all-btn-custom {
          border: 1.5px solid var(--primary-color, #0a2259);
          color: var(--primary-color, #0a2259);
          background: transparent;
          padding: 10px 32px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 2px 8px rgba(59,130,246,0.10);
          outline: none;
          margin: 0 auto;
          display: inline-block;
        }
        .show-all-btn-custom:hover {
          background: var(--primary-color, #0a2259);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(59,130,246,0.18);
        }
      `}</style>
    </div>
  )
}

export default CouponList

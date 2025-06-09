import React, { useEffect, useRef, useState } from 'react'
import { getDiscounts } from '~/services/discountService.js'

const CouponList = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { discounts } = await getDiscounts()
        setCoupons(discounts)
      } catch (error) {
        console.error('Failed to fetch coupons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [])

  const formatCurrencyShort = (value) => {
    if (value >= 1_000_000) return `${Math.floor(value / 1_000_000)}Tr`
    if (value >= 1_000) return `${Math.floor(value / 1_000)}K`
    return `${value.toLocaleString()}đ`
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 1500)
  }

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
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

  return (
    <div className='coupon-container'>
      <div className='coupon-wrapper'>
        <div className='coupon-scroll-wrapper'>
          <button className='scroll-btn left' onClick={scrollLeft}>
            ◀
          </button>

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

          <button className='scroll-btn right' onClick={scrollRight}>
            ▶
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .coupon-container {
          padding: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .coupon-wrapper {
          max-width: 1450px;
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
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          position: relative;
          cursor: pointer;
        }

        .coupon-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .coupon-header {
          padding: 12px 16px 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 8px;
        }

        .voucher-label {
          color: #475569;
          font-size: 15px;
          font-weight: 700;
        }

        .condition-text {
          font-size: 12px;
          color: #64748b;
          font-weight: 800;
          text-align: right;
          flex-shrink: 0;
        }

        .main-value-section {
          padding: 0 7px 3px;
        }

        .main-text {
          font-size: 27px;
          font-weight: 700;
          color: #1e40af;
          margin-left: 12px;
        }

        .code-section {
          padding: 12px 16px;
          background-color: #f8fafc;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .code-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .code-text {
          color: #1e40af;
          font-weight: 600;
          font-family: monospace;
        }

        .copy-button {
          background-color: #1a3c7b;
          color: #ffffff;
          border: none;
          padding: 8px 15px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 70px;
        }

        .copy-button:hover {
          background-color: white;
          color: #1a3c7b;
        }

        .copy-button.copied {
          background-color: #10b981;
        }

        .success-notification {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #10b981;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        .scroll-btn {
          background-color: #1e3a8a;
          color: white;
          border: none;
          border-radius: 3px;
          padding: 10px;
          font-size: 14px;
          cursor: pointer;
        }

        .scroll-btn:hover {
          background-color: #2563eb;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #1d4ed8;
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
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @media (max-width: 768px) {
          .coupon-card {
            width: 220px;
          }

          .main-text {
            font-size: 22px;
          }
        }

        @media (max-width: 480px) {
          .coupon-card {
            width: 200px;
          }

          .main-text {
            font-size: 20px;
          }

          .scroll-btn {
            padding: 8px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default CouponList

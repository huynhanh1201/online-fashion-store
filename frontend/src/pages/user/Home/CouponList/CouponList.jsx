import React, { useEffect, useState } from 'react'
import { getDiscounts } from '~/services/discountService.js'

const CouponList = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { discounts } = await getDiscounts()
        const latestCoupons = discounts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
        setCoupons(latestCoupons)
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
        <div className='coupon-grid'>
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
                      Nhập mã: <span className='code-text'>{coupon.code}</span>
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
      </div>

      {/* Styles ở đây */}
      <style>{`
        .coupon-container {
          padding: 20px 0;
          background-color: #ffffff;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .coupon-wrapper {
          max-width: 1450px;
          margin: 0 auto;
          padding: 0 0px;
        }

        .coupon-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .coupon-card {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
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
          border-radius: 4px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .condition-text {
          font-size: 12px;
          color: #64748b;
          font-weight: 800;
          text-align: right;
          flex-shrink: 0;
        }

        .main-value-section {
          text-align: left;
          padding: 0 7px 3px;
        }

        .main-text {
          font-size: 27px;
          font-weight: 700;
          color: #1e40af;
          line-height: 1.1;
          margin-left: 12px;
          word-break: break-word;
        }

        .currency-label {
          font-size: 16px;
          font-weight: 600;
          margin-left: 2px;
        }

        .code-section {
          padding: 12px 16px;
          background-color: #f8fafc;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .code-info {
          flex: 1;
          min-width: 0;
        }

        .code-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
          font-weight: 500;
          word-break: break-word;
        }

        .code-text {
          color: #1e40af;
          font-weight: 600;
          font-family: monospace;
        }

        .copy-button {
          background-color: #1a3c7b;
          color: #ffffff;
          border: #1a3c7b;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 70px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .copy-button:hover {
          background-color: white;
          color: #1a3c7b;
        }

        .copy-button.copied {
          background-color: #10b981;
        }

        .copy-button.copied:hover {
          background-color: #10b981;
        }

        .success-notification {
          position: absolute;
          top: 1px;
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

        /* Tablet landscape and smaller desktop */
        @media (max-width: 1200px) {
          .coupon-wrapper {
            max-width: 100%;
            padding: 0 20px;
          }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .coupon-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }

          .main-text {
            font-size: 24px;
          }

          .voucher-label {
            font-size: 14px;
          }
        }

        /* Small tablet */
        @media (max-width: 768px) {
          .coupon-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .coupon-wrapper {
            padding: 0 16px;
          }

          .coupon-header {
            padding: 10px 12px 6px 12px;
          }

          .main-text {
            font-size: 22px;
            margin-left: 10px;
          }

          .code-section {
            padding: 10px 12px;
          }

          .copy-button {
            padding: 6px 12px;
            font-size: 11px;
            min-width: 60px;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .coupon-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .coupon-container {
            padding: 16px 0;
          }

          .coupon-wrapper {
            padding: 0 12px;
          }

          .coupon-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 12px 14px 8px 14px;
          }

          .condition-text {
            text-align: left;
            align-self: flex-start;
          }

          .main-text {
            font-size: 28px;
            margin-left: 12px;
          }

          .code-section {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding: 12px 14px;
          }

          .copy-button {
            width: 100%;
            justify-self: stretch;
            padding: 10px;
            font-size: 12px;
            min-width: auto;
          }

          .code-label {
            margin-bottom: 0;
          }
        }

        /* Very small mobile */
        @media (max-width: 360px) {
          .coupon-wrapper {
            padding: 0 8px;
          }

          .main-text {
            font-size: 24px;
          }

          .voucher-label {
            font-size: 13px;
          }

          .condition-text {
            font-size: 11px;
          }
        }

        /* Landscape mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .coupon-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 480px) and (orientation: landscape) {
          .coupon-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}

export default CouponList

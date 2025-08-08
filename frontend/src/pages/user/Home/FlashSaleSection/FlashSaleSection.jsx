import React, { useEffect, useState, useRef } from 'react'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getFlashSaleCampaigns } from '~/services/admin/webConfig/flashsaleService'
import { getProducts } from '~/services/productService'

const FlashSaleSection = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCampaigns, setExpandedCampaigns] = useState({})
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const intervalRefs = useRef({})

  // Calculate initial products to show based on screen size
  const getInitialProductCount = () => {
    const { width } = screenSize

    // Calculate how many cards can fit in one row based on screen width
    // Assuming each card is approximately 290px wide with 10px gap
    const cardWidth = 290
    const gap = 10
    const containerPadding = 64 // 32px on each side
    const availableWidth = width - containerPadding

    // Calculate cards per row
    const cardsPerRow = Math.floor(availableWidth / (cardWidth + gap))

    // Return 2 rows worth of products (minimum 4, maximum 12)
    const productCount = Math.max(4, Math.min(12, cardsPerRow * 2))

    return productCount
  }

  // Handle window resize with debounce
  useEffect(() => {
    let timeoutId

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 100) // Debounce 100ms
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Toggle expanded state for a campaign
  const toggleExpanded = (campaignId) => {
    setExpandedCampaigns(prev => ({
      ...prev,
      [campaignId]: !prev[campaignId]
    }))
  }

  // Countdown logic for each campaign
  useEffect(() => {
    const timer = setInterval(() => {
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(campaign => {
          if (!campaign.endTime || campaign.status === 'expired') return campaign;

          const now = new Date();
          const end = new Date(campaign.endTime);
          const diff = end - now;

          if (diff <= 0) {
            return { ...campaign, countdown: 'Đã kết thúc', status: 'expired' };
          }

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          const pad = n => String(n).padStart(2, '0');

          const countdownText =
            days > 0
              ? `${days} ngày ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
              : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

          return { ...campaign, countdown: countdownText };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const campaignsData = await getFlashSaleCampaigns()
        if (!campaignsData.length) {
          setCampaigns([])
          setLoading(false)
          return
        }

        const { products: allProducts = [] } = await getProducts({
          page: 1,
          limit: 1000
        })

        const enrichedCampaigns = await Promise.all(
          campaignsData.map(async (campaign) => {
            // Kiểm tra xem Flash Sale có đang hoạt động không
            const now = new Date()
            const startTime = new Date(campaign.startTime)
            const endTime = new Date(campaign.endTime)

            // Chỉ hiển thị Flash Sale đang hoạt động hoặc sắp diễn ra
            if (now > endTime) {
              return null // Flash Sale đã hết hạn
            }

            const joinedProducts = (campaign.products || [])
              .map((item) => {
                const prod = allProducts.find((p) => p._id === item.productId)
                if (!prod) return null

                // Tính toán giá Flash Sale = giá gốc - giá giảm
                // item.flashPrice là giá giảm (discountPrice), không phải giá Flash Sale
                const flashSalePrice = Math.max(0, item.originalPrice - item.flashPrice)

                return {
                  ...prod,
                  exportPrice: item.originalPrice, // Giá gốc tại thời điểm flash sale
                  flashPrice: flashSalePrice, // Giá Flash Sale = giá gốc - giá giảm
                  originalFlashPrice: item.flashPrice, // Giá giảm gốc từ Flash Sale (discountPrice)
                  isFlashSale: true
                }
              })
              .filter(Boolean)

            return {
              ...campaign,
              products: joinedProducts,
              countdown: '', // Initialize countdown
              status: now < startTime ? 'upcoming' : 'active'
            }
          })
        )

        // Lọc bỏ các campaign null (đã hết hạn)
        const activeCampaigns = enrichedCampaigns.filter(campaign => campaign !== null)
        setCampaigns(activeCampaigns)
      } catch (err) {
        setError('Failed to load flash sale campaigns.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading flash sale...</div>
  if (error) return <div>{error}</div>
  if (!campaigns || campaigns.length === 0) return null

  // ======= STYLES =======
  const styles = {
    flashSale: {
      background: `linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)`,
      borderRadius: '24px',
      padding: '32px',
      color: 'white',
      marginBottom: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    },
    flashSaleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
      position: 'relative',
      zIndex: 2
    },
    flashSaleTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '28px',
      fontWeight: '800',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      color: 'white'
    },
    countdown: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      fontSize: '18px',
      fontWeight: '700',
      background: `linear-gradient(135deg, var(--error-color) 0%, #d32f2f 100%)`,
      padding: '12px 24px',
      borderRadius: '16px',
      letterSpacing: '1px',
      minWidth: '140px',
      justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white'
    },
    flashSaleCard: {
      borderRadius: '12px',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 2
    },
    viewMoreContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '16px',
      gridColumn: '1 / -1' // Span full width in grid
    },
    viewMoreButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      padding: '12px 32px',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      letterSpacing: '0.5px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 2
    }
  }

  return (
    <>
      {campaigns
        .filter(campaign => campaign.status === 'active' && campaign.products.length > 0)
        .map((campaign) => (
          <section key={campaign.id} style={{ ...styles.flashSale, marginTop: '24px' }} className="flash-sale-section">
            <div style={styles.flashSaleHeader} className="flash-sale-header">
              <h2 style={styles.flashSaleTitle} className="flash-sale-title">
                {campaign.title}
                {campaign.status === 'upcoming' && (
                  <span style={{
                    fontSize: '14px',
                    opacity: 0.9,
                    marginLeft: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }} className="upcoming-badge">
                    🔜 Sắp diễn ra
                  </span>
                )}
              </h2>
              <div style={styles.countdown} className="flash-sale-countdown">
                {campaign.status === 'upcoming'
                  ? 'Sắp diễn ra'
                  : campaign.countdown || 'Đang tải...'
                }
              </div>
            </div>

            <div className='product-grid'>
              {(() => {
                const initialCount = getInitialProductCount()
                const isExpanded = expandedCampaigns[campaign.id]
                const productsToShow = isExpanded
                  ? campaign.products
                  : campaign.products.slice(0, initialCount)
                const hasMoreProducts = campaign.products.length > initialCount

                return (
                  <>
                    {productsToShow.map((product) => (
                      <div key={product._id} style={styles.flashSaleCard} className="flash-sale-card">
                        <ProductCard
                          product={{
                            ...product,
                            // Đảm bảo giá hiển thị đúng
                            exportPrice: product.exportPrice, // Giá gốc
                            flashPrice: product.flashPrice, // Giá Flash Sale (đã tính toán)
                            originalFlashPrice: product.originalFlashPrice // Giá giảm gốc
                          }}
                          isFlashSale={true}
                        />
                      </div>
                    ))}

                    {/* Show "Xem thêm" button if there are more products */}
                    {hasMoreProducts && !isExpanded && (
                      <div style={styles.viewMoreContainer} className="view-more-container">
                        <button
                          style={styles.viewMoreButton}
                          className="view-more-button"
                          onClick={() => toggleExpanded(campaign.id)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                            e.target.style.transform = 'translateY(-2px)'
                            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          Xem thêm {campaign.products.length - initialCount} sản phẩm ›
                        </button>
                      </div>
                    )}

                    {/* Show "Thu gọn" button if expanded */}
                    {hasMoreProducts && isExpanded && (
                      <div style={styles.viewMoreContainer} className="view-more-container">
                        <button
                          style={styles.viewMoreButton}
                          className="view-more-button"
                          onClick={() => toggleExpanded(campaign.id)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                            e.target.style.transform = 'translateY(-2px)'
                            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          Thu gọn ›
                        </button>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>

            {/* CSS for responsive design and theme integration */}
            <style jsx>{`
            .flash-sale-section {
              background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%) !important;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
              border: 1px solid rgba(255, 255, 255, 0.1) !important;
              
              @media (max-width: 768px) {
                padding: 24px 20px !important;
                border-radius: 16px !important;
                margin-bottom: 24px !important;
              }
            }
            
            .flash-sale-header {
              @media (max-width: 768px) {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 12px !important;
              }
            }
            
            .flash-sale-title {
              color: white !important;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
              
              @media (max-width: 768px) {
                font-size: 24px !important;
                flex-wrap: wrap !important;
              }
            }
            
            .flash-sale-countdown {
              background: linear-gradient(135deg, var(--error-color) 0%, #d32f2f 100%) !important;
              box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3) !important;
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
              color: white !important;
              
              @media (max-width: 768px) {
                font-size: 16px !important;
                padding: 10px 20px !important;
                min-width: 120px !important;
              }
            }
            
            .upcoming-badge {
              background: rgba(255, 255, 255, 0.2) !important;
              border: 1px solid rgba(255, 255, 255, 0.3) !important;
              color: white !important;
            }
            
            .view-more-container {
              grid-column: 1 / -1 !important;
              display: flex !important;
              justify-content: center !important;
              margin-top: 16px !important;
            }
            
            .view-more-button {
              background: rgba(255, 255, 255, 0.1) !important;
              border: 2px solid rgba(255, 255, 255, 0.3) !important;
              color: white !important;
              font-family: inherit !important;
              transition: all 0.3s ease !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
              
              @media (max-width: 768px) {
                padding: 10px 24px !important;
                font-size: 14px !important;
                border-radius: 40px !important;
              }
            }
            
            .view-more-button:hover {
              background: rgba(255, 255, 255, 0.15) !important;
              border-color: rgba(255, 255, 255, 0.5) !important;
              transform: translateY(-2px) !important;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
            }
          `}</style>
          </section>
        ))}
    </>
  )
}

export default FlashSaleSection
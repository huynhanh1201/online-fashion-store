import React, { useEffect, useState, useRef } from 'react'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getFlashSaleCampaigns } from '~/services/admin/webConfig/flashsaleService'
import { getProducts } from '~/services/productService'

const FlashSaleSection = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRefs = useRef({})

  // Countdown logic for each campaign
  useEffect(() => {
    campaigns.forEach((campaign) => {
      if (!campaign.endTime) return
      function updateCountdown() {
        const now = new Date()
        const end = new Date(campaign.endTime)
        const diff = end - now
        if (diff <= 0) {
          setCampaigns((prev) =>
            prev.map((c) =>
              c.id === campaign.id ? { ...c, countdown: 'Đã kết thúc' } : c
            )
          )
          clearInterval(intervalRefs.current[campaign.id])
          return
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        const pad = (n) => String(n).padStart(2, '0')
        const countdownText =
          days > 0
            ? `${days} ngày ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
            : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaign.id ? { ...c, countdown: countdownText } : c
          )
        )
      }
      updateCountdown()
      intervalRefs.current[campaign.id] = setInterval(updateCountdown, 1000)
    })
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval)
    }
  }, [campaigns])

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
            const joinedProducts = (campaign.products || [])
              .map((item) => {
                const prod = allProducts.find((p) => p._id === item.productId)
                if (!prod) return null
                return {
                  ...prod,
                  exportPrice: item.originalPrice, // Giá gốc tại thời điểm flash sale
                  flashPrice: item.flashPrice, // Giá flash sale
                  isFlashSale: true
                }
              })
              .filter(Boolean)
            return {
              ...campaign,
              products: joinedProducts,
              countdown: '' // Initialize countdown
            }
          })
        )
        setCampaigns(enrichedCampaigns)
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
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      borderRadius: '24px',
      padding: '32px',
      color: 'white',
      marginBottom: '32px'
    },
    flashSaleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    flashSaleTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    countdown: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      background: '#f44336',
      padding: '8px 20px',
      borderRadius: '12px',
      letterSpacing: '2px',
      minWidth: '120px',
      justifyContent: 'center'
    },
    flashSaleCard: {
      borderRadius: '5px',
      width: '100%'
    },
    viewAllButton: {
      border: '1px solid #1f2937',
      color: '#1f2937',
      backgroundColor: 'transparent',
      padding: '8px 24px',
      borderRadius: '9999px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'block',
      margin: '0 auto',
      '@media (min-width: 640px)': {
        padding: '12px 32px'
      }
    }
  }

  return (
    <>
      {campaigns.map((campaign) => (
        <section key={campaign.id} style={styles.flashSale}>
          <div style={styles.flashSaleHeader}>
            <h2 style={styles.flashSaleTitle}>⚡ {campaign.title}</h2>
            <div style={styles.countdown}>
              {campaign.countdown || 'Đang tải...'}
            </div>
          </div>

          <div className='product-grid'>
            {campaign.products.slice(0, 5).map((product) => (
              <div key={product._id} style={styles.flashSaleCard}>
                <ProductCard product={product} isFlashSale={true} />
              </div>
            ))}
          </div>

          <button 
            style={styles.viewAllButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1f2937'
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#1f2937'
            }}
          >
            Xem tất cả ›
          </button>
        </section>
      ))}
    </>
  )
}

export default FlashSaleSection
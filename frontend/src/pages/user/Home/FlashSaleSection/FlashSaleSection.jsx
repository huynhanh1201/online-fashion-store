import React, { useEffect, useState, useRef } from 'react'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getFlashSaleConfig } from '~/services/admin/webConfig/flashsaleService'
import { getProducts } from '~/services/productService'

const FlashSaleSection = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [countdown, setCountdown] = useState('')
  const intervalRef = useRef(null)

  // Countdown logic
  useEffect(() => {
    if (!endTime) return
    function updateCountdown() {
      const now = new Date()
      const end = new Date(endTime)
      const diff = end - now
      if (diff <= 0) {
        setCountdown('Đã kết thúc')
        clearInterval(intervalRef.current)
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      const pad = (n) => String(n).padStart(2, '0')
      if (days > 0) {
        setCountdown(`${days} ngày ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
      } else {
        setCountdown(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
      }
    }
    updateCountdown()
    intervalRef.current = setInterval(updateCountdown, 1000)
    return () => clearInterval(intervalRef.current)
  }, [endTime])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        // Lấy flash sale config
        const config = await getFlashSaleConfig()
        setEndTime(config.endTime)
        const flashSaleItems = config.products || []
        if (!flashSaleItems.length) {
          setFlashSaleProducts([])
          setLoading(false)
          return
        }
        // Lấy toàn bộ sản phẩm
        const { products: allProducts } = await getProducts({ page: 1, limit: 1000 })
        // Join dữ liệu flash sale với sản phẩm chi tiết
        const joined = flashSaleItems.map(item => {
          const prod = allProducts.find(p => p._id === item.productId)
          if (!prod) return null
          return {
            ...prod,
            exportPrice: item.originalPrice, // Giá gốc tại thời điểm flash sale
            flashPrice: item.flashPrice,     // Giá flash sale
            isFlashSale: true
          }
        }).filter(Boolean)
        setFlashSaleProducts(joined)
      } catch (err) {
        setError('Failed to load flash sale products.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading flash sale...</div>
  if (error) return <div>{error}</div>
  if (!flashSaleProducts || flashSaleProducts.length === 0) return null

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
      justifyContent: 'center',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    },
    flashSaleCard: {
      borderRadius: '5px',
      width: '100%'
    },
    viewAllButton: {
      background: 'transparent',
      border: '2px solid white',
      color: 'white',
      padding: '12px 32px',
      borderRadius: '24px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'block',
      margin: '0 auto'
    }
  }

  return (
    <section style={styles.flashSale}>
      <div style={styles.flashSaleHeader}>
        <h2 style={styles.flashSaleTitle}>⚡ Flash Sale</h2>
        <div style={styles.countdown}>
          {countdown}
        </div>
      </div>

      <div className='product-grid'>
        {flashSaleProducts.slice(0, 5).map((product) => (
          <div key={product._id} style={styles.flashSaleCard}>
            <ProductCard product={product} isFlashSale={true} />
          </div>
        ))}
      </div>

      <button className='cta-button'>Xem tất cả</button>
    </section>
  )
}

export default FlashSaleSection

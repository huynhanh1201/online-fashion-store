import React from 'react'
import ProductCard from '~/components/ProductCards/ProductCards'

const FlashSaleSection = ({ products, loading, error }) => {
  if (loading) return <div>Loading flash sale...</div>
  if (error) return <div>Failed to load flash sale products.</div>
  if (!products || products.length === 0) return null

  const flashSaleProducts = products.slice(0, 5)

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
      gap: '8px'
    },
    countdownItem: {
      background: '#f44336',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '16px',
      minWidth: '40px',
      textAlign: 'center'
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
          <div style={styles.countdownItem}>01</div>
          <div style={styles.countdownItem}>23</div>
          <div style={styles.countdownItem}>59</div>
        </div>
      </div>

      <div style={styles.productGrid}>
        {flashSaleProducts.map((product) => (
          <div key={product._id} style={styles.flashSaleCard}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button style={styles.viewAllButton}>Xem tất cả</button>
    </section>
  )
}

export default FlashSaleSection

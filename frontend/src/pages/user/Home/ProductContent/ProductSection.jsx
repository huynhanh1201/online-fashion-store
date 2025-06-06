import ResponsiveProductCard from '~/components/ProductCards/ProductCards.jsx'
import ProductCard from '~/components/ProductCards/ProductCards.jsx'
import React from 'react'

const styles = {
  section: {
    marginBottom: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  banner: {
    position: 'relative',
    height: '440px',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px'
  },
  bannerText: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white'
  },
  seeMore: {
    display: 'block',
    marginTop: '20px',
    textAlign: 'center'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer'
  }
}

const ProductSection = ({ bannerImg, bannerTitle, bannerDesc, products }) => {
  return (
    <div style={styles.section}>
      <div style={styles.grid}>
        <div style={styles.banner}>
          <img src={bannerImg} alt={bannerTitle} style={styles.bannerImg} />
          <div style={styles.bannerText}>
            <h2>{bannerTitle}</h2>
            {bannerDesc && <p>{bannerDesc}</p>}
          </div>
        </div>

        {products.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div style={styles.seeMore}>
        <button style={styles.button}>Xem thêm</button>
      </div>
    </div>
  )
}

export default ProductSection

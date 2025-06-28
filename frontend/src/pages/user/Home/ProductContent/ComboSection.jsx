const combos = [
  'https://file.hstatic.net/1000360022/file/lookbook_sp-20_1024x1024.jpg',
  'https://file.hstatic.net/1000360022/file/lookbook_sp-25_1024x1024.jpg',
  'https://file.hstatic.net/1000360022/file/lookbook_sp-13_1024x1024.jpg',
  'https://file.hstatic.net/1000360022/file/z6630583877538_8e98a2498851fdb7719afef8fe0afb32_1024x1024.jpg'
]

const styles = {
  sectionTitle: {
    textAlign: 'center',
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  item: {
    textAlign: 'center',
    backgroundColor: 'var(--surface-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  img: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px'
  }
}

const ComboSection = () => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>COMBO MIX & MATCH</h2>
      <div style={styles.grid}>
        {combos.map((img, idx) => (
          <div style={styles.item} key={idx}>
            <img src={img} alt='Combo Item' style={styles.img} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComboSection

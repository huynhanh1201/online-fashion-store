const items = [
  {
    title: 'BETTER TOGETHER',
    img: 'https://file.hstatic.net/1000360022/file/button5-01.jpg'
  },
  {
    title: 'FIRST-TIME TEAM-UP',
    img: 'https://file.hstatic.net/1000360022/file/background.jpg'
  },
  {
    title: 'THE JOY OF FRIENDSHIP',
    img: 'https://file.hstatic.net/1000360022/file/2_copy__1__1024x1024.jpg'
  }
]

const styles = {
  banner: {
    textAlign: 'center',
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  item: {
    position: 'relative',
    height: '310px',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  text: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white'
  },
  h3: {
    fontSize: '25px',
    fontWeight: 'bold'
  },
  p: {
    fontSize: '14px'
  }
}

const CollectionBanner = () => {
  return (
    <div>
      <h2 style={styles.banner}>BỘ SƯU TẬP CHÍNH HÃNG TV MARVEL & DISNEY</h2>
      <div style={styles.grid}>
        {items.map((item, idx) => (
          <div style={styles.item} key={idx}>
            <img src={item.img} alt={item.title} style={styles.img} />
            <div style={styles.text}>
              <p style={styles.p}>Stitch</p>
              <h3 style={styles.h3}>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CollectionBanner

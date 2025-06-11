import React, { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#ef4444' }}>Đã xảy ra lỗi khi tải nội dung.</div>
      )
    }
    return this.props.children
  }
}

const Blog = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024
  const isDesktop = windowWidth >= 1024

  const mainArticles = [
    {
      id: 1,
      title: 'OUTFIT THỜI TRANG MÙA HÈ NAM 2025',
      subtitle: 'ĐẸP, DẪN ĐẦU XU HƯỚNG',
      category: 'Tip',
      image:
        'https://file.hstatic.net/1000360022/file/-thun-co-tron-voi-hoa-tiet-minimalist_69d99a7c159f40268b22d418407c972f.jpg',
      date: '26/06/2025',
      description:
        'Mùa hè 2025 đang đến gần, mang theo làn gió mới trong thế giới thời trang mùa hè nam giới. Đây là thời điểm lý tưởng...'
    },
    {
      id: 2,
      title: 'MÀU NÀO HẤP THỤ NHIỆT NHIỀU NHẤT?',
      subtitle: 'CƠ CHẾ HẤP THỤ NHIỆT CỦA MÀU SẮC',
      category: 'Tip',
      image:
        'https://file.hstatic.net/1000360022/file/ao-polo-thanh-lich-mat-me_d2cbd0c8efe44b86849e502855d8e7ea.jpg',
      date: '25/06/2025',
      description:
        'Bạn đã bao giờ thắc mắc vì sao vào mùa hè, mặc áo đen lại khiến bạn cảm thấy nóng hơn so với áo trắng? Tất cả đều liê...'
    },
    {
      id: 3,
      title: 'PHONG CÁCH LAYER',
      subtitle: 'NGHỆ THUẬT PHỐI ĐỒ NHIỀU LỚP DẪN ĐẦU XU HƯỚNG',
      category: 'Tip',
      image:
        'https://file.hstatic.net/1000360022/file/ns-icondenim-mang-den-ca-tinh-noi-bat_52a04f497aa44687895d5b67edc4cba1.jpg',
      date: '24/06/2025',
      description:
        'Nếu bạn nghĩ việc mặc nhiều lớp quần áo chỉ dành cho mùa đông thì có lẽ bạn chưa khám phá hết sức hút của phong cách...'
    }
  ]

  return (
    <ErrorBoundary>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f9fafb',
          minHeight: '100vh',
          padding: '24px 16px',
          '@media (min-width: 640px)': {
            padding: '32px 20px'
          },
          '@media (min-width: 1024px)': {
            padding: '40px 20px'
          }
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '32px' : isTablet ? '40px' : '48px'
          }}
        >
          <h1
            style={{
              fontSize: isMobile
                ? '24px'
                : isTablet
                  ? '32px'
                  : isDesktop
                    ? '48px'
                    : '40px',
              fontWeight: 'bold',
              color: '#1f2937',
              letterSpacing: '2px',
              margin: 0
            }}
          >
            TIN THỜI TRANG
          </h1>
        </div>

        {/* Main Articles Grid */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginBottom: '48px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
              gap: isMobile ? '16px' : '24px'
            }}
          >
            {mainArticles.map((article) => (
              <div
                key={article.id}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.closest('.article-card').style.transform =
                    'translateY(-8px)'
                  e.target.closest('.article-card').style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.target.closest('.article-card').style.transform =
                    'translateY(0)'
                  e.target.closest('.article-card').style.boxShadow = 'none'
                }}
              >
                <div
                  className='article-card'
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    height: isMobile ? '320px' : '384px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Category Tag */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  >
                    {article.category}
                  </div>

                  {/* Overlay Content */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.7), transparent)',
                      color: 'white',
                      padding: isMobile ? '12px' : isTablet ? '16px' : '24px',
                      paddingTop: isMobile ? '32px' : isTablet ? '40px' : '48px'
                    }}
                  >
                    <h3
                      style={{
                        fontSize: isMobile
                          ? '14px'
                          : isTablet
                            ? '16px'
                            : isDesktop
                              ? '18px'
                              : '20px',
                        fontWeight: 'bold',
                        marginBottom: isMobile ? '4px' : '8px',
                        lineHeight: '1.2',
                        margin: `0 0 ${isMobile ? '4px' : '8px'} 0`
                      }}
                    >
                      {article.title}
                    </h3>
                    <p
                      style={{
                        fontSize: isMobile ? '12px' : '14px',
                        opacity: 0.9,
                        marginBottom: isMobile ? '8px' : '16px',
                        margin: `0 0 ${isMobile ? '8px' : '16px'} 0`
                      }}
                    >
                      {article.subtitle}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: 'bold',
                          opacity: 0.9
                        }}
                      >
                        IconDenim
                        <span
                          style={{
                            fontSize: '12px',
                            marginLeft: isMobile ? '4px' : '8px',
                            opacity: 0.75
                          }}
                        >
                          Enjoy Life
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Article Details Section */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginBottom: '32px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
              gap: isMobile ? '16px' : isTablet ? '24px' : '32px'
            }}
          >
            {mainArticles.map((article) => (
              <div
                key={`detail-${article.id}`}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: isMobile ? '16px' : '0'
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#1f2937',
                    lineHeight: '1.2',
                    margin: '0 0 8px 0'
                  }}
                >
                  {article.title.charAt(0) +
                    article.title.slice(1).toLowerCase()}{' '}
                  {article.subtitle.charAt(0) +
                    article.subtitle.slice(1).toLowerCase()}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#6b7280',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}
                >
                  {article.date}
                </p>
                <p
                  style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#6b7280',
                    lineHeight: '1.6',
                    margin: 0
                  }}
                >
                  {article.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '24px',
            '@media (min-width: 640px)': {
              marginTop: '32px'
            }
          }}
        >
          <button
            style={{
              border: '1px solid #1f2937',
              color: '#1f2937',
              backgroundColor: 'transparent',
              padding: '8px 24px',
              borderRadius: '9999px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '@media (min-width: 640px)': {
                padding: '12px 32px'
              }
            }}
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
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Blog

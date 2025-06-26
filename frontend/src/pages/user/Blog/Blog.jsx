import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import useBlog from '~/hooks/useBlog.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
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
  const navigate = useNavigate()
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  // Sử dụng hook blog
  const { blogs, loading, error, fetchLatestBlogs } = useBlog()

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch blogs khi component mount
  React.useEffect(() => {
    fetchLatestBlogs(6) // Lấy 6 bài viết mới nhất
  }, [fetchLatestBlogs])

  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024
  const isDesktop = windowWidth >= 1024



  // Format dữ liệu từ API để phù hợp với UI
  const formatBlogData = (blogData) => {
    return {
      id: blogData._id || blogData.id,
      title: blogData.title || '',
      subtitle: blogData.excerpt || blogData.subtitle || '',
      category: blogData.category || 'Tip',
      image: blogData.coverImage || blogData.thumbnail || blogData.image || '',
      date: blogData.publishedAt ?
        new Date(blogData.publishedAt).toLocaleDateString('vi-VN') :
        new Date(blogData.createdAt).toLocaleDateString('vi-VN'),
      description: blogData.content ?
        // Remove HTML tags and limit to 150 characters
        blogData.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' :
        blogData.excerpt || ''
    }
  }

  // Sử dụng dữ liệu từ API hoặc fallback
  const mainArticles = blogs.length > 0 ? blogs.map(formatBlogData) : []

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

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              fontSize: '16px',
              color: '#6b7280'
            }}
          >
            Đang tải bài viết...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              fontSize: '16px',
              color: '#ef4444',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        {/* Main Articles Grid */}
        {!loading && (
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
                  onClick={() => navigate(`/blog/${article.id}`)}
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
                      src={optimizeCloudinaryUrl(article.image)}
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        {!loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '48px',
              '@media (min-width: 640px)': {
                marginTop: '64px'
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
        )}
      </div>
    </ErrorBoundary>
  )
}

export default Blog

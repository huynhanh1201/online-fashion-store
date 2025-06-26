import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useBlog from '~/hooks/useBlog.js'

class ErrorBoundary extends React.Component {
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

const BlogDetail = () => {
  const { blogId } = useParams()
  const navigate = useNavigate()
  const { currentBlog, loading, error, fetchBlogById } = useBlog()

  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  const [imageLoaded, setImageLoaded] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    if (blogId) {
      setImageLoaded(false) // Reset image loading state
      fetchBlogById(blogId)
    }
  }, [blogId, fetchBlogById])

  const isMobile = windowWidth < 640

  if (loading) {
    return (
      <ErrorBoundary>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f9fafb',
            minHeight: '100vh',
            padding: isMobile ? '16px' : '24px'
          }}
        >
          {/* Back Button Skeleton */}
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                width: '100px',
                height: '36px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
          </div>

          {/* Article Skeleton */}
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Image Skeleton */}
            <div
              style={{
                width: '100%',
                height: isMobile ? '200px' : '400px',
                backgroundColor: '#e5e7eb',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />

            {/* EditContent Skeleton */}
            <div style={{ padding: isMobile ? '24px 16px' : '32px 24px' }}>
              <div
                style={{
                  width: '80px',
                  height: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '32px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              <div
                style={{
                  width: '80%',
                  height: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>
                  Đang tải bài viết...
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes pulse {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}</style>
        </div>
      </ErrorBoundary>
    )
  }

  if (error || !currentBlog) {
    return (
      <ErrorBoundary>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f9fafb',
            minHeight: '100vh',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{ fontSize: '16px', color: '#ef4444', marginBottom: '16px' }}
          >
            {error || 'Không tìm thấy bài viết'}
          </div>
          <button
            onClick={() => navigate('/blog')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1f2937',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Quay lại danh sách
          </button>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f9fafb',
          minHeight: '100vh',
          padding: isMobile ? '16px' : '24px'
        }}
      >
        {/* Back Button */}
        <div
          style={{ maxWidth: '1024px', margin: '0 auto', marginBottom: '24px' }}
        >
          <button
            onClick={() => navigate('/blog')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Quay lại
          </button>
        </div>

        {/* Article EditContent */}
        <article
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Featured Image */}
          {(currentBlog.coverImage ||
            currentBlog.thumbnail ||
            currentBlog.image) && (
            <div
              style={{
                width: '100%',
                height: isMobile ? '200px' : '400px',
                position: 'relative',
                backgroundColor: '#f3f4f6'
              }}
            >
              {!imageLoaded && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Đang tải ảnh...
                  </div>
                </div>
              )}
              <img
                src={
                  currentBlog.coverImage ||
                  currentBlog.thumbnail ||
                  currentBlog.image
                }
                alt={currentBlog.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>
          )}

          {/* Article Header */}
          <div style={{ padding: isMobile ? '24px 16px' : '32px 24px' }}>
            {/* Category */}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              {currentBlog.category}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px',
                lineHeight: '1.2',
                margin: '0 0 8px 0'
              }}
            >
              {currentBlog.title}
            </h1>

            {/* Subtitle */}
            {(currentBlog.excerpt ||
              currentBlog.subtitle ||
              currentBlog.summary) && (
              <h2
                style={{
                  fontSize: isMobile ? '16px' : '18px',
                  color: '#6b7280',
                  fontWeight: 'normal',
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}
              >
                {currentBlog.excerpt ||
                  currentBlog.subtitle ||
                  currentBlog.summary}
              </h2>
            )}

            {/* Meta Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '24px',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '32px'
              }}
            >
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                <span style={{ fontWeight: 'bold' }}>
                  {currentBlog.author?.name || 'Không rõ'}
                </span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>
                  {currentBlog.publishedAt
                    ? new Date(currentBlog.publishedAt).toLocaleDateString(
                        'vi-VN'
                      )
                    : new Date(currentBlog.createdAt).toLocaleDateString(
                        'vi-VN'
                      )}
                </span>
              </div>

              {/* {(currentBlog.views || currentBlog.likes) && (
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {currentBlog.views && <span>{currentBlog.views} lượt xem</span>}
                  {currentBlog.views && currentBlog.likes && <span style={{ margin: '0 8px' }}>•</span>}
                  {currentBlog.likes && <span>{currentBlog.likes} lượt thích</span>}
                </div>
              )} */}
            </div>

            {/* EditContent */}
            <div
              style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#374151',
                whiteSpace: 'pre-wrap'
              }}
              dangerouslySetInnerHTML={{ __html: currentBlog.content }}
            />

            {/* Tags */}
            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid #e5e7eb'
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#6b7280'
                  }}
                >
                  Thẻ:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        borderRadius: '999px',
                        fontSize: '12px'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </ErrorBoundary>
  )
}

export default BlogDetail

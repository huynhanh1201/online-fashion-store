import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import useBlog from '~/hooks/useBlog.js'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ color: '#ef4444' }}>Đã xảy ra lỗi khi tải nội dung.</Box>
      )
    }
    return this.props.children
  }
}

const BlogHome = () => {
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

  // Format dữ liệu từ API để phù hợp với UI
  const formatBlogData = (blogData) => {
    return {
      id: blogData._id || blogData.id,
      title: blogData.title || '',
      subtitle: blogData.excerpt || blogData.subtitle || '',
      category: blogData.category || 'Tip',
      image: blogData.coverImage || blogData.thumbnail || blogData.image || '',
      date: blogData.publishedAt
        ? new Date(blogData.publishedAt).toLocaleDateString('vi-VN')
        : new Date(blogData.createdAt).toLocaleDateString('vi-VN'),
      description: blogData.content
        ? // Remove HTML tags and limit to 150 characters
          blogData.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
        : blogData.excerpt || ''
    }
  }

  // Sử dụng dữ liệu từ API hoặc fallback
  const mainArticles = blogs.length > 0 ? blogs.map(formatBlogData) : []

  return (
    <ErrorBoundary>
      <Box
        sx={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f9fafb',
          padding: { xs: '40px 16px', sm: '48px 20px', lg: '60px 20px' }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: { xs: '32px', sm: '40px', lg: '48px' }
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontSize: { xs: '24px', sm: '32px', lg: '36px' },
              fontWeight: 'bold',
              color: '#1f2937',
              letterSpacing: '1px',
              margin: 0,
              marginBottom: '8px'
            }}
          >
            TIN THỜI TRANG
          </Typography>
          <Typography
            sx={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }}
          >
            Cập nhật xu hướng thời trang mới nhất
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              fontSize: '16px',
              color: '#6b7280'
            }}
          >
            Đang tải bài viết...
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box
            sx={{
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
          </Box>
        )}

        {/* Flex Layout với width XL - Horizontal Cards */}
        {!loading && (
          <Box
            sx={{
              maxWidth: '1800px', // XL width
              margin: '0 auto',
              marginBottom: '48px',
              padding: '0 16px'
            }}
          >
            {/* Flex container - vertical stack */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: '20px', sm: '24px', lg: '32px' }
              }}
            >
              {mainArticles.map((article) => (
                <Box
                  key={article.id}
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onClick={() => navigate(`/blog/${article.id}`)}
                  onMouseEnter={(e) => {
                    e.target.closest('.article-card').style.transform =
                      'translateY(-4px)'
                    e.target.closest('.article-card').style.boxShadow =
                      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.closest('.article-card').style.transform =
                      'translateY(0)'
                    e.target.closest('.article-card').style.boxShadow =
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <Box
                    className='article-card'
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      height: { xs: 'auto', sm: '200px', lg: '250px' }
                    }}
                  >
                    {/* Image Section */}
                    <Box
                      sx={{
                        flex: { xs: 'none', sm: '0 0 40%' },
                        height: { xs: '200px', sm: '100%' },
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        component='img'
                        src={article.image}
                        alt={article.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />

                      {/* Category Tag */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {article.category}
                      </Box>
                    </Box>

                    {/* EditContent Section */}
                    <Box
                      sx={{
                        flex: '1',
                        padding: { xs: '20px', sm: '24px', lg: '32px' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box>
                        <Typography
                          variant='h3'
                          sx={{
                            fontSize: { xs: '18px', sm: '20px', lg: '24px' },
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '8px',
                            lineHeight: '1.3',
                            margin: '0 0 8px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {article.title}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: { xs: '14px', sm: '15px', lg: '16px' },
                            color: '#6b7280',
                            margin: '0 0 16px 0',
                            lineHeight: '1.6',
                            display: '-webkit-box',
                            WebkitLineClamp: { xs: 2, sm: 3 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {article.subtitle}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 'auto'
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#9ca3af',
                            fontWeight: '500'
                          }}
                        >
                          {article.date}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#3b82f6',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Đọc thêm →
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* View All Button */}
        {!loading && mainArticles.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '32px'
            }}
          >
            <Box
              component='button'
              sx={{
                border: '1px solid #1f2937',
                color: '#1f2937',
                backgroundColor: 'transparent',
                padding: { xs: '8px 20px', sm: '10px 28px' },
                borderRadius: '9999px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: '#1f2937',
                  color: 'white'
                }
              }}
              onClick={() => navigate('/blog')}
            >
              Xem tất cả ›
            </Box>
          </Box>
        )}
      </Box>
    </ErrorBoundary>
  )
}

export default BlogHome

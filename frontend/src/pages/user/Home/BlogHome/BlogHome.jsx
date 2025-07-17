import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
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
        <Box sx={{ color: '#ef4444' }}>Đã xảy ra lỗi khi tải nội dung.</Box>
      )
    }
    return this.props.children
  }
}

const BlogHome = () => {
  const navigate = useNavigate()

  // Sử dụng hook blog
  const { blogs, loading, error, fetchLatestBlogs } = useBlog()

  // Fetch blogs khi component mount
  React.useEffect(() => {
    fetchLatestBlogs(3) // Lấy 3 bài viết mới nhất
  }, [fetchLatestBlogs])

  // Format dữ liệu từ API để phù hợp với UI
  const formatBlogData = (blogData) => {
    const title = blogData.title || ''
    const subtitle = blogData.excerpt || blogData.subtitle || ''
    const content = blogData.content
      ? blogData.content.replace(/<[^>]*>/g, '')
      : blogData.excerpt || ''

    return {
      id: blogData._id || blogData.id,
      title: title.length > 60 ? title.substring(0, 60) + '...' : title,
      subtitle: subtitle.length > 80 ? subtitle.substring(0, 80) + '...' : subtitle,
      category: blogData.category || 'Tip',
      image: blogData.coverImage || blogData.thumbnail || blogData.image || '',
      date: blogData.publishedAt
        ? new Date(blogData.publishedAt).toLocaleDateString('vi-VN')
        : new Date(blogData.createdAt).toLocaleDateString('vi-VN'),
      description: content.length > 120 ? content.substring(0, 120) + '...' : content
    }
  }

  // Sử dụng dữ liệu từ API hoặc fallback và giới hạn 3 bài viết
  const mainArticles =
    blogs.length > 0 ? blogs.slice(0, 3).map(formatBlogData) : []

  // Nếu không có blog nào và không đang loading thì không hiển thị gì
  if (!loading && !error && mainArticles.length === 0) {
    return null
  }

  return (
    <ErrorBoundary>
      <Box
        sx={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          width: '100%'
        }}
      >
        {/* Container với width và padding giống Content.jsx */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '96vw',
            margin: '0 auto',
            padding: {
              xs: '24px 16px',
              sm: '24px 16px',
              md: '24px 16px'
            }
          }}
        >
          {/* Loading State */}
          {loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: '150px', sm: '200px' },
                textAlign: 'center'
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  color: 'grey.500',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Đang tải bài viết...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: '150px', sm: '200px' },
                textAlign: 'center'
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  color: 'error.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          {/* Grid Layout - Vertical Cards */}
          {!loading && mainArticles.length > 0 && (
            <Box
              sx={{
                mb: { xs: 4, sm: 6, md: 8 }
              }}
            >
              {/* Grid container */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                  },
                  gap: { xs: 2.5, sm: 3, md: 4 }
                }}
              >
                {mainArticles.map((article) => (
                  <Box
                    key={article.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        '& .article-card': {
                          boxShadow: (theme) => theme.shadows[8]
                        },
                        '& .article-image': {
                          transform: 'scale(1.02)' // Reduced scale to minimize cropping
                        }
                      }
                    }}
                    onClick={() => navigate(`/blog/${article.id}`)}
                  >
                    <Box
                      className='article-card'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: (theme) => theme.shadows[2],
                        height: '100%'
                      }}
                    >
                      {/* Image Section */}
                      <Box
                        sx={{
                          aspectRatio: '16/9', // Standard aspect ratio for better image fit
                          position: 'relative',
                          overflow: 'hidden',
                          width: '100%',
                          backgroundColor: 'grey.100', // Fallback background for broken images
                        }}
                      >
                        <Box
                          component='img'
                          className='article-image'
                          src={
                            article.image
                              ? optimizeCloudinaryUrl(article.image, {
                                width: 600, // Optimize for display size
                                height: 337, // Match 16:9 aspect ratio (600 * 9/16 ≈ 337)
                                crop: 'fill', // Cloudinary crop mode
                                quality: 'auto',
                                fetch_format: 'auto',
                              })
                              : '/path/to/fallback-image.jpg' // Fallback image
                          }
                          alt={article.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain', // Changed to 'contain' to avoid cropping
                            objectPosition: 'center',
                            transition: 'transform 0.3s ease',
                            display: 'block',
                            backgroundColor: 'transparent',
                          }}
                          onError={(e) => {
                            e.target.src = '/path/to/fallback-image.jpg'; // Handle broken images
                          }}
                        />

                        {/* Category Tag */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                            color: 'common.white',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 2.5,
                            typography: 'caption',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {article.category}
                        </Box>
                      </Box>

                      {/* Content Section */}
                      <Box
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{
                            fontSize: {
                              xs: '1rem',
                              sm: '1.125rem',
                              md: '1.25rem'
                            },
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1.5,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: { xs: 60, sm: 66, md: 72 }
                          }}
                        >
                          {article.title}
                        </Typography>

                        <Typography
                          variant='body2'
                          sx={{
                            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                            color: 'text.secondary',
                            mb: 2,
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flex: 1
                          }}
                        >
                          {article.subtitle}
                        </Typography>

                        {/* Footer */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 'auto',
                            pt: 2,
                            borderTop: 1,
                            borderColor: 'divider'
                          }}
                        >
                          <Typography
                            variant='caption'
                            sx={{
                              color: 'text.disabled',
                              fontWeight: 500
                            }}
                          >
                            {article.date}
                          </Typography>

                          <Typography
                            variant='body2'
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              '&:hover': {
                                color: 'primary.dark'
                              }
                            }}
                          >
                            Đọc thêm
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
                mt: { xs: 4, sm: 5, md: 6 }
              }}
            >
              <Box
                component='button'
                sx={{
                  border: 1,
                  borderColor: 'grey.800',
                  color: 'grey.800',
                  bgcolor: 'transparent',
                  px: { xs: 2.5, sm: 3.5 },
                  py: { xs: 1, sm: 1.25 },
                  borderRadius: '50px',
                  typography: 'body2',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'grey.800',
                    color: 'common.white',
                    transform: 'translateY(-1px)',
                    boxShadow: (theme) => theme.shadows[4]
                  }
                }}
                onClick={() => navigate('/blog')}
              >
                Xem tất cả
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ErrorBoundary>
  )
}

export default BlogHome
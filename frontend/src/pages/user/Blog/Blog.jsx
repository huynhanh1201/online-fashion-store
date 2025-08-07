import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Breadcrumbs, Link } from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
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

const Blog = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = React.useState(1)
  const [hasMoreBlogs, setHasMoreBlogs] = React.useState(true)
  const [loadingMore, setLoadingMore] = React.useState(false)

  // Sử dụng hook blog
  const { blogs, loading, error, fetchLatestBlogs, fetchBlogsWithPagination, appendBlogs } = useBlog()

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])
  // Fetch blogs khi component mount
  React.useEffect(() => {
    fetchLatestBlogs(6) // Lấy 6 bài viết mới nhất
  }, [fetchLatestBlogs])

  // Check if there are more blogs to load
  React.useEffect(() => {
    const checkHasMore = async () => {
      if (blogs.length > 0) {
        try {
          const result = await fetchBlogsWithPagination(2, 6) // Check trang 2
          setHasMoreBlogs(result.hasMore || result.blogs.length > 0)
        } catch (err) {
          console.error('Error checking more blogs:', err)
          setHasMoreBlogs(false)
        }
      }
    }

    if (blogs.length > 0 && currentPage === 1) {
      checkHasMore()
    }
  }, [blogs.length, fetchBlogsWithPagination, currentPage])

  // Function để load thêm blogs
  const loadMoreBlogs = async () => {
    if (loadingMore || !hasMoreBlogs) return

    setLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const result = await fetchBlogsWithPagination(nextPage, 6)

      if (result.blogs.length > 0) {
        appendBlogs(result.blogs)
        setCurrentPage(nextPage)
        setHasMoreBlogs(result.hasMore)
      } else {
        setHasMoreBlogs(false)
      }
    } catch (err) {
      console.error('Error loading more blogs:', err)
      setHasMoreBlogs(false)
    } finally {
      setLoadingMore(false)
    }
  }



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
      image: blogData.coverImage,
      date: blogData.publishedAt
        ? new Date(blogData.publishedAt).toLocaleDateString('vi-VN')
        : new Date(blogData.createdAt).toLocaleDateString('vi-VN'),
      description: content.length > 120 ? content.substring(0, 120) + '...' : content
    }
  }

  // Sử dụng dữ liệu từ API hoặc fallback
  const mainArticles = blogs.length > 0 ? blogs.map(formatBlogData) : []

  return (
    <ErrorBoundary>
      <Box
        sx={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          width: '100%',
          minHeight: '100vh'
        }}
      >

        {/* Container với width và padding giống BlogHome.jsx */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '96vw',
            margin: '0 auto',
            pt: {
              xs: 2,  // Tăng padding-top để tránh header
              sm: 2,
              md: 2
            },
            px: {
              xs: 2,
              sm: 2,
              md: 2
            },
            pb: {
              xs: 3,
              sm: 3,
              md: 3
            }
          }}
        >
          <Breadcrumbs
            separator={<NavigateNext fontSize='small' />}
            aria-label='breadcrumb'
          >
            <Link

              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#007bff',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main'
                },
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            // component={Link}
            // to='/product'
            >
              Trang chủ
            </Link>
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
                fontWeight: 500
              }}
            >
              Tin thời trang
            </Typography>
          </Breadcrumbs>
          {/* Header Section */}
          <Box
            sx={{
              textAlign: 'center',
              mb: { xs: 3, sm: 4, md: 5 }
            }}
          >
            <Typography
              variant='h2'
              sx={{
                fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.5rem' },
                fontWeight: 700,
                color: 'grey.900',
                letterSpacing: '0.05em',
                mb: 1
              }}
            >
              TIN THỜI TRANG
            </Typography>
            <Typography
              variant='body1'
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: 'grey.600'
              }}
            >
              Khám phá xu hướng thời trang mới nhất
            </Typography>
          </Box>

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

          {/* No Blogs State */}
          {!loading && !error && mainArticles.length === 0 && (
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
                  color: 'grey.600',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Quản trị viên chưa cập nhật bài viết
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
                          boxShadow: (theme) => theme.shadows[8],
                        },
                        '& .article-image': {
                          transform: 'scale(1.02)', // Reduced scale to minimize cropping
                        },
                      },
                    }}
                    onClick={() => navigate(`/blog/${article.id}`)}
                  >
                    <Box
                      className="article-card"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: (theme) => theme.shadows[2],
                        height: '100%',
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
                        {article.image ? (
                          <Box
                            component="img"
                            className="article-image"
                            src={optimizeCloudinaryUrl(article.image, {
                              width: 600, // Optimize for display size
                              height: 337, // Match 16:9 aspect ratio (600 * 9/16 ≈ 337)
                              crop: 'fill', // Cloudinary crop mode
                              quality: 'auto',
                              fetch_format: 'auto',
                            })}
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
                              // Hide the image when error occurs to prevent infinite loop
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          // Placeholder when no image available
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'grey.200',
                              color: 'grey.500',
                            }}
                          >
                            <Typography variant="body2">
                              Không có ảnh
                            </Typography>
                          </Box>
                        )}

                        {/* Category Tag */}
                        {/* <Box
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
                        </Box> */}
                      </Box>

                      {/* Content Section (unchanged) */}
                      <Box
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: {
                              xs: '1rem',
                              sm: '1.125rem',
                              md: '1.25rem',
                            },
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: { xs: 60, sm: 66, md: 72 },
                          }}
                        >
                          {article.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                            color: 'text.secondary',
                            mb: 2,
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flex: 1,
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
                            borderColor: 'divider',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.disabled',
                              fontWeight: 500,
                            }}
                          >
                            {article.date}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              '&:hover': {
                                color: 'primary.dark',
                              },
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

          {/* Load More Button */}
          {!loading && hasMoreBlogs && mainArticles.length > 0 && (
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
                onClick={loadMoreBlogs}
                disabled={loadingMore}
                sx={{
                  border: 1,
                  borderColor: loadingMore ? 'grey.400' : 'grey.800',
                  color: loadingMore ? 'grey.400' : 'grey.800',
                  bgcolor: 'transparent',
                  px: { xs: 2.5, sm: 3.5 },
                  py: { xs: 1, sm: 1.25 },
                  borderRadius: '50px',
                  typography: 'body2',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 500,
                  opacity: loadingMore ? 0.6 : 1,
                  '&:hover': !loadingMore && {
                    bgcolor: 'grey.800',
                    color: 'common.white',
                    transform: 'translateY(-1px)',
                    boxShadow: (theme) => theme.shadows[4]
                  }
                }}
              >
                {loadingMore ? 'Đang tải...' : 'Xem thêm'}
              </Box>
            </Box>
          )}

          {/* No More Blogs Message */}
          {!loading && !hasMoreBlogs && mainArticles.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: { xs: 4, sm: 5, md: 6 }
              }}
            >
              <Typography
                variant='body2'
                sx={{
                  color: 'text.disabled',
                  fontWeight: 500
                }}
              >
                Đã hiển thị tất cả bài viết
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </ErrorBoundary>
  )
}

export default Blog

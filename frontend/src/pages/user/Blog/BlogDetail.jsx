import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link
} from '@mui/material'
import { ArrowBack, NavigateNext } from '@mui/icons-material'
import useBlog from '~/hooks/useBlog.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

// Utility function to generate heading numbers
const generateHeadingNumbers = (headings) => {
  const counters = [0, 0, 0, 0, 0, 0] // For h1-h6

  return headings.map(heading => {
    const level = heading.level - 1 // Convert to 0-based index

    // Reset deeper level counters
    for (let i = level + 1; i < counters.length; i++) {
      counters[i] = 0
    }

    // Increment current level counter
    counters[level]++

    // Generate number string (only show non-zero levels)
    const numberParts = counters.slice(0, level + 1).filter((count, index) =>
      count > 0 || index <= level
    )
    const number = numberParts.join('.')

    return {
      ...heading,
      number
    }
  })
}

// Utility function to extract headings from HTML content
const extractHeadings = (htmlContent) => {
  if (!htmlContent) return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

  const headingsData = Array.from(headings).map((heading, index) => {
    const id = `heading-${index}-${heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    heading.id = id // Add ID to the heading

    return {
      id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
      element: heading
    }
  })

  // Add numbering to headings
  return generateHeadingNumbers(headingsData)
}

// Table of Contents Component
const TableOfContents = ({ headings, isMobile }) => {
  const [activeId, setActiveId] = React.useState('')
  const theme = useTheme()

  React.useEffect(() => {
    const updateActiveHeading = () => {
      if (headings.length === 0) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const offsetTop = 160 // Account for fixed header + some buffer

      // Get all heading elements with their positions
      const headingElements = headings.map(heading => {
        const element = document.getElementById(heading.id)
        if (!element) return null

        const rect = element.getBoundingClientRect()
        const absoluteTop = rect.top + scrollTop

        return {
          id: heading.id,
          element,
          top: absoluteTop,
          isVisible: rect.top <= offsetTop
        }
      }).filter(Boolean)

      if (headingElements.length === 0) return

      // Sort by document position (top to bottom)
      headingElements.sort((a, b) => a.top - b.top)

      // Find the active heading
      let activeHeading = headingElements[0]

      // Look for the last heading that has passed the offset point
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i]
        if (heading.top <= scrollTop + offsetTop) {
          activeHeading = heading
          break
        }
      }

      // Special case: if we're at the very top of the document
      if (scrollTop < 100) {
        activeHeading = headingElements[0]
      }

      // Special case: if we're near the bottom of the document
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      if (scrollTop + windowHeight >= documentHeight - 100) {
        activeHeading = headingElements[headingElements.length - 1]
      }

      if (activeHeading && activeHeading.id !== activeId) {
        setActiveId(activeHeading.id)
      }
    }

    // Initial update
    updateActiveHeading()

    // Throttled scroll listener for better performance
    let timeoutId = null
    const throttledScrollHandler = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(updateActiveHeading, 50)
    }

    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    window.addEventListener('resize', updateActiveHeading, { passive: true })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('scroll', throttledScrollHandler)
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [headings, activeId])

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -120 // Adjusted offset for header height and spacing
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      // Smooth scroll with better performance
      window.scrollTo({
        top: y,
        behavior: 'smooth',
        block: 'start'
      })

      // Update active state immediately for better UX
      setActiveId(id)
    }
  }

  if (headings.length === 0) return null

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'fit-content',
        maxHeight: { xs: 'auto', md: '100%' },
        overflowY: { md: 'auto' },
        overflowX: 'hidden', // Prevent horizontal overflow
        mb: isMobile ? 2 : 0,
        minWidth: 0 // Allow flex item to shrink
      }}
    >
      <Typography variant="h6" sx={{ m: 2, mb: 1, fontWeight: 600, color: 'primary.main' }}>
        Danh mục tiêu đề bài viết
      </Typography>
      <List
        dense
        sx={{
          maxHeight: isMobile ? '200px' : 'calc(100vh - 450px)', // Much shorter height
          overflowY: 'auto',
          overflowX: 'hidden', // Prevent horizontal overflow
          px: 1, // Add padding to prevent edge overflow
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[300],
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.grey[400],
          }
        }}
      >
        {headings.map((heading) => (
          <ListItem key={heading.id} disablePadding sx={{ ml: Math.min((heading.level - 1) * 1, 3) }}>
            <ListItemButton
              onClick={() => scrollToHeading(heading.id)}
              selected={activeId === heading.id}
              disableRipple
              sx={{
                borderRadius: 1,
                minHeight: 'auto',
                transition: 'all 0.2s ease',
                py: 0.5,
                px: 1,
                backgroundColor: 'transparent',
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                },
                '&:hover': {
                  transform: 'translateX(2px)',
                  backgroundColor: 'transparent'
                },
                '&:focus': {
                  backgroundColor: 'transparent'
                },
                '&:active': {
                  backgroundColor: 'transparent'
                },
                '&.Mui-focusVisible': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <ListItemText
                primary={
                  <span>
                    <span style={{
                      fontWeight: 700,
                      fontSize: heading.level <= 2 ? '1rem' : '0.9rem',
                      color: theme.palette.primary.main
                    }}>
                      {heading.number}.
                    </span>
                    <span style={{ marginLeft: '6px' }}>
                      {heading.text}
                    </span>
                  </span>
                }
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: {
                    fontSize: heading.level <= 2 ? '1.1rem' : '1rem',
                    lineHeight: 1.4,
                    fontWeight: activeId === heading.id ? 600 : 500,
                    color: activeId === heading.id ? theme.palette.primary.main : '#1976d2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                    transition: 'color 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                      textDecoration: 'underline'
                    }
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const [headings, setHeadings] = React.useState([])
  const [processedContent, setProcessedContent] = React.useState('')
  const featuredImageRef = React.useRef(null)

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  React.useEffect(() => {
    if (blogId) {
      setImageLoaded(false) // Reset image loading state
      setImageError(false) // Reset image error state
      fetchBlogById(blogId)
    }
  }, [blogId, fetchBlogById])

  // Process content and extract headings when blog data is available
  React.useEffect(() => {
    if (currentBlog?.content) {
      const extractedHeadings = extractHeadings(currentBlog.content)
      setHeadings(extractedHeadings)

      // Update the content with IDs for headings
      const parser = new DOMParser()
      const doc = parser.parseFromString(currentBlog.content, 'text/html')
      const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

      headingElements.forEach((heading, index) => {
        const id = `heading-${index}-${heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        heading.id = id
      })

      setProcessedContent(doc.body.innerHTML)
    }
  }, [currentBlog?.content])

  if (loading) {
    return (
      <ErrorBoundary>
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
          <Box sx={{
            width: '100%',
            maxWidth: '96vw',
            margin: '0 auto',
            padding: { xs: '24px 16px', sm: '24px 16px', md: '24px 16px' }
          }}>
            {/* Back Button Skeleton */}
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
            </Box>

            <Box sx={{
              display: 'flex',
              gap: { xs: 2, md: 3 },
              flexDirection: { xs: 'column', lg: 'row' }
            }}>
              {/* Article Skeleton */}
              <Box sx={{ flex: 1 }}>
                <Card>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={{ xs: 480, sm: 600, md: 750 }}
                  />
                  <CardContent>
                    <Skeleton variant="text" width={80} height={20} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="100%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />

                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                      <Typography variant="body1" color="text.secondary">
                        Đang tải bài viết...
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Box>
      </ErrorBoundary>
    )
  }

  if (error || !currentBlog) {
    return (
      <ErrorBoundary>
        <Box
          sx={{
            bgcolor: 'grey.50',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error || 'Không tìm thấy bài viết'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/blog')}
          >
            Quay lại danh sách
          </Button>
        </Box>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Box sx={{
          width: '100%',
          maxWidth: '96vw',
          margin: '0 auto',
          padding: { xs: '24px 16px', sm: '24px 16px', md: '24px 16px' }
        }}>
          {/* Back Button */}
          {/* <Box sx={{ mb: { xs: 2, md: 1 } }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/blog')}
              sx={{
                color: 'text.secondary',
                borderColor: 'grey.300',
                fontSize: { xs: '0.875rem', md: '1rem' },
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }
              }}
            >
              Quay lại
            </Button>
          </Box> */}
          <Box
            sx={{
              bottom: { xs: '20px', sm: '30px', md: '40px' },
              left: { xs: '20px', sm: '30px', md: '40px' },
              right: { xs: '20px', sm: '30px', md: '40px' },
              maxWidth: '1800px',
              margin: '0 auto',
              mb: 2
            }}
          >
            <Breadcrumbs
              separator={<NavigateNext fontSize='small' />}
              aria-label='breadcrumb'
            >
              <Link
                component={Link}
                to='/'
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
              <Link
                component={Link}
                to={`/blog`}
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
                onClick={() => navigate('/blog')}
              // component={Link}
              // to='/product'
              >
                Tin thời trang
              </Link>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary',
                  fontWeight: 500
                }}
              >
                Chi tiết bài viết
              </Typography>
            </Breadcrumbs>
          </Box>
          {/* Main Content Container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 2, md: 3 },
              alignItems: 'flex-start'
            }}
          >
            {/* Article Content */}
            <Box sx={{
              flex: headings.length > 0 ? { xs: 1, lg: '0 0 65%' } : 1,
              width: headings.length > 0 ? { xs: '100%', lg: '65%' } : '100%',
              minWidth: 0,
              bgcolor: 'background.paper',
              borderRadius: 1,
              overflow: 'hidden',
            }}>
              {/* Article Header */}
              <CardContent sx={{ p: 0, mb: 3, mt: 0 }}>

                {/* Title */}
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700,
                    mb: 1,
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    textAlign: 'justify'
                  }}
                >
                  {currentBlog.title}
                </Typography>
                {/* <Chip
                  label={currentBlog.category}
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                /> */}
                {/* Subtitle */}
                {(currentBlog.excerpt ||
                  currentBlog.subtitle ||
                  currentBlog.summary) && (
                    <Typography
                      variant="h6"
                      component="h2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 400,
                        mb: 2,
                        lineHeight: 1.5,
                        textAlign: 'justify'
                      }}
                    >
                      {currentBlog.excerpt ||
                        currentBlog.subtitle ||
                        currentBlog.summary}
                    </Typography>
                  )}

                {/* Meta Info */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {currentBlog.author?.name || 'Không rõ'}
                    </Box>
                    <Box component="span" sx={{ mx: 1 }}>•</Box>
                    <Box component="span">
                      {currentBlog.publishedAt
                        ? new Date(currentBlog.publishedAt).toLocaleDateString('vi-VN')
                        : new Date(currentBlog.createdAt).toLocaleDateString('vi-VN')}
                    </Box>
                  </Typography>
                </Box>
              </CardContent>

              {/* Featured Image */}
              {(currentBlog.coverImage ||
                currentBlog.thumbnail ||
                currentBlog.image) && (
                  <Box ref={featuredImageRef} sx={{ position: 'relative', mb: 3 }}>
                    {!imageLoaded && !imageError && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Đang tải ảnh...
                        </Typography>
                      </Box>
                    )}

                    {imageError ? (
                      // Placeholder when image failed to load
                      <Box
                        sx={{
                          width: '100%',
                          // height: { xs: '480px', sm: '600px', md: '750px' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'grey.200',
                          color: 'grey.500',
                          borderRadius: 0
                        }}
                      >
                        <Typography variant="body1">
                          Không thể tải ảnh
                        </Typography>
                      </Box>
                    ) : (
                      <CardMedia
                        component="img"
                        image={optimizeCloudinaryUrl(currentBlog.coverImage || currentBlog.thumbnail || currentBlog.image, {
                          width: 1500,
                          height: 750,
                          quality: 'auto:good',
                          format: 'webp',
                          crop: 'fit'
                        })}
                        alt={currentBlog.title}
                        sx={{
                          objectFit: 'contain', // không bị zoom
                          opacity: imageLoaded ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                          width: '100%',
                          // height: { xs: '480px', sm: '600px', md: '750px' },
                          backgroundColor: 'grey.100', // nền xám nếu hình có khoảng trống
                          borderRadius: 0
                        }}
                        onLoad={() => {
                          setImageLoaded(true)
                          setImageError(false)
                        }}
                        onError={() => {
                          setImageLoaded(true)
                          setImageError(true)
                        }}
                      />
                    )}

                  </Box>
                )}

              {/* Article Content Container */}
              <CardContent sx={{ p: 0 }}>
                {/* Content */}
                <Box
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    lineHeight: 1.7,
                    color: 'text.primary',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    '& img': {
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      margin: '1rem 0',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      border: 'none',
                    },
                    '& p': { mb: 3 },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      mt: 4,
                      mb: 3,
                      wordWrap: 'break-word',
                      fontSize: { xs: '1.1rem', md: '1.2rem' }
                    },
                    '& ul, & ol': { mb: 3, ml: 2 },
                    '& li': { mb: 1 },
                    '& blockquote': {
                      borderLeft: 4,
                      borderColor: 'primary.main',
                      ml: 0,
                      mr: 2,
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    },
                    '& table': {
                      width: '100%',
                      overflowX: 'auto',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    },
                    '& pre': {
                      overflowX: 'auto',
                      maxWidth: '100%',
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    },
                    '& code': {
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    },

                  }}
                  dangerouslySetInnerHTML={{ __html: processedContent || currentBlog.content }}
                />

                {/* Tags Section
                {currentBlog.tags && currentBlog.tags.length > 0 && (
                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mb: 2,
                        color: 'text.primary'
                      }}
                    >
                      Thẻ bài viết
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {currentBlog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )} */}
              </CardContent>
            </Box>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <Box
                sx={{
                  flex: { xs: '1 1 auto', lg: '0 0 35%' },
                  width: { xs: '100%', lg: '35%' },
                  order: { xs: -1, lg: 1 },
                  position: { lg: 'sticky' },
                  top: { lg: '120px' },
                  alignSelf: { lg: 'flex-start' },
                  height: { lg: 'fit-content' },
                  maxHeight: { lg: 'calc(100vh - 400px)' },
                  // Align TOC with title section
                  mt: {
                    xs: 0,
                    lg: 0 // Start TOC at the same level as the title
                  }
                }}
              >
                <TableOfContents headings={headings} isMobile={isMobile} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}

export default BlogDetail

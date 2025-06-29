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
  useMediaQuery
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
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
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting and closest to the top
        const intersectingEntries = entries.filter(entry => entry.isIntersecting)
        if (intersectingEntries.length > 0) {
          // Sort by intersection ratio and distance from top
          const sortedEntries = intersectingEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top
          })
          setActiveId(sortedEntries[0].target.id)
        }
      },
      {
        rootMargin: '-140px 0px -60% 0px', // Adjusted for sticky header
        threshold: [0, 0.1, 0.5, 1]
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

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
        border: '1px solid',
        borderColor: 'grey.200',
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
        Nội dung bài viết
      </Typography>
      <List
        dense
        sx={{
          maxHeight: isMobile ? 'none' : 'calc(100vh - 200px)', // Dynamic height based on viewport
          overflowY: isMobile ? 'visible' : 'auto',
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
              sx={{
                borderRadius: 1,
                minHeight: 'auto',
                transition: 'all 0.2s ease',
                py: 0.5,
                px: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.primary,
                  }
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  transform: 'translateX(2px)'
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
  const [headings, setHeadings] = React.useState([])
  const [processedContent, setProcessedContent] = React.useState('')

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  React.useEffect(() => {
    if (blogId) {
      setImageLoaded(false) // Reset image loading state
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
          <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
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
                    height={{ xs: 200, md: 300 }}
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

              {/* TOC Skeleton - Desktop */}
              {!isMobile && (
                <Box sx={{ width: 320, flexShrink: 0 }}>
                  <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Skeleton variant="text" width={80} height={20} sx={{ m: 2, mb: 1 }} />
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} variant="text" width="90%" height={16} sx={{ mx: 2, mb: 1 }} />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Container>
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
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
          {/* Back Button */}
          <Box sx={{ mb: { xs: 2, md: 3 } }}>
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
              flex: 1,
              minWidth: 0,
              bgcolor: 'background.paper',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {/* Featured Image */}
              {(currentBlog.coverImage ||
                currentBlog.thumbnail ||
                currentBlog.image) && (
                  <Box sx={{ position: 'relative' }}>
                    {!imageLoaded && (
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
                    <CardMedia
                      component="img"
                      height={{ xs: 200, md: 300 }}
                      image={optimizeCloudinaryUrl(currentBlog.coverImage || currentBlog.thumbnail || currentBlog.image)}
                      alt={currentBlog.title}
                      sx={{
                        objectFit: 'cover',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        width: '100%',
                        height: '400px'
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                  </Box>
                )}

              {/* Article Header */}
              <CardContent sx={{ p: 0, my: 2 }}>
                {/* Category */}
                <Chip
                  label={currentBlog.category}
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />

                {/* Title */}
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700,
                    mb: 1,
                    lineHeight: 1.2,
                    wordBreak: 'break-word'
                  }}
                >
                  {currentBlog.title}
                </Typography>

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
                        lineHeight: 1.5
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
                    gap: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    mb: 3,
                    pb: 2
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

                {/* Content */}
                <Box
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    lineHeight: 1.7,
                    color: 'text.primary',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                    '& img': {
                      maxWidth: '100% !important',
                      height: '400px !important',
                      display: 'block',
                      margin: '1rem auto',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    },
                    '& p': { mb: 2 },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      mt: 3,
                      mb: 2,
                      wordWrap: 'break-word',
                      fontSize: { xs: '1.1rem', md: '1.2rem' }
                    },
                    '& ul, & ol': { mb: 2, ml: 2 },
                    '& li': { mb: 0.5 },
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
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: processedContent || currentBlog.content }}
                />

                {/* Tags */}
                {currentBlog.tags && currentBlog.tags.length > 0 && (
                  <Box sx={{ mt: 4, borderTop: 1, borderColor: 'divider', pt: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      Thẻ:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {currentBlog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`#${tag}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: 'grey.50',
                            color: 'text.secondary',
                            borderColor: 'grey.300',
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Box>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <Box
                sx={{
                  flex: { xs: '1 1 auto', lg: '0 0 320px' },
                  width: { xs: '100%', lg: '320px' },
                  maxWidth: { lg: '320px' },
                  minWidth: { lg: '320px' },
                  order: { xs: -1, lg: 1 },
                  position: { lg: 'sticky' },
                  top: { lg: '120px' },
                  alignSelf: { lg: 'flex-start' },
                  height: { lg: 'fit-content' },
                  maxHeight: { lg: 'calc(100vh - 140px)' }
                }}
              >
                <TableOfContents headings={headings} isMobile={isMobile} />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </ErrorBoundary>
  )
}

export default BlogDetail

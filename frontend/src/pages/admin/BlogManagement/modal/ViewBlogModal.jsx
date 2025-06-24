import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Card,
  CardMedia,
  Divider,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Visibility as ViewIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Close as CloseIcon,
  Article as ArticleIcon
} from '@mui/icons-material'

const ViewBlogModal = ({ open, onClose, blog }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!blog) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success'
      case 'draft': return 'warning'
      case 'archived': return 'default'
      default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'published': return 'Đã xuất bản'
      case 'draft': return 'Bản nháp'
      case 'archived': return 'Lưu trữ'
      default: return status
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isMobile ? 'sm' : 'lg'}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '12px',
          boxShadow: '0 8px 24px rgba(0, 31, 93, 0.12)',
          maxHeight: '70vh',
          margin: isMobile ? 0 : '16px'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #0052cc 0%, #2684ff 100%)',
        color: 'white',
        py: isMobile ? 1.5 : 2,
        px: isMobile ? 2 : 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: isMobile ? '56px' : '64px'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ArticleIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '1rem' : '1.25rem',
              lineHeight: 1.2
            }}
          >
            Chi tiết bài viết
          </Typography>
          <Chip
            label={getStatusLabel(blog.status)}
            color={getStatusColor(blog.status)}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{
        p: isMobile ? 2 : 3,
        backgroundColor: '#f9fafb',
        overflowY: 'auto',
        maxHeight: isMobile ? 'calc(70vh - 120px)' : 'calc(70vh - 140px)'
      }}>
        {/* Main Container using Flexbox */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 2 : 3
        }}>

          {/* Header Information */}
          <Box>
            <Typography variant="h4" gutterBottom>
              {blog.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {blog.excerpt}
            </Typography>
          </Box>

          {/* Cover Image */}
          {blog.coverImage && (
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={blog.coverImage}
                alt={blog.title}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          )}

          {/* Two Column Section: Basic Info & Stats */}
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 3
          }}>
            {/* Basic Information */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Thông tin cơ bản
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon fontSize="small" />
                    <Typography variant="body2">
                      <strong>Chuyên mục:</strong> {blog.category || 'Chưa phân loại'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TagIcon fontSize="small" />
                    <Typography variant="body2">
                      <strong>Thương hiệu:</strong> {blog.brand || 'Không có'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="body2">
                      <strong>Ngày xuất bản:</strong> {blog.createdAt}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="body2">
                      <strong>Cập nhật lần cuối:</strong> {formatDate(blog.updatedAt)}
                    </Typography>
                  </Box>

                  <Typography variant="body2">
                    <strong>Slug:</strong> {blog.slug || 'Chưa có'}
                  </Typography>
                </Stack>
              </Card>
            </Box>

            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Tác giả
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={blog.author?.avatar}
                  alt={blog.author?.name}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6">
                    {blog.author?.name || 'Không có thông tin'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {blog.author?.id || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>

          {/* Author Section */}
          <Box>
          </Box>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {blog.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    variant="outlined"
                    size="small"
                    icon={<TagIcon />}
                  />
                ))}
              </Box>
            </Card>
          )}

          {/* Additional Images */}
          {blog.images && blog.images.length > 0 && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Ảnh bổ sung ({blog.images.length})
              </Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2
              }}>
                {blog.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: isMobile ? '1 1 calc(50% - 8px)' : '1 1 calc(25% - 12px)',
                      minWidth: isMobile ? '120px' : '150px'
                    }}
                  >
                    <Card>
                      <CardMedia
                        component="img"
                        height="120"
                        image={image}
                        alt={`Ảnh ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Box>
                ))}
              </Box>
            </Card>
          )}

          {/* SEO Meta */}
          {blog.meta && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                SEO Meta Tags
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Meta Title:</strong> {blog.meta.title || 'Không có'}
                </Typography>
                <Typography variant="body2">
                  <strong>Meta Description:</strong> {blog.meta.description || 'Không có'}
                </Typography>
                {blog.meta.keywords && blog.meta.keywords.length > 0 && (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Meta Keywords:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {blog.meta.keywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Card>
          )}

          {/* Content */}
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Nội dung bài viết
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                '& img': { maxWidth: '100%', height: 'auto' },
                '& p': { marginBottom: 1 },
                '& h1, & h2, & h3, & h4, & h5, & h6': { marginTop: 2, marginBottom: 1 }
              }}
              dangerouslySetInnerHTML={{ __html: blog.content || '<p>Không có nội dung</p>' }}
            />
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: isMobile ? 2 : 3,
        backgroundColor: '#fafbff',
        borderTop: '1px solid #e8ecef',
        gap: 1.5,
        display: 'flex',
        flexDirection: isMobile ? 'column-reverse' : 'row',
        '& > *': {
          width: isMobile ? '100%' : 'auto'
        }
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: isMobile ? '100%' : '120px',
            height: '48px',
            borderRadius: 2,
            borderColor: '#9e9e9e',
            color: '#616161',
            '&:hover': {
              borderColor: '#757575',
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewBlogModal
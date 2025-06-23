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
  Stack
} from '@mui/material'
import {
  Visibility as ViewIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material'

const ViewBlogModal = ({ open, onClose, blog }) => {
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            Chi tiết bài viết
          </Typography>
          <Chip
            label={getStatusLabel(blog.status)}
            color={getStatusColor(blog.status)}
            size="small"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ maxHeight: '80vh' }}>
        <Grid container spacing={3}>
          {/* Thông tin chính */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {blog.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {blog.excerpt}
            </Typography>
          </Grid>

          {/* Ảnh bìa */}
          {blog.coverImage && (
            <Grid item xs={12}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={blog.coverImage}
                  alt={blog.title}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          )}

          {/* Thông tin meta */}
          <Grid item xs={12} md={6}>
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
                  <LocalOffer fontSize="small" />
                  <Typography variant="body2">
                    <strong>Thương hiệu:</strong> {blog.brand || 'Không có'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" />
                  <Typography variant="body2">
                    <strong>Ngày xuất bản:</strong> {formatDate(blog.publishedAt)}
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
          </Grid>

          {/* Thống kê */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Thống kê
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ViewIcon fontSize="small" />
                  <Typography variant="body2">
                    <strong>Lượt xem:</strong> {blog.views || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LikeIcon fontSize="small" />
                  <Typography variant="body2">
                    <strong>Lượt thích:</strong> {blog.likes || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CommentIcon fontSize="small" />
                  <Typography variant="body2">
                    <strong>Bình luận:</strong> {blog.commentsCount || 0}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Tác giả */}
          <Grid item xs={12}>
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
          </Grid>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <Grid item xs={12}>
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
            </Grid>
          )}

          {/* Ảnh bổ sung */}
          {blog.images && blog.images.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Ảnh bổ sung ({blog.images.length})
                </Typography>
                <Grid container spacing={2}>
                  {blog.images.map((image, index) => (
                    <Grid item xs={6} md={3} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="120"
                          image={image}
                          alt={`Ảnh ${index + 1}`}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          )}

          {/* SEO Meta */}
          {blog.meta && (
            <Grid item xs={12}>
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
            </Grid>
          )}

          {/* Nội dung */}
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewBlogModal
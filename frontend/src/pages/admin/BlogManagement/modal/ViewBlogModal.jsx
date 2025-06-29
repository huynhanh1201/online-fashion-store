import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Card,
  CardMedia,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import dayjs from 'dayjs'

const ViewBlogModal = ({ open, onClose, blog, isMobile }) => {
  const formatDate = (date) =>
    date ? dayjs(date).format('DD/MM/YYYY') : 'Không có'

  const getStatusLabel = (status) => {
    if (status === 'draft') return 'Bản nháp'
    if (status === 'published') return 'Đã xuất bản'
    return status
  }

  const getStatusColor = (status) => {
    if (status === 'draft') return '#001f5d'
    if (status === 'published') return '#001f5d'
    return 'default'
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xxl'
      fullScreen={isMobile}
      sx={{
        mt: '64px',
        '& .MuiDialog-container': { alignItems: 'end' },
        '& .MuiDialog-paper': {
          maxHeight: '96%',
          height: '96%',
          mt: 0,
          mb: 2.4
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: '83vh',
          m: isMobile ? 0 : 2
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <DialogTitle>
          <Typography fontWeight={600} variant='h6'>
            Chi tiết bài viết
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'start', p: '16px 24px', pt: 0 }}>
          <Button onClick={onClose} variant='outlined' color='error'>
            Đóng
          </Button>
        </DialogActions>
      </Box>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 2,
          backgroundColor: '#fafafa'
        }}
      >
        {/* Tiêu đề và mô tả ngắn */}
        <Box mb={2}>
          <Typography variant='h5' gutterBottom fontWeight='900'>
            {blog?.title}
          </Typography>
          <Typography color='text.secondary'>{blog?.excerpt}</Typography>
        </Box>

        {/* Ảnh bìa */}
        {blog?.coverImage && (
          <Card sx={{ mb: 2 }}>
            <CardMedia
              component='img'
              image={blog?.coverImage}
              alt='cover'
              height='100%'
              sx={{ objectFit: 'contain' }}
            />
          </Card>
        )}

        {/* Tác giả */}
        <Box display='flex' alignItems='center' gap={2} mb={2}>
          <Avatar src={blog?.author?.avatar} />
          <Box>
            <Typography fontWeight={600}>{blog?.author?.name}</Typography>
            <Typography variant='body2' color='text.secondary'>
              ID: {blog?.author?.id}
            </Typography>
          </Box>
        </Box>
        {/* Tags */}
        <Box mb={2}>
          <Typography fontWeight={600}>Thẻ (tags):</Typography>
          {blog?.tags && blog?.tags.length > 0 ? (
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {blog?.tags.map((tag, i) => (
                <Chip key={i} label={tag} />
              ))}
            </Box>
          ) : (
            <Typography
              variant='body2'
              fontStyle='italic'
              color='text.secondary'
            >
              Không có thẻ
            </Typography>
          )}
        </Box>

        {/* Thông tin thêm */}
        <Box mb={3}>
          <Typography fontWeight={600} gutterBottom>
            Thông tin thêm
          </Typography>
          <Table size='small'>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Danh mục
                </TableCell>
                <TableCell>{blog?.category || 'Chưa phân loại'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Thương hiệu
                </TableCell>
                <TableCell>{blog?.brand || 'Không có'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>Slug</TableCell>
                <TableCell>{blog?.slug || 'Không có'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Trạng thái
                </TableCell>
                <TableCell>
                  {blog?.status && (
                    <Chip
                      label={
                        blog.status === 'draft'
                          ? 'Bản nháp'
                          : blog.status === 'published'
                            ? 'Đã xuất bản'
                            : 'Đã lưu trữ'
                      }
                      color={
                        blog.status === 'draft'
                          ? 'default'
                          : blog.status === 'published'
                            ? 'success'
                            : 'error'
                      }
                      size='large'
                      sx={{ width: '127px', fontWeight: '800' }}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Ngày tạo
                </TableCell>
                <TableCell>{formatDate(blog?.createdAt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Cập nhật lần cuối
                </TableCell>
                <TableCell>{formatDate(blog?.updatedAt)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Thông tin SEO */}
        <Box mb={3}>
          <Typography fontWeight={600} gutterBottom>
            Thông tin SEO
          </Typography>
          <Table size='small'>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Meta title
                </TableCell>
                <TableCell>{blog?.meta?.title || 'Không có'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Meta description
                </TableCell>
                <TableCell>{blog?.meta?.description || 'Không có'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 400, fontWeight: 700 }}>
                  Meta keywords
                </TableCell>
                <TableCell>
                  {blog?.meta?.keywords?.length > 0
                    ? blog.meta.keywords.join(', ')
                    : 'Không có'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        {/* Nội dung */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight={600} gutterBottom>
            Nội dung bài viết
          </Typography>
          <Box
            className="content-selectable"
            sx={{
              '& img': { maxWidth: '100%', height: 'auto' },
              '& p': { marginBottom: 1 }
            }}
            dangerouslySetInnerHTML={{
              __html: blog?.content || '<p>Không có nội dung</p>'
            }}
          />
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default ViewBlogModal

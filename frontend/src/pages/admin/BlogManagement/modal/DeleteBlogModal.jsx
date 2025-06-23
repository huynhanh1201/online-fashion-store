import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

const DeleteBlogModal = ({ open, onClose, onConfirm, blog }) => {
  if (!blog) return null

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
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="error" />
        Xác nhận xóa bài viết
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Bạn có chắc chắn muốn xóa bài viết sau không?
          </Typography>
          
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            backgroundColor: '#f9f9f9',
            mt: 2
          }}>
            <Typography variant="h6" gutterBottom>
              {blog.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Trạng thái:
              </Typography>
              <Chip
                label={getStatusLabel(blog.status)}
                color={getStatusColor(blog.status)}
                size="small"
              />
            </Box>

            {blog.excerpt && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {blog.excerpt.length > 100 
                  ? `${blog.excerpt.substring(0, 100)}...` 
                  : blog.excerpt
                }
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Chuyên mục: {blog.category || 'Không có'}
              </Typography>
              {blog.views !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  Lượt xem: {blog.views}
                </Typography>
              )}
              {blog.likes !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  Lượt thích: {blog.likes}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {blog.status === 'published' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Cảnh báo:</strong> Bài viết này đang được xuất bản công khai. 
              Việc xóa có thể ảnh hưởng đến người dùng đang xem.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          startIcon={<WarningIcon />}
        >
          Xóa bài viết
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteBlogModal
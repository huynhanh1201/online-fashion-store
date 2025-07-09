import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
const ViewCategoryModal = ({ open, onClose, category }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Thông tin danh mục sản phẩm</DialogTitle>
      <Divider />
      <DialogContent sx={{ maxHeight: '69vh' }}>
        {category ? (
          <Box
            display='flex'
            gap={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                Ảnh danh mục
              </Typography>
              {/* Ảnh bên trái */}
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                border='2px dashed #ccc'
                borderRadius={2}
                // minHeight={200}
                sx={{
                  backgroundColor: '#fafafa',
                  width: 350,
                  height: 331
                }}
              >
                {category.image ? (
                  <img
                    src={optimizeCloudinaryUrl(category.image)}
                    alt='Ảnh danh mục'
                    style={{
                      width: '100%',
                      maxHeight: '100%',
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                ) : (
                  <Box textAlign='center' color='#999'>
                    <ImageNotSupportedIcon fontSize='large' />
                    <Typography fontSize={14} mt={1}>
                      Không có ảnh
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                Ảnh quảng cáo
              </Typography>
              {/* Ảnh banner (nếu có) */}
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                border='2px dashed #ccc'
                borderRadius={2}
                sx={{
                  backgroundColor: '#fafafa',
                  width: 350,
                  height: 331
                }}
              >
                {category.banner ? (
                  <img
                    src={optimizeCloudinaryUrl(category.banner)}
                    alt='Ảnh banner'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                ) : (
                  <Box textAlign='center' color='#999'>
                    <ImageNotSupportedIcon fontSize='large' />
                    <Typography fontSize={14} mt={1}>
                      Không có ảnh quản cáo
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Thông tin bên phải */}
            <Box flex={1} mt={1}>
              <Box mb={2}>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Tên danh mục
                </Typography>
                <Typography>{category.name || '—'}</Typography>
              </Box>
              {category?.parent?.name && (
                <Box mb={2}>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    Tên danh mục cha
                  </Typography>
                  <Typography>{category?.parent?.name || '—'}</Typography>
                </Box>
              )}

              <Box mb={2}>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Mô tả
                </Typography>
                <Typography
                  sx={{
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word'
                  }}
                >
                  {category.description || 'Không có mô tả'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Ngày tạo
                </Typography>
                <Typography>{formatDate(category.createdAt)}</Typography>
              </Box>

              <Box>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Ngày cập nhật
                </Typography>
                <Typography>{formatDate(category.updatedAt)}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography>Không có dữ liệu danh mục</Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewCategoryModal

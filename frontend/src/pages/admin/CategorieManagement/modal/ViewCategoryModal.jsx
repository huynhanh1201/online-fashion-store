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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Thông tin danh mục sản phẩm</DialogTitle>
      <Divider />
      <DialogContent>
        {category ? (
          <Box
            display='flex'
            gap={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            {/* Ảnh bên trái */}
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              border='2px dashed #ccc'
              borderRadius={2}
              p={2}
              minHeight={200}
              sx={{
                backgroundColor: '#fafafa',
                width: 350,
                height: 206
              }}
            >
              {category.image ? (
                <img
                  src={optimizeCloudinaryUrl(category.image)}
                  alt='Ảnh danh mục'
                  style={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
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

            {/* Thông tin bên phải */}
            <Box flex={1}>
              <Box mb={2}>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Tên danh mục
                </Typography>
                <Typography>{category.name || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Mô tả
                </Typography>
                <Typography
                  sx={{
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word'
                  }}
                >
                  {category.description || '—'}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography>Không có dữ liệu danh mục</Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='error' variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewCategoryModal

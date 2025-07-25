import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell
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
      maxWidth='xl'
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
            {/* Ảnh danh mục */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                Ảnh danh mục
              </Typography>
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                border='2px dashed #ccc'
                borderRadius={2}
                position='relative'
                sx={{
                  backgroundColor: '#ccc',
                  width: 350,
                  height: 331
                }}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt='Ảnh danh mục'
                    style={{
                      width: '100%',
                      height: '100%',
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
            </Box>
            {/* Ảnh quảng cáo */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                Ảnh quảng cáo
              </Typography>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                border='2px dashed #ccc'
                borderRadius={2}
                sx={{
                  backgroundColor: '#ccc',
                  width: 350,
                  height: 331
                }}
              >
                {category.banner ? (
                  <img
                    src={category.image}
                    alt='Ảnh banner'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 8
                    }}
                  />
                ) : (
                  <Box textAlign='center' color='#999'>
                    <ImageNotSupportedIcon fontSize='large' />
                    <Typography fontSize={14} mt={1}>
                      Không có ảnh quảng cáo
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Thông tin bên phải */}
            <Table size='small'>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: 200, fontWeight: 700 }}>
                    Tên danh mục
                  </TableCell>
                  <TableCell>{category?.name || '—'}</TableCell>
                </TableRow>

                {category?.parent?.name && (
                  <TableRow>
                    <TableCell sx={{ width: 200, fontWeight: 700 }}>
                      Tên danh mục cha
                    </TableCell>
                    <TableCell>{category?.parent?.name || '—'}</TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell sx={{ width: 200, fontWeight: 700 }}>
                    Mô tả
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word'
                      }}
                    >
                      {category?.description || 'Không có mô tả'}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ width: 200, fontWeight: 700 }}>
                    Ngày tạo
                  </TableCell>
                  <TableCell>{formatDate(category?.createdAt)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ width: 200, fontWeight: 700 }}>
                    Ngày cập nhật
                  </TableCell>
                  <TableCell>{formatDate(category?.updatedAt)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
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

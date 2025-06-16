import React, { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
const ViewProductModal = ({
  open,
  onClose,
  product,
  colorPalette,
  sizePalette
}) => {
  const imageList = Array.isArray(product?.image) ? product.image : []
  const [selectedImage, setSelectedImage] = useState(imageList[0] || '')

  const handleImageClick = (img) => {
    setSelectedImage(img)
  }
  const uniqueColors = (colors) => {
    const map = new Map()
    colors.forEach((color) => {
      const nameLower = color.name.toLowerCase().trim()
      if (!map.has(nameLower)) {
        map.set(nameLower, color)
      }
    })
    return Array.from(map.values())
  }

  const uniqueSizes = (sizes) => {
    const map = new Map()
    sizes.forEach((size) => {
      const nameLower = size.name.toLowerCase().trim()
      if (!map.has(nameLower)) {
        map.set(nameLower, size)
      }
    })
    return Array.from(map.values())
  }

  const filteredColors = colorPalette?.colors
    ? uniqueColors(colorPalette.colors)
    : []
  const filteredSizes = sizePalette?.sizes ? uniqueSizes(sizePalette.sizes) : []
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
  if (!product) return null
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      fullWidth
      PaperProps={{
        sx: {
          mt: 8,
          maxHeight: '85vh'
        },
        ...StyleAdmin.InputCustom
      }}
    >
      <DialogTitle>Thông tin sản phẩm</DialogTitle>
      <DialogContent
        dividers
        sx={{ maxHeight: 'calc(85vh - 64px)', overflowY: 'auto' }}
      >
        <Grid container spacing={2}>
          {/* Cột ảnh */}
          <Grid item xs={12} md={5}>
            {selectedImage && (
              <Box
                component='img'
                src={optimizeCloudinaryUrl(selectedImage)}
                alt='Ảnh sản phẩm'
                sx={{
                  width: '300px',
                  height: '257px',
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  border: '1px solid #ccc',
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              />
            )}

            {/* Thumbnail ảnh nhỏ với thanh cuộn ngang */}
            <Box sx={{ maxWidth: '300px', overflowX: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                {imageList.map((img, index) => (
                  <Box
                    key={index}
                    component='img'
                    src={optimizeCloudinaryUrl(img)}
                    alt={`Ảnh ${index + 1}`}
                    onClick={() => handleImageClick(img)}
                    sx={{
                      minWidth: 45,
                      width: 45,
                      height: 45,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border:
                        img === selectedImage
                          ? '2px solid #001f5d'
                          : '1px solid #ccc',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Cột thông tin */}
          <Grid item size={12} md={7} width='calc(98% - 350px)'>
            <Box sx={{ width: '100%' }}>
              <Table size='small' sx={{ width: '100%' }}>
                <TableBody>
                  <TableRow>
                    <TableCell
                      variant='head'
                      sx={{ fontWeight: 500, width: 100 }}
                    >
                      Mã sản phẩm
                    </TableCell>
                    <TableCell>{product.productCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      variant='head'
                      sx={{ fontWeight: 500, width: '25%' }}
                    >
                      Tên sản phẩm
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' sx={{ fontWeight: 500 }}>
                      Giá
                    </TableCell>
                    <TableCell>
                      {product.exportPrice?.toLocaleString('vi-VN')}đ
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' sx={{ fontWeight: 500 }}>
                      Danh mục
                    </TableCell>
                    <TableCell>
                      {product.categoryId?.name
                        .split(' ')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(' ')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' sx={{ fontWeight: 500 }}>
                      Màu sắc
                    </TableCell>
                    <TableCell>
                      {filteredColors.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {filteredColors.map((color) => (
                            <Chip
                              key={color._id}
                              label={
                                <Box
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    width: '100%'
                                  }}
                                  title={color.name} // Hiển thị toàn bộ tên khi hover
                                >
                                  {color.name}
                                </Box>
                              }
                              size='large'
                              sx={{
                                backgroundColor: '#001f5d',
                                color: '#fff',
                                fontWeight: 500,
                                width: 120,
                                paddingX: 1 // Có thể thêm nếu muốn canh nội dung đẹp hơn
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        'Chưa có'
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' sx={{ fontWeight: 500 }}>
                      Kích thước
                    </TableCell>
                    <TableCell>
                      {filteredSizes.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {filteredSizes.map((size) => (
                            <Chip
                              color='#000'
                              key={size._id}
                              label={
                                <Box
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    width: '100%' // cần để hiệu lực max width từ chip
                                  }}
                                  title={size.name} // hiện full khi hover
                                >
                                  {size.name}
                                </Box>
                              }
                              size='large'
                              sx={{
                                backgroundColor: '#001f5d',
                                color: '#fff',
                                fontWeight: 500,
                                width: 120,
                                paddingX: 1 // thêm padding nếu muốn đẹp hơn
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        'Chưa có'
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' sx={{ fontWeight: 500 }}>
                      Trạng thái
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.destroy ? 'Ngừng bán' : 'Đang bán'}
                        color={product.destroy ? 'error' : 'success'}
                        size='large'
                        sx={{ width: '120px', fontWeight: '800' }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' sx={{ fontWeight: 500 }}>
                      Ngày tạo
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell variant='head' sx={{ fontWeight: 500 }}>
                      Ngày cập nhật
                    </TableCell>
                    <TableCell>{formatDate(product.updatedAt)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>

        {/* Cột mô tả nằm ở dưới cùng */}
        <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
          Mô tả sản phẩm
        </Typography>
        {!product.description ? (
          <Typography variant='body2' color='textSecondary'>
            Chưa có mô tả cho sản phẩm này.
          </Typography>
        ) : (
          <Box
            sx={{
              width: '100%',
              mt: 2,
              '& img': {
                width: '873px !important',
                height: '873px !important',
                display: 'block',
                margin: '8px auto',
                borderRadius: '6px',
                objectFit: 'contain'
              },
              '& p': {
                margin: '8px 0',
                lineHeight: 1.6,
                wordBreak: 'break-word'
              },
              '& ul, & ol': {
                paddingLeft: '20px',
                margin: '8px 0'
              },
              '& li': {
                marginBottom: '4px'
              },
              '& strong': {
                fontWeight: 600
              },
              '& em': {
                fontStyle: 'italic'
              },
              '& a': {
                color: '#1976d2',
                textDecoration: 'underline',
                wordBreak: 'break-all'
              },
              '& span': {
                wordBreak: 'break-word'
              },
              '& *': {
                boxSizing: 'border-box'
              }
            }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          color='error'
          variant='outlined'
          onClick={onClose}
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewProductModal

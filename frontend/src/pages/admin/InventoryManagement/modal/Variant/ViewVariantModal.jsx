import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Divider
} from '@mui/material'
import Chip from '@mui/material/Chip'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
const ViewVariantModal = ({ open, onClose, variant }) => {
  if (!variant) return null

  const formatCurrency = (value) =>
    value ? `${Number(value).toLocaleString('vi-VN')}₫` : '0₫'
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
  const price = variant?.discountPrice
  const formattedPrice =
    isNaN(price) || price === 'N/A' ? 0 : formatCurrency(price)
  const VariantName = variant?.name || 'Không có tên biến thể'
  const variantColorName = variant?.color?.name || 'Không có màu sắc'
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
      fullWidth
      sx={{ padding: '16px 24px' }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Thông tin biến thể</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          {/* Ảnh bên trái */}
          <Grid item size={5}>
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              gap={1}
            >
              {variant?.color?.image ? (
                <Box
                  component='img'
                  src={optimizeCloudinaryUrl(variant.color.image)}
                  alt='color'
                  sx={{
                    width: 470,
                    height: 552,
                    objectFit: 'contain',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    border: '1px solid #ccc'
                  }}
                />
              ) : (
                <Typography variant='body2'>Không có ảnh</Typography>
              )}
            </Box>
          </Grid>
          {/*<Grid item size={1}></Grid>*/}
          {/* Thông tin chi tiết bên phải */}
          <Grid item size={7}>
            <Table
              sx={{
                '& td': { py: 1.5 }, // áp dụng cho TableCell
                '& th': { py: 1.5 } // nếu có TableHead thì áp dụng luôn
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Mã biến thể</strong>
                  </TableCell>
                  <TableCell>{variant?.sku || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ minWidth: 170 }}>
                    <strong>Mã sản phẩm</strong>
                  </TableCell>
                  <TableCell>{variant?.productCode || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Tên biến thể</strong>
                  </TableCell>
                  <TableCell>
                    {VariantName.split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(' ') || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Màu sắc</strong>
                  </TableCell>
                  <TableCell>
                    {variantColorName
                      .split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(' ') || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Kích thước</strong>
                  </TableCell>
                  <TableCell>
                    {variant?.size?.name.toUpperCase() || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Giá nhập</strong>
                  </TableCell>
                  <TableCell>{formatCurrency(variant?.importPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Giá bán</strong>
                  </TableCell>
                  <TableCell>{formatCurrency(variant?.exportPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Giá giảm cho biến thể</strong>
                  </TableCell>
                  <TableCell>{formattedPrice}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Trạng thái biến thể</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={variant.destroy ? 'Đã huỷ' : 'Còn hàng'}
                      color={variant.destroy ? 'error' : 'success'}
                      size='large'
                      sx={{ width: '127px', fontWeight: '800' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Kích thước đóng gói(DxRxC, Trọng lượng)</strong>
                  </TableCell>
                  <TableCell>
                    {variant?.packageSize?.width} x{' '}
                    {variant?.packageSize?.height} x{' '}
                    {variant?.packageSize?.length} cm,{' '}
                    {variant?.packageSize?.weight} gram
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>{formatDate(variant.createdAt)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell>{formatDate(variant.updatedAt)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          variant='outlined'
          color='error'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewVariantModal

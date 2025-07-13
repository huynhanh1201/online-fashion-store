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
  TableCell
} from '@mui/material'
import dayjs from 'dayjs'
import Chip from '@mui/material/Chip'
const ViewColorModal = ({ open, onClose, color }) => {
  if (!color) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Xem chi tiết màu</DialogTitle>
      <DialogContent dividers sx={{ py: 0 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {/* Cột trái: ảnh */}
          <Box
            sx={{
              width: 180,
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                mt: '14px',
                width: '100%',
                height: 160,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {color.image ? (
                <img
                  src={color.image}
                  alt='Ảnh màu'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Typography variant='caption' color='text.secondary'>
                  Không có ảnh
                </Typography>
              )}
            </Box>
          </Box>

          {/* Cột phải: bảng thông tin */}
          <Box sx={{ flex: 1 }}>
            <Table size='small'>
              <TableBody>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Tên sản phẩm</strong>
                  </TableCell>
                  <TableCell>
                    {color?.product?.name || 'Không xác định'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Tên màu</strong>
                  </TableCell>
                  <TableCell>{color.name || 'Không xác định'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={color.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      color={color.isActive ? 'success' : 'error'}
                      size='medium'
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>
                    {color.createdAt
                      ? dayjs(color.createdAt).format('DD/MM/YYYY HH:mm')
                      : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head' sx={{ borderBottom: 0 }}>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 0 }}>
                    {color.updatedAt
                      ? dayjs(color.updatedAt).format('DD/MM/YYYY HH:mm')
                      : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogContent>
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

export default ViewColorModal

import React, { useEffect, useMemo } from 'react'
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
import useCategories from '~/hooks/admin/useCategories'
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
  const { categories, fetchCategories } = useCategories()

  useEffect(() => {
    fetchCategories(1, 100000, { destroy: 'false' })
  }, [])

  // ✅ Dùng useMemo để tính realParentIds mỗi khi categories thay đổi
  const realParentIds = useMemo(() => {
    return new Set(
      categories
        .map((c) => c.parent?._id || c.parent) // dùng _id nếu parent là object, hoặc chính parent nếu là string
        .filter(Boolean)
    )
  }, [categories])
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      sx={{
        '& .MuiDialog-paper': {
          width: 'auto', // Chiều rộng theo nội dung
          maxWidth: 'xl', // Giới hạn không vượt quá md
          minWidth: 1200 // (tuỳ chọn) đảm bảo không quá nhỏ
        }
      }}
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Thông tin danh mục sản phẩm</DialogTitle>
      <Divider />
      <DialogContent sx={{ maxHeight: '69vh', overflowY: 'auto' }}>
        {category ? (
          <Box
            display='flex'
            gap={3}
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems='flex-start'
          >
            {/* Cột ảnh */}
            <Box display='flex' flexDirection='row' gap={2}>
              {/* Ảnh danh mục */}
              <Box>
                <Typography variant='subtitle2' fontWeight='bold' mb={1}>
                  Ảnh danh mục
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
                    height: 331,
                    overflow: 'hidden'
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
              <Box>
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
                    height: 331,
                    overflow: 'hidden'
                  }}
                >
                  {category.banner ? (
                    <img
                      src={category.banner}
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
            </Box>

            {/* Bảng thông tin */}
            <Box flex={1} overflow='auto' mt={3}>
              <Table size='small'>
                <TableBody>
                  <TableRow sx={{ height: 50 }}>
                    <TableCell
                      sx={{
                        width: 200,
                        fontWeight: 700,
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Tên danh mục
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{ display: 'inline-block', position: 'relative' }}
                      >
                        {(category?.name || '')
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(' ') || 'Không có dữ liệu'}
                        {category?._id &&
                          realParentIds.has(category._id.toString()) && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -7,
                                right: -10,
                                width: 20,
                                height: 20,
                                color: '#f00',
                                fontSize: '10px',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                              }}
                            >
                              Nhóm
                            </Box>
                          )}
                      </Box>
                    </TableCell>
                  </TableRow>

                  {category?.parent && (
                    <TableRow sx={{ height: 50 }}>
                      <TableCell
                        sx={{
                          width: 200,
                          fontWeight: 700,
                          padding: '8px 16px',
                          height: 50,
                          lineHeight: '34px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Tên nhóm danh mục
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '8px 16px',
                          height: 50,
                          lineHeight: '34px'
                        }}
                      >
                        {(category?.parent?.name || '')
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(' ') || 'Không có dữ liệu'}
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow sx={{ height: 50 }}>
                    <TableCell
                      sx={{
                        width: 200,
                        fontWeight: 700,
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Mô tả
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {category?.description || 'Không có mô tả'}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ height: 50 }}>
                    <TableCell
                      sx={{
                        width: 200,
                        fontWeight: 700,
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Ngày tạo
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px'
                      }}
                    >
                      {formatDate(category?.createdAt)}
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ height: 50 }}>
                    <TableCell
                      sx={{
                        width: 200,
                        fontWeight: 700,
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Ngày cập nhật
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: '8px 16px',
                        height: 50,
                        lineHeight: '34px'
                      }}
                    >
                      {formatDate(category?.updatedAt)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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

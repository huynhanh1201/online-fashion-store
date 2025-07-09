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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import { TableHead } from '@mui/material'
const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  },
  cellPadding: {
    height: 54,
    minHeight: 54,
    maxHeight: 54,
    lineHeight: '49px',
    py: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle'
  },
  cellPaddingColor: {
    height: 53,
    minHeight: 53,
    maxHeight: 53
  }
}

const ViewProductModal = ({
  open,
  onClose,
  product,
  colorPalette,
  sizePalette
}) => {
  const imageList = Array.isArray(product?.image) ? product.image : []
  const [selectedImage, setSelectedImage] = useState(imageList[0] || '')
  const [tabIndex, setTabIndex] = useState('1')

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }
  const handleImageClick = (img) => {
    setSelectedImage(img)
  }
  // const uniqueColors = (colors) => {
  //   const map = new Map()
  //   colors.forEach((color) => {
  //     const nameLower = color.name.toLowerCase().trim()
  //     if (!map.has(nameLower)) {
  //       map.set(nameLower, color)
  //     }
  //   })
  //   return Array.from(map.values())
  // }
  //
  // const uniqueSizes = (sizes) => {
  //   const map = new Map()
  //   sizes.forEach((size) => {
  //     const nameLower = size.name.toLowerCase().trim()
  //     if (!map.has(nameLower)) {
  //       map.set(nameLower, size)
  //     }
  //   })
  //   return Array.from(map.values())
  // }
  //
  // const filteredColors = colorPalette?.colors
  //   ? uniqueColors(colorPalette.colors)
  //   : []
  // const filteredSizes = sizePalette?.sizes ? uniqueSizes(sizePalette.sizes) : []

  // Tách ra mảng màu và kích thước
  // const filteredColors = Array.isArray(colorPalette?.colors)
  //   ? colorPalette.colors
  //   : []
  //
  // const filteredSizes = Array.isArray(sizePalette?.sizes)
  //   ? sizePalette.sizes
  //   : []
  //
  // // Lưu thêm metadata
  // const colorCreatedAt = colorPalette?.createdAt
  // const colorUpdatedAt = colorPalette?.updatedAt
  //
  // const sizeCreatedAt = sizePalette?.createdAt
  // const sizeUpdatedAt = sizePalette?.updatedAt

  const productName = product?.name || 'Không có tên sản phẩm'

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
  const categoryName = product.categoryId?.name || 'Chưa có danh mục'
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xxl'
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '95vh',
          minHeight: '95vh',
          backgroundColor: 'var(--surface-color)'
        },
        ...StyleAdmin.InputCustom
      }}
    >
      <DialogTitle>Thông tin sản phẩm</DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        <TabContext value={tabIndex}>
          {/*<Tabs*/}
          {/*  value={tabIndex}*/}
          {/*  onChange={handleTabChange}*/}
          {/*  indicatorColor='primary'*/}
          {/*  textColor='primary'*/}
          {/*  variant='scrollable'*/}
          {/*  scrollButtons='auto'*/}
          {/*>*/}
          {/*  <Tab label='Thông tin sản phẩm' value='1' />*/}
          {/*  <Tab label='Màu sắc sản phẩm' value='2' />*/}
          {/*  <Tab label='Kích thước sản phẩm' value='3' />*/}
          {/*</Tabs>*/}

          <TabPanel value='1'>
            <Grid container spacing={2}>
              {/* Cột ảnh */}
              <Grid item xs={12} md={5}>
                {selectedImage && (
                  <Box
                    component='img'
                    src={optimizeCloudinaryUrl(selectedImage)}
                    alt='Ảnh sản phẩm'
                    sx={{
                      width: '400px',
                      height: '300px',
                      objectFit: 'cover',
                      backgroundColor: 'var(--surface-color)',
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
              <Grid item size={12} md={7} width='calc(98% - 400px)'>
                <Box sx={{ width: '100%' }}>
                  <Table size='small' sx={{ width: '100%' }}>
                    <TableBody>
                      <TableRow sx={{ height: 50 }}>
                        <TableCell
                          variant='head'
                          sx={{ fontWeight: 500, width: 100, fontSize: '16px' }}
                        >
                          Mã sản phẩm
                        </TableCell>
                        <TableCell sx={{ fontSize: '16px' }}>
                          {product.productCode}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 50 }}>
                        <TableCell
                          variant='head'
                          sx={{
                            fontWeight: 500,
                            width: '25%',
                            fontSize: '16px'
                          }}
                        >
                          Tên sản phẩm
                        </TableCell>
                        <TableCell sx={{ fontSize: '16px' }}>
                          {productName
                            .split(' ')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(' ') || 'Không có tên'}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 50 }}>
                        <TableCell variant='head' sx={{ fontWeight: 500 }}>
                          Giá
                        </TableCell>
                        <TableCell sx={{ fontSize: '16px' }}>
                          {product.exportPrice?.toLocaleString('vi-VN')}₫
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 50 }}>
                        <TableCell variant='head' sx={{ fontWeight: 500 }}>
                          Danh mục
                        </TableCell>
                        <TableCell sx={{ fontSize: '16px' }}>
                          {categoryName
                            .split(' ')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(' ')}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 50 }}>
                        <TableCell
                          variant='head'
                          sx={{
                            fontWeight: 500,
                            minWidth: 340,
                            fontSize: '16px'
                          }}
                        >
                          Kích thước đóng gói(DxRxC, Trọng lượng)
                        </TableCell>
                        <TableCell sx={{ fontSize: '16px' }}>
                          {product?.packageSize?.width} x{' '}
                          {product?.packageSize?.height} x{' '}
                          {product?.packageSize?.length} cm,{' '}
                          {product?.packageSize?.weight} gram
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 50 }}>
                        <TableCell
                          variant='head'
                          sx={{ fontWeight: 500, fontSize: '16px' }}
                        >
                          Trạng thái
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              product?.status === 'draft'
                                ? 'Bản nháp'
                                : product?.status === 'active'
                                  ? 'Hoạt động'
                                  : 'Không hoạt dộng'
                            }
                            color='primary'
                            size='large'
                            sx={{ width: '127px', fontWeight: '800' }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 50 }}>
                        <TableCell
                          variant='head'
                          sx={{ fontWeight: 500, fontSize: '16px' }}
                        >
                          Ngày tạo
                        </TableCell>
                        <TableCell sx={{ fontSize: '16px' }}>
                          {formatDate(product.createdAt)}
                        </TableCell>
                      </TableRow>

                      <TableRow sx={{ height: 50 }}>
                        <TableCell
                          variant='head'
                          sx={{ fontWeight: 500, fontSize: '16px' }}
                        >
                          Ngày cập nhật
                        </TableCell>
                        <TableCell sx={{ fontSize: '16px' }}>
                          {formatDate(product.updatedAt)}
                        </TableCell>
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
                className='content-selectable'
                sx={{
                  width: '100%',
                  mt: 2,
                  '& img': {
                    width: '100% !important',
                    height: '700px !important',
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
          </TabPanel>

          {/*<TabPanel value='2'>*/}
          {/*  <Typography variant='h6' gutterBottom>*/}
          {/*    Danh sách màu sắc của sản phẩm:{' '}*/}
          {/*    <strong>*/}
          {/*      {productName*/}
          {/*        .split(' ')*/}
          {/*        .map(*/}
          {/*          (word) =>*/}
          {/*            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()*/}
          {/*        )*/}
          {/*        .join(' ') || 'Không có tên'}*/}
          {/*    </strong>*/}
          {/*  </Typography>*/}
          {/*  <Table size='small' sx={{ tableLayout: 'fixed', width: '100%' }}>*/}
          {/*    <TableHead>*/}
          {/*      <TableRow>*/}
          {/*        <TableCell*/}
          {/*          sx={{*/}
          {/*            ...StyleAdmin.TableColumnSTT,*/}
          {/*            fontWeight: 700,*/}
          {/*            width: 54*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          STT*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ fontWeight: 700, width: 100 }}>*/}
          {/*          Ảnh*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ fontWeight: 700 }}>*/}
          {/*          Tên màu*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ width: 200, fontWeight: 700 }}>*/}
          {/*          Ngày tạo*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ width: 200, fontWeight: 700 }}>*/}
          {/*          Ngày cập nhật*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ width: 150, fontWeight: 700 }}>*/}
          {/*          Trạng thái*/}
          {/*        </TableCell>*/}
          {/*        <TableCell*/}
          {/*          align='left'*/}
          {/*          sx={{ width: 150, maxWidth: 150, fontWeight: 700 }}*/}
          {/*        >*/}
          {/*          Thao tác*/}
          {/*        </TableCell>*/}
          {/*      </TableRow>*/}
          {/*    </TableHead>*/}
          {/*    <TableBody>*/}
          {/*      {filteredColors.length === 0 ? (*/}
          {/*        <TableNoneData*/}
          {/*          col={6}*/}
          {/*          message='Không có dữ liệu màu sắc của sản phẩm.'*/}
          {/*        />*/}
          {/*      ) : (*/}
          {/*        filteredColors.map((color, index) => (*/}
          {/*          <TableRow key={color._id}>*/}
          {/*            <TableCell sx={StyleAdmin.TableColumnSTT}>*/}
          {/*              {index + 1}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              sx={{*/}
          {/*                ...styles.cellPadding,*/}
          {/*                ...styles.cellPaddingColor,*/}
          {/*                display: 'flex',*/}
          {/*                alignItems: 'center',*/}
          {/*                height: 53.5,*/}
          {/*                minHeight: 53.5,*/}
          {/*                maxHeight: 53.5*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              <Box*/}
          {/*                component='img'*/}
          {/*                src={optimizeCloudinaryUrl(color.image)}*/}
          {/*                alt={color.name}*/}
          {/*                sx={{*/}
          {/*                  width: 40,*/}
          {/*                  height: 40,*/}
          {/*                  objectFit: 'cover',*/}
          {/*                  borderRadius: '4px',*/}
          {/*                  border: '1px solid #ccc'*/}
          {/*                }}*/}
          {/*              />*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              sx={{*/}
          {/*                textAlign: 'left',*/}
          {/*                ...styles.cellPadding,*/}
          {/*                ...styles.cellPaddingColor,*/}
          {/*                maxWidth: 150,*/}
          {/*                overflow: 'hidden',*/}
          {/*                textOverflow: 'ellipsis',*/}
          {/*                whiteSpace: 'nowrap'*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              {color?.name}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              sx={{*/}
          {/*                ...styles.cellPadding,*/}
          {/*                ...styles.cellPaddingColor*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              {formatDate(colorCreatedAt)}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              sx={{*/}
          {/*                ...styles.cellPadding,*/}
          {/*                ...styles.cellPaddingColor*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              {formatDate(colorUpdatedAt)}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              sx={{*/}
          {/*                ...styles.cellPadding,*/}
          {/*                ...styles.cellPaddingColor*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              <Chip*/}
          {/*                label={color.isActive ? 'Đang bán' : 'Ngừng bán'}*/}
          {/*                color={color.destroy ? 'error' : 'success'}*/}
          {/*                size='large'*/}
          {/*                sx={{ width: '120px', fontWeight: '800' }}*/}
          {/*              />*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              align='center'*/}
          {/*              sx={{*/}
          {/*                maxWidth: 150,*/}
          {/*                ...styles.cellPadding,*/}
          {/*                ...styles.cellPaddingColor*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              <Stack*/}
          {/*                direction='row'*/}
          {/*                spacing={1}*/}
          {/*                sx={styles.groupIcon}*/}
          {/*              >*/}
          {/*                <Tooltip title='Xem'>*/}
          {/*                  <IconButton size='small'>*/}
          {/*                    <RemoveRedEyeIcon color='primary' />*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*                <Tooltip title='Sửa'>*/}
          {/*                  <IconButton size='small'>*/}
          {/*                    <BorderColorIcon color='warning' />*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*                <Tooltip title='Xoá'>*/}
          {/*                  <IconButton size='small'>*/}
          {/*                    <DeleteForeverIcon color='error' />*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*              </Stack>*/}
          {/*            </TableCell>*/}
          {/*          </TableRow>*/}
          {/*        ))*/}
          {/*      )}*/}
          {/*    </TableBody>*/}
          {/*  </Table>*/}
          {/*</TabPanel>*/}

          {/*<TabPanel value='3'>*/}
          {/*  <Typography variant='h6' gutterBottom>*/}
          {/*    Danh sách kích thước của sản phẩm:{' '}*/}
          {/*    <strong>*/}
          {/*      {productName*/}
          {/*        .split(' ')*/}
          {/*        .map(*/}
          {/*          (word) =>*/}
          {/*            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()*/}
          {/*        )*/}
          {/*        .join(' ') || 'Không có tên'}*/}
          {/*    </strong>*/}
          {/*  </Typography>*/}
          {/*  <Table size='small' sx={{ tableLayout: 'fixed', width: '100%' }}>*/}
          {/*    <TableHead>*/}
          {/*      <TableRow>*/}
          {/*        <TableCell*/}
          {/*          sx={{*/}
          {/*            ...StyleAdmin.TableColumnSTT,*/}
          {/*            fontWeight: 700,*/}
          {/*            width: 54*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          STT*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ fontWeight: 700 }}>*/}
          {/*          Tên kích thước*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ fontWeight: 700, width: 200 }}>*/}
          {/*          Ngày tạo*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ fontWeight: 700, width: 200 }}>*/}
          {/*          Ngày cập nhật*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ fontWeight: 700, width: 150 }}>*/}
          {/*          Trạng thái*/}
          {/*        </TableCell>*/}
          {/*        <TableCell align='left' sx={{ fontWeight: 700, width: 150 }}>*/}
          {/*          Thao tác*/}
          {/*        </TableCell>*/}
          {/*      </TableRow>*/}
          {/*    </TableHead>*/}
          {/*    <TableBody>*/}
          {/*      {filteredSizes.length === 0 ? (*/}
          {/*        <TableNoneData*/}
          {/*          col={5}*/}
          {/*          message='Không có dữ liệu kích thước của sản phẩm.'*/}
          {/*        />*/}
          {/*      ) : (*/}
          {/*        filteredSizes.map((size, index) => (*/}
          {/*          <TableRow key={size._id}>*/}
          {/*            <TableCell sx={StyleAdmin.TableColumnSTT}>*/}
          {/*              {index + 1}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              sx={{*/}
          {/*                textAlign: 'left',*/}
          {/*                ...styles.cellPadding,*/}
          {/*                maxWidth: 150,*/}
          {/*                overflow: 'hidden',*/}
          {/*                textOverflow: 'ellipsis',*/}
          {/*                whiteSpace: 'nowrap'*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              {size?.name}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell sx={styles.cellPadding}>*/}
          {/*              {formatDate(sizeCreatedAt)}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell sx={styles.cellPadding}>*/}
          {/*              {formatDate(sizeUpdatedAt)}*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              sx={{*/}
          {/*                ...styles.cellPadding,*/}
          {/*                ...styles.cellPaddingColor*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              <Chip*/}
          {/*                label={size?.isActive ? 'Đang bán' : 'Ngừng bán'}*/}
          {/*                color={size?.destroy ? 'error' : 'success'}*/}
          {/*                size='large'*/}
          {/*                sx={{ width: '120px', fontWeight: '800' }}*/}
          {/*              />*/}
          {/*            </TableCell>*/}
          {/*            <TableCell*/}
          {/*              align='center'*/}
          {/*              sx={{ maxWidth: 150, ...styles.cellPadding }}*/}
          {/*            >*/}
          {/*              <Stack*/}
          {/*                direction='row'*/}
          {/*                spacing={1}*/}
          {/*                sx={styles.groupIcon}*/}
          {/*              >*/}
          {/*                <Tooltip title='Xem'>*/}
          {/*                  <IconButton size='small'>*/}
          {/*                    <RemoveRedEyeIcon color='primary' />*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*                <Tooltip title='Sửa'>*/}
          {/*                  <IconButton size='small'>*/}
          {/*                    <BorderColorIcon color='warning' />*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*                <Tooltip title='Xoá'>*/}
          {/*                  <IconButton size='small'>*/}
          {/*                    <DeleteForeverIcon color='error' />*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*              </Stack>*/}
          {/*            </TableCell>*/}
          {/*          </TableRow>*/}
          {/*        ))*/}
          {/*      )}*/}
          {/*    </TableBody>*/}
          {/*  </Table>*/}
          {/*</TabPanel>*/}
        </TabContext>
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

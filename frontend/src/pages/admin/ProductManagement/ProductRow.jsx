import React, { useState } from 'react'
import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import ProductImageModal from './modal/ProductImageModal'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import Tooltip from '@mui/material/Tooltip'
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
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle'
  }
}

const ProductRow = ({ product, index, columns, onAction }) => {
  const [openImage, setOpenImage] = useState(false)

  const handleImageClick = () => setOpenImage(true)
  const handleClose = () => setOpenImage(false)

  return (
    <>
      <TableRow hover>
        {columns.map(({ id, align }) => {
          if (id === 'image') {
            return (
              <TableCell
                key={id}
                align='center'
                sx={{
                  ...styles.cellPadding,
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  height: 50,
                  minHeight: 55,
                  maxHeight: 55
                }}
              >
                {product.image?.[0] ? (
                  <img
                    src={optimizeCloudinaryUrl(product.image[0])}
                    alt='Ảnh sản phẩm'
                    onClick={handleImageClick}
                    style={{
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #ccc'
                    }}
                  />
                ) : (
                  <IconButton sx={{ width: 40, height: 40 }}>
                    <ImageNotSupportedIcon sx={{ width: 40, height: 40 }} />
                  </IconButton>
                )}
              </TableCell>
            )
          }

          if (id === 'name') {
            if (id === 'name') {
              const name = product.name || 'Không có tên'
              name
                .split(' ')
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(' ')
            }
            return (
              <TableCell
                key={id}
                align={align}
                sx={{
                  ...styles.cellPadding,
                  maxWidth: 200,
                  display: 'table-cell'
                }}
              >
                {product.name ||
                  (product.name === 'name' ? 'Không có tên' : 'Không có mô tả')}
              </TableCell>
            )
          }
          if (id === 'category') {
            const CategoryName = product.categoryId?.name || 'Không có danh mục'
            return (
              <TableCell key={id} align={align} sx={styles.cellPadding}>
                {CategoryName.split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ')}
              </TableCell>
            )
          }

          if (id === 'status') {
            return (
              <TableCell key={id} align={align} sx={styles.cellPadding}>
                <Chip
                  label={product.destroy ? 'Ngừng bán' : 'Đang bán'}
                  color={product.destroy ? 'error' : 'success'}
                  size='large'
                  sx={{ width: '120px', fontWeight: '800' }}
                />
              </TableCell>
            )
          }

          if (id === 'description') {
            if (!product.description) {
              return (
                <TableCell key={id} align={align} sx={styles.cellPadding}>
                  Không có mô tả
                </TableCell>
              )
            }
            return (
              <TableCell key={id} align={align} sx={styles.cellPadding}>
                <span
                  style={{ cursor: 'pointer', color: '#1976d2' }}
                  onClick={() => onAction('viewDesc', product)}
                >
                  Xem mô tả
                </span>
              </TableCell>
            )
          }
          if (id === 'importPrice') {
            return (
              <TableCell
                key={id}
                align={align}
                sx={{ ...styles.cellPadding, pr: 7 }}
              >
                {product.importPrice?.toLocaleString('vi-VN') + 'đ'}
              </TableCell>
            )
          }

          if (id === 'exportPrice') {
            return (
              <TableCell key={id} align={align} sx={styles.cellPadding}>
                {product.exportPrice?.toLocaleString('vi-VN') + 'đ'}
              </TableCell>
            )
          }

          if (id === 'action') {
            return (
              <TableCell key={id} align={align} sx={styles.cellPadding}>
                <Stack direction='row' sx={styles.groupIcon}>
                  <Tooltip title='Xem'>
                    <IconButton
                      onClick={() => onAction('view', product)}
                      size='small'
                    >
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Sửa'>
                    <IconButton
                      onClick={() => onAction('edit', product)}
                      size='small'
                    >
                      <BorderColorIcon color='warning' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Xoá'>
                    <IconButton
                      onClick={() => onAction('delete', product)}
                      size='small'
                    >
                      <DeleteForeverIcon color='error' />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            )
          }

          let value = '—'
          if (id === 'index') value = index
          else if (id === 'productCode') value = product.productCode || '—'
          else if (id === 'name') value = product.name || '—'
          else if (id === 'category') value = product.categoryId?.name || '—'

          return (
            <TableCell
              key={id}
              align={align}
              sx={styles.cellPadding}
              title={value}
            >
              {value}
            </TableCell>
          )
        })}
      </TableRow>

      <ProductImageModal
        open={openImage}
        onClose={handleClose}
        imageSrc={product.image?.[0]}
        productName={product.name}
      />
    </>
  )
}

export default ProductRow

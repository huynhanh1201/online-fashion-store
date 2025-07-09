import React, { useState } from 'react'
import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import ProductImageModal from './modal/ProductImageModal'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from 'react-router-dom'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
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
    verticalAlign: 'middle',
    background: '#fff'
  }
}

const ProductRow = ({
  product,
  index,
  columns,
  onAction,
  permissions = {},
  filters
}) => {
  const [openImage, setOpenImage] = useState(false)
  const navigate = useNavigate()
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
          if (id === 'productCode') {
            return (
              <TableCell
                key={id}
                align={align}
                onClick={
                  permissions.canView ? () => onAction('view', product) : null
                }
                sx={{
                  ...styles.cellPadding,
                  maxWidth: 200,
                  display: 'table-cell',
                  cursor: permissions.canView ? 'pointer' : 'default'
                }}
              >
                {product.productCode || 'Không có mã sản phẩm'}
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
                onClick={
                  permissions.canView ? () => onAction('view', product) : null
                }
                sx={{
                  ...styles.cellPadding,
                  maxWidth: 200,
                  display: 'table-cell',
                  cursor: permissions.canView ? 'pointer' : 'default'
                }}
              >
                {product.name ||
                  (product.name === 'name' ? 'Không có tên' : 'Không có mô tả')}
              </TableCell>
            )
          }
          if (id === 'category') {
            const CategoryName = product.categoryId?.name || 'Không có danh mục'
            const formattedName = CategoryName.split(' ')
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(' ')

            return (
              <TableCell
                key={id}
                align={align}
                title={'Xem danh mục'}
                sx={{
                  ...styles.cellPadding,
                  cursor: product.categoryId ? 'pointer' : 'default',
                  // color: product.categoryId ? '#1976d2' : 'inherit',
                  '&:hover': product.categoryId
                    ? { textDecoration: 'none' }
                    : undefined
                }}
                onClick={() => {
                  if (product.categoryId) {
                    navigate(
                      `/admin/categorie-management?search=${encodeURIComponent(formattedName)}`
                    )
                  }
                }}
              >
                {formattedName}
              </TableCell>
            )
          }

          if (id === 'moreVariants') {
            return (
              <TableCell
                key={id}
                align={align}
                sx={{
                  ...styles.cellPadding,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (product._id) {
                    navigate(
                      `/admin/variant-management?productId=${encodeURIComponent(product._id)}`
                    )
                  }
                }}
              >
                Xem các biến thể của sản phẩm
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
                {product.importPrice?.toLocaleString('vi-VN') + '₫'}
              </TableCell>
            )
          }

          if (id === 'exportPrice') {
            return (
              <TableCell key={id} align={align} sx={styles.cellPadding}>
                {product.exportPrice?.toLocaleString('vi-VN') + '₫'}
              </TableCell>
            )
          }

          if (id === 'action') {
            return (
              <TableCell key={id} align={align} sx={styles.cellPadding}>
                <Stack direction='row' sx={styles.groupIcon}>
                  {permissions.canView && (
                    <Tooltip title='Xem'>
                      <IconButton
                        onClick={() => onAction('view', product)}
                        size='small'
                      >
                        <RemoveRedEyeIcon color='primary' />
                      </IconButton>
                    </Tooltip>
                  )}
                  {filters.destroy === 'true' ? (
                    permissions.canRestore && (
                      <Tooltip title='Khôi phục'>
                        <IconButton
                          onClick={() => onAction('restore', product)}
                          size='small'
                        >
                          <RestartAltIcon color='success' />
                        </IconButton>
                      </Tooltip>
                    )
                  ) : (
                    <>
                      {permissions.canEdit && (
                        <Tooltip title='Sửa'>
                          <IconButton
                            onClick={() => onAction('edit', product)}
                            size='small'
                          >
                            <BorderColorIcon color='warning' />
                          </IconButton>
                        </Tooltip>
                      )}
                      {permissions.canDelete && (
                        <Tooltip title='Xoá'>
                          <IconButton
                            onClick={() => onAction('delete', product)}
                            size='small'
                          >
                            <DeleteForeverIcon color='error' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
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

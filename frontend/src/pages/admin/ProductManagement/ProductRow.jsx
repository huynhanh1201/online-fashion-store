import React, { useState } from 'react'
import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ProductImageModal from './modal/ProductImageModal'
const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    width: '130px'
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
          let value

          switch (id) {
            case 'index':
              value = index
              break
            case 'image':
              value = (
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  style={{
                    width: 50,
                    height: 50,
                    cursor: 'pointer',
                    objectFit: 'cover'
                  }}
                  onClick={handleImageClick}
                />
              )
              break
            case 'productCode':
              value = product.productCode || '—'
              break
            case 'name':
              value = product.name
              break
            case 'exportPrice':
              value = `${product.exportPrice.toLocaleString('vi-VN')}đ`
              break
            case 'description':
              value = (
                <span
                  style={{ cursor: 'pointer', color: '#1976d2' }}
                  onClick={() => onAction('viewDesc', product)}
                >
                  Xem mô tả
                </span>
              )
              break
            case 'category':
              value = product.categoryId?.name || '—'
              break
            case 'status':
              value = (
                <Chip
                  label={product.destroy ? 'Ngừng bán' : 'Đang bán'}
                  color={product.destroy ? 'error' : 'success'}
                  size='large'
                  sx={{ width: '120px', fontWeight: '800' }}
                />
              )
              break
            case 'action':
              value = (
                <Stack direction='row' sx={styles.groupIcon}>
                  <IconButton
                    onClick={() => onAction('view', product)}
                    size='small'
                  >
                    <RemoveRedEyeIcon color='primary' />
                  </IconButton>
                  <IconButton
                    onClick={() => onAction('edit', product)}
                    size='small'
                  >
                    <BorderColorIcon color='warning' />
                  </IconButton>
                  <IconButton
                    onClick={() => onAction('delete', product)}
                    size='small'
                  >
                    <DeleteForeverIcon color='error' />
                  </IconButton>
                </Stack>
              )
              break
            default:
              value = '—'
          }

          return (
            <TableCell key={id} align={align || 'left'}>
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

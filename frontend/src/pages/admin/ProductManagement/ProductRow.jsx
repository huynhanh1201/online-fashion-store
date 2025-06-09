// import React, { useState } from 'react'
// import CloseIcon from '@mui/icons-material/Close'
// import TableCell from '@mui/material/TableCell'
// import Stack from '@mui/material/Stack'
// import IconButton from '@mui/material/IconButton'
// import Box from '@mui/material/Box'
// import Chip from '@mui/material/Chip'
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow
// } from '~/assets/StyleAdmin.jsx'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
// import ProductImageModal from './modal/ProductImageModal'
//
// const styles = {
//   groupIcon: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%'
//   },
//   iconStyle: {
//     cursor: 'pointer'
//   }
// }
//
// const ProductRow = ({ index, product, handleOpenModal }) => {
//   const [openImage, setOpenImage] = useState(false)
//
//   const handleImageClick = () => {
//     setOpenImage(true)
//   }
//
//   const handleClose = () => {
//     setOpenImage(false)
//   }
//   return (
//     <>
//       <StyledTableRow>
//         <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
//           {index}
//         </StyledTableCell>
//         <StyledTableCell>
//           <img
//             src={product.image?.[0]}
//             alt={product.name}
//             style={{
//               width: 50,
//               height: 50,
//               cursor: 'pointer',
//               objectFit: 'cover'
//             }}
//             onClick={handleImageClick}
//           />
//         </StyledTableCell>
//         <StyledTableCell
//           sx={{
//             maxWidth: '300px',
//             whiteSpace: 'nowrap',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis'
//           }}
//         >
//           {product.name}
//         </StyledTableCell>
//         <StyledTableCell>
//           {product.exportPrice.toLocaleString()}
//         </StyledTableCell>
//         <StyledTableCell>{product.quantity}</StyledTableCell>
//         <StyledTableCell
//           sx={{
//             maxWidth: '150px',
//             whiteSpace: 'nowrap',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis'
//           }}
//           onClick={() => handleOpenModal('viewDesc', product)}
//           sx={{ cursor: 'pointer' }}
//         >
//           <p>xem mô tả</p>
//         </StyledTableCell>
//         <StyledTableCell
//           sx={{
//             maxWidth: '250px',
//             whiteSpace: 'nowrap',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis'
//           }}
//         >
//           {product.categoryId.name}
//         </StyledTableCell>
//         <StyledTableCell>
//           <Chip
//             label={product.destroy ? 'Ngừng bán' : 'Đang bán'}
//             color={product.destroy ? 'error' : 'success'}
//             size='small'
//           />
//         </StyledTableCell>
//         <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
//           <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//             <IconButton
//               onClick={() => handleOpenModal('view', product)}
//               size='small'
//             >
//               <RemoveRedEyeIcon color='primary' />
//             </IconButton>
//             <IconButton
//               onClick={() => handleOpenModal('edit', product)}
//               size='small'
//             >
//               <BorderColorIcon color='warning' />
//             </IconButton>
//             <IconButton
//               onClick={() => handleOpenModal('delete', product)}
//               size='small'
//             >
//               <DeleteForeverIcon color='error' />
//             </IconButton>
//           </Stack>
//         </StyledTableCell>
//       </StyledTableRow>
//
//       {/* ✅ Modal hiển thị ảnh đã tách riêng */}
//       <ProductImageModal
//         open={openImage}
//         onClose={handleClose}
//         imageSrc={product.image?.[0]}
//         productName={product.name}
//       />
//     </>
//   )
// }
//
// export default ProductRow

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
    width: '100%'
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
            case 'name':
              value = product.name
              break
            case 'exportPrice':
              value = `${product.exportPrice.toLocaleString()}đ`
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
                <Stack direction='row' spacing={1} sx={styles.groupIcon}>
                  <IconButton
                    onClick={() => onAction('view', product)}
                    size='small'
                  >
                    <RemoveRedEyeIcon color='primary' />
                  </IconButton>
                  <IconButton
                    onClick={() => onAction('edit', product)}
                    size='small'
                    sx={{ ml: '0 !important' }}
                  >
                    <BorderColorIcon color='warning' />
                  </IconButton>
                  <IconButton
                    onClick={() => onAction('delete', product)}
                    size='small'
                    sx={{ ml: '0 !important' }}
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
            <TableCell
              key={id}
              align={align || 'left'}
              sx={
                id === 'action'
                  ? { width: 130, maxWidth: 130, minWidth: 130 }
                  : {}
              }
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

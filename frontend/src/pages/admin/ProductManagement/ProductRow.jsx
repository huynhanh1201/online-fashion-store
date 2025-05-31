import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import TableCell from '@mui/material/TableCell'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import PaletteIcon from '@mui/icons-material/Palette'
import StraightenIcon from '@mui/icons-material/Straighten'
import ProductImageModal from './modal/ProductImageModal'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  iconStyle: {
    cursor: 'pointer'
  }
}

const ProductRow = ({ index, product, handleOpenModal }) => {
  const [openImage, setOpenImage] = useState(false)

  const handleImageClick = () => {
    setOpenImage(true)
  }

  const handleClose = () => {
    setOpenImage(false)
  }
  return (
    <>
      <StyledTableRow>
        <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
          {index}
        </StyledTableCell>
        <StyledTableCell>
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
        </StyledTableCell>
        <StyledTableCell
          sx={{
            maxWidth: '300px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.name}
        </StyledTableCell>
        <StyledTableCell>
          {product.exportPrice.toLocaleString()}
        </StyledTableCell>
        <StyledTableCell>{product.quantity}</StyledTableCell>
        <StyledTableCell
          sx={{
            maxWidth: '130px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.description}
        </StyledTableCell>
        <StyledTableCell
          sx={{
            maxWidth: '250px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.origin}
        </StyledTableCell>
        <StyledTableCell
          sx={{
            maxWidth: '100px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.categoryId.name}
        </StyledTableCell>
        <StyledTableCell>
          <Chip
            label={product.destroy ? 'Ngừng bán' : 'Đang bán'}
            color={product.destroy ? 'error' : 'success'}
            size='small'
          />
        </StyledTableCell>
        <StyledTableCell sx={{ maxWidth: '220px', width: '220px' }}>
          <Stack direction='row' spacing={1} sx={styles.groupIcon}>
            <IconButton
              onClick={() => handleOpenModal('view', product)}
              size='small'
            >
              <RemoveRedEyeIcon color='primary' />
            </IconButton>
            <IconButton
              onClick={() => handleOpenModal('edit', product)}
              size='small'
            >
              <BorderColorIcon color='warning' />
            </IconButton>
            <IconButton
              onClick={() => handleOpenModal('addColor', product)}
              size='small'
            >
              <PaletteIcon color='primary' />
            </IconButton>
            <IconButton
              onClick={() => handleOpenModal('addSize', product)}
              size='small'
            >
              <StraightenIcon color='primary' />
            </IconButton>
            <IconButton
              onClick={() => handleOpenModal('delete', product)}
              size='small'
            >
              <DeleteForeverIcon color='error' />
            </IconButton>
          </Stack>
        </StyledTableCell>
      </StyledTableRow>

      {/* ✅ Modal hiển thị ảnh đã tách riêng */}
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

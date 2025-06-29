import React, { useState } from 'react'
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container
} from '@mui/material'
import StraightenIcon from '@mui/icons-material/Straighten'
import CloseIcon from '@mui/icons-material/Close'

const SizeGuide = () => {
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('ao-hoodie')

  const productTypes = [
    {
      value: 'ao-thun',
      label: 'Áo thun',
      image:
        'https://routine-db.s3.amazonaws.com/prod/media/bang-size-ao-thun-nam-form-oversize-png-fohn.webp'
    },
    {
      value: 'ao-hoodie',
      label: 'Áo Hoodie',
      image:
        'https://5sfashion.vn/storage/upload/images/ckeditor/obS180XsdbMMyBPaonJC3zDbCyLodkyA8Itb98xF.jpg'
    },
    {
      value: 'quan-jean',
      label: 'Quần jean',
      image:
        'https://www.uniqlo.com/vn/vi/news/topics/2024102703/img/59T_241028KavPn5.png'
    },
    {
      value: 'ao-so-mi',
      label: 'Áo sơ mi',
      image:
        'https://bizweb.dktcdn.net/100/360/581/files/bang-size-ao-so-mi-cho-nam-theo-so.jpg?v=1700208115125'
    }
  ]

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          gap: 0.5,
          width: 'fit-content',
          transition: 'all 0.2s ease',
          '&:hover': {
            textDecoration: 'underline',
            transform: 'translateY(-1px)'
          }
        }}
      >
        <StraightenIcon fontSize='small' sx={{ color: 'text.secondary' }} />
        <Typography
          variant='body2'
          sx={{
            fontSize: 14,
            textDecoration: 'underline',
            color: 'primary.main'
          }}
        >
          Hướng dẫn chọn size
        </Typography>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 7,
            maxHeight: '70vh',
            bgcolor: 'white'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 0,
            px: 2
          }}
        >
          <Box />
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 2, py: 1 }}>
          {/* Dropdown chọn loại sản phẩm */}
          <FormControl sx={{ mb: 3, minWidth: 200 }}>
            <InputLabel>Loại sản phẩm</InputLabel>
            <Select
              value={selectedType}
              label='Loại sản phẩm'
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ borderRadius: 2 }}
              renderValue={(selected) => {
                const selectedProduct = productTypes.find(
                  (type) => type.value === selected
                )
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{selectedProduct.label}</Typography>
                  </Box>
                )
              }}
            >
              {productTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{type.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Bảng size */}
          <Box
            sx={{
              border: '2px solid black',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'white'
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 2,
                bgcolor: 'white'
              }}
            >
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 1 }}>
                BẢNG SIZE
              </Typography>
            </Box>

            <Container>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <img
                  src={
                    productTypes.find((type) => type.value === selectedType)
                      ?.image
                  }
                  alt={
                    productTypes.find((type) => type.value === selectedType)
                      ?.label
                  }
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 8,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            </Container>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SizeGuide

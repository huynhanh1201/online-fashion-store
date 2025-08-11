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
  const [selectedType, setSelectedType] = useState('ao-thun')

  const productTypes = [
    {
      value: 'ao-thun',
      label: 'Áo thun',
      image:
        'https://product.hstatic.net/1000360022/product/bang_size_icon_summer_daze_atid0609_362b590b2bcf4c178383a50da92e5037_1024x1024.png'
    },
    {
      value: 'ao-so-mi',
      label: 'Áo sơ mi',
      image:
        'https://product.hstatic.net/1000360022/product/bang_size_icon_summer_daze_smid0320_2979ac6904ac4f448c897f68041d657c_1024x1024.png'
    },
    {
      value: 'quan-short',
      label: 'Quần short',
      image:
        'https://file.hstatic.net/1000360022/file/bang-size-quan-short-form-smart-fit_f4b77b8408d64694b970558b3c008149.jpg'
    },
    {
      value: 'quan-jean',
      label: 'Quần jean',
      image:
        'https://down-vn.img.susercontent.com/file/vn-11134201-7ras8-mamtcudrjetd8d.webp'
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
            maxHeight: '95vh',
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
          <FormControl sx={{ mb: 3, minWidth: 200, mt: 1 }}>
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

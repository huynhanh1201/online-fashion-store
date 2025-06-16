import React, { useState } from 'react'
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
  Paper,
  Container
} from '@mui/material'
import StraightenIcon from '@mui/icons-material/Straighten'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const SizeGuide = () => {
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('ao-hoodie')
  const [selectedWeight, setSelectedWeight] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  // Dữ liệu loại sản phẩm
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

  // Dữ liệu size chi tiết cho áo hoodie
  const sizeData = {
    'ao-hoodie': {
      name: 'ÁO HOODIE',
      form: 'FORM SLIMFIT',
      sizes: [
        {
          size: 'S',
          weight: '53kg - 56kg',
          chest: '43.5',
          sleeve: '50',
          length: '70'
        },
        {
          size: 'M',
          weight: '60kg - 68kg',
          chest: '45',
          sleeve: '52',
          length: '72'
        },
        {
          size: 'L',
          weight: '68kg - 78kg',
          chest: '46.5',
          sleeve: '54',
          length: '74'
        },
        {
          size: 'XL',
          weight: '78kg - 85kg',
          chest: '48',
          sleeve: '56',
          length: '76'
        }
      ]
    }
  }

  // Dữ liệu cân nặng
  const weightRanges = [
    { value: 'under-50', label: 'Dưới 50kg', sizes: ['S', 'M'] },
    { value: '50-60', label: '50kg - 60kg', sizes: ['M', 'L'] },
    { value: '60-70', label: '60kg - 70kg', sizes: ['L', 'XL'] },
    { value: '70-80', label: '70kg - 80kg', sizes: ['XL', 'XXL'] },
    {
      value: 'over-80',
      label: 'Trên 80kg',
      sizes: ['XXXL']
    }
  ]

  const handleClose = () => {
    setOpen(false)
    setSelectedWeight('')
    setActiveTab(0)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const getSelectedProduct = () => {
    return productTypes.find((type) => type.value === selectedType)
  }

  const getSelectedWeightRange = () => {
    return weightRanges.find((weight) => weight.value === selectedWeight)
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
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  flex: 1,
                  maxWidth: 'none'
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 1
                }
              }}
            >
              <Tab
                label='Hướng dẫn chọn size'
                sx={{
                  bgcolor: activeTab === 0 ? 'rgba(0,0,0,0.05)' : 'transparent',
                  borderRadius: '8px 8px 0 0'
                }}
              />
              <Tab
                label='Bảng size'
                sx={{
                  bgcolor: activeTab === 1 ? 'rgba(0,0,0,0.05)' : 'transparent',
                  borderRadius: '8px 8px 0 0'
                }}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              {/* Chọn loại sản phẩm */}
              <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
                  >
                    1. Chọn loại sản phẩm
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Loại sản phẩm</InputLabel>
                    <Select
                      value={selectedType}
                      label='Loại sản phẩm'
                      onChange={(e) => setSelectedType(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      {productTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Chọn cân nặng */}
              <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
                  >
                    2. Chọn cân nặng của bạn
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Cân nặng</InputLabel>
                    <Select
                      value={selectedWeight}
                      label='Cân nặng'
                      onChange={(e) => setSelectedWeight(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      {weightRanges.map((weight) => (
                        <MenuItem key={weight.value} value={weight.value}>
                          {weight.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Gợi ý size */}
              {selectedWeight && (
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Gợi ý size cho bạn
                      </Typography>
                    </Box>
                    <Typography variant='body1' sx={{ mb: 2, lineHeight: 1.6 }}>
                      Dựa trên cân nặng{' '}
                      <strong>{getSelectedWeightRange()?.label}</strong> và loại
                      sản phẩm <strong>{getSelectedProduct()?.label}</strong>,
                      chúng tôi gợi ý:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {getSelectedWeightRange()?.sizes.map((size) => (
                        <Chip
                          key={size}
                          label={`Size ${size}`}
                          sx={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '14px',
                            padding: '16px 12px'
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant='body2'
                      sx={{ mt: 2, opacity: 0.9, fontStyle: 'italic' }}
                    >
                      💡 Lưu ý: Đây chỉ là gợi ý, bạn nên tham khảo bảng size
                      chi tiết để chọn size chính xác nhất.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
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
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography>{selectedProduct.label}</Typography>
                      </Box>
                    )
                  }}
                >
                  {productTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
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
                {/* Header */}
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
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SizeGuide

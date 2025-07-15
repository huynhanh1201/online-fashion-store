import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Paper
} from '@mui/material'

// Dữ liệu mẫu
const productOptions = ['Áo Thun Basic', 'Quần Jeans', 'Giày Sneaker']

const colorDetails = {
  'Áo Thun Basic': [
    {
      name: 'Đỏ',
      color: '#FF4C5B',
      sizes: { S: 12, M: 8, L: 15 },
      location: { HN: 20, HCM: 15 }
    },
    {
      name: 'Xanh',
      color: '#3168FF',
      sizes: { S: 18, M: 22, L: 10 },
      location: { HN: 25, HCM: 25 }
    },
    {
      name: 'Đen',
      color: '#2A2E33',
      sizes: { S: 30, M: 25, L: 20 },
      location: { HN: 40, HCM: 35 }
    },
    {
      name: 'Trắng',
      color: '#F4F7FA',
      sizes: { S: 14, M: 18, L: 12 },
      location: { HN: 22, HCM: 22 }
    }
  ]
}

export default function ProductColorDetail() {
  const [selectedProduct, setSelectedProduct] = useState('Áo Thun Basic')
  const colors = colorDetails[selectedProduct] || []

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          // background: '#FFF4ED',
          borderRadius: 2
          // p: 1.5
          // border: '2px solid #000'
        }}
      >
        <FormControl fullWidth variant='outlined'>
          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            sx={{
              fontWeight: 'bold',
              backgroundColor: 'transparent'
            }}
          >
            {productOptions.map((product) => (
              <MenuItem key={product} value={product}>
                {product}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {colors.map((color, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: '#fff'
              }}
            >
              <Box
                sx={{
                  mx: 'auto',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: color.color,
                  border: '2px solid #000',
                  mb: 1.5
                }}
              />
              <Typography fontWeight='bold'>{color.name}</Typography>
              <Typography variant='body2'>
                S: {color.sizes.S}, M: {color.sizes.M}, L: {color.sizes.L}
              </Typography>
              <Typography variant='body2'>
                HN: {color.location.HN}, HCM: {color.location.HCM}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

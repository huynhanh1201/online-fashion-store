import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Stack
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

// Dữ liệu mẫu
const lowStockList = [
  {
    sku: 'AO001-RED-S',
    name: 'Áo Thun Basic Đỏ Size S',
    quantity: 2,
    minQuantity: 10,
    status: 'low'
  },
  {
    sku: 'QU002-BLU-M',
    name: 'Quần Jeans Xanh Size M',
    quantity: 1,
    minQuantity: 15,
    status: 'low'
  },
  {
    sku: 'GI003-WHI-39',
    name: 'Giày Sneaker Trắng Size 39',
    quantity: 0,
    minQuantity: 5,
    status: 'out'
  }
]

export default function LowStockAlertCard() {
  return (
    <Stack spacing={2}>
      {lowStockList.map((item, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#fce4ec',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography fontWeight='bold' sx={{ color: '#333' }}>
              {item.sku} - {item.name}
            </Typography>
            <Typography color='text.secondary' fontSize={14}>
              {item.quantity === 0
                ? 'Hết hàng hoàn toàn'
                : `Còn lại: ${item.quantity} sản phẩm (Min: ${item.minQuantity})`}
            </Typography>
          </Box>
          <Button
            variant='contained'
            sx={{
              background: 'linear-gradient(to right, #5e35b1, #7e57c2)',
              borderRadius: 4,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: 13,
              px: 2
            }}
          >
            Tạo Phiếu Nhập
          </Button>
        </Box>
      ))}
    </Stack>
  )
}

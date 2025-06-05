import React from 'react'
import { Typography, Grid, Box, Stack } from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// Dữ liệu mẫu
const inventoryList = [
  {
    quantity: 20,
    importPrice: 100,
    exportPrice: 150
  },
  {
    quantity: 3,
    importPrice: 200,
    exportPrice: 250
  },
  {
    quantity: 10,
    importPrice: 150,
    exportPrice: 180
  }
]

export default function InventorySummaryCard() {
  const totalQuantity = inventoryList.reduce(
    (sum, item) => sum + item.quantity,
    0
  )
  const totalCostValue = inventoryList.reduce(
    (sum, item) => sum + item.quantity * item.importPrice,
    0
  )
  const estimatedProfit = inventoryList.reduce(
    (sum, item) => sum + (item.exportPrice - item.importPrice) * item.quantity,
    0
  )

  const summaryItems = [
    {
      label: 'Tổng số lượng tồn',
      value: `${Number(totalQuantity).toLocaleString('vi-VN')}`,
      icon: <InventoryIcon color='primary' />,
      color: '#4FC3F7'
    },
    {
      label: 'Tổng giá trị tồn kho',
      value: `${Number(totalCostValue).toLocaleString('vi-VN')}đ`,
      icon: <MonetizationOnIcon color='success' />,
      color: '#81C784'
    },
    {
      label: 'Tổng lợi nhuận ước tính',
      value: `${Number(estimatedProfit).toLocaleString('vi-VN')}đ`,
      icon: <AttachMoneyIcon color='warning' />,
      color: '#FFB74D'
    }
  ]

  return (
    <Grid container spacing={2}>
      {summaryItems.map((item, index) => (
        <Grid
          size={4}
          item
          xs={6}
          md={4}
          key={index}
          sx={{
            borderLeft: `5px solid ${item.color}`,
            backgroundColor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              height: '100px'
            }}
          >
            <Stack>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                {item.label}
              </Typography>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                {item.icon}
                {item.value}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

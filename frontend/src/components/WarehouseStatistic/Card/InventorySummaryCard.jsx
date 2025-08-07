import React from 'react'
import { Typography, Grid, Box, Stack } from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import WarningIcon from '@mui/icons-material/Warning'

export default function InventorySummaryCard({ data, loading }) {
  const totalStock = data?.reduce(
    (sum, item) => sum + (item.totalStock || 0),
    0
  )
  const totalValue = data?.reduce(
    (sum, item) => sum + (item.totalValue || 0),
    0
  )
  const estimatedProfit = data?.reduce(
    (sum, item) => sum + (item.estimatedProfit || 0),
    0
  )
  const lowStockCount = data?.reduce(
    (sum, item) => sum + (item.lowStockCount || 0),
    0
  )

  const summaryItems = [
    {
      label: 'Tổng số lượng tồn',
      value: `${Number(totalStock).toLocaleString('vi-VN')}`,
      icon: <InventoryIcon color='primary' fontSize='large' />,
      color: '#4FC3F7'
    },
    {
      label: 'Tổng giá trị tồn kho',
      value: `${Number(totalValue).toLocaleString('vi-VN')}₫`,
      icon: <MonetizationOnIcon color='success' fontSize='large' />,
      color: '#81C784'
    },
    {
      label: 'Tổng lợi nhuận ước tính',
      value: `${Number(estimatedProfit).toLocaleString('vi-VN')}₫`,
      icon: <AttachMoneyIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    },
    {
      label: 'Biến thể sắp hết hàng',
      value: `${Number(lowStockCount).toLocaleString('vi-VN')}`,
      icon: <WarningIcon color='error' fontSize='large' />,
      color: '#E57373'
    }
  ]

  return (
    <Grid container spacing={2}>
      {summaryItems.map((item, index) => (
        <Grid item size={6} xs={12} sm={6} md={4} lg={3} key={index}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              height: '100px',
              borderLeft: `10px solid ${item.color}`,
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}
          >
            <Stack>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                {item.label}
              </Typography>
              {/*{loading ? (*/}
              {/*  <Typography*/}
              {/*    variant='h5'*/}
              {/*    fontWeight='bold'*/}
              {/*    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}*/}
              {/*  >*/}
              {/*    Đang tải dữ liệu...*/}
              {/*  </Typography>*/}
              {/*) : (*/}
              {/*  <Typography*/}
              {/*    variant='h5'*/}
              {/*    fontWeight='bold'*/}
              {/*    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}*/}
              {/*  >*/}
              {/*    {item.icon}*/}
              {/*    {item.value}*/}
              {/*  </Typography>*/}
              {/*)}*/}
              <Typography
                variant='h5'
                fontWeight='bold'
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
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

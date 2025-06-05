import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Grid, Box, Stack } from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import WarningIcon from '@mui/icons-material/Warning'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import socket from '~/socket/index'
// Dữ liệu mẫu
const inventoryList = [
  {
    quantity: 20,
    minQuantity: 5,
    variantId: { sku: 'SP001', productId: 'P1' }
  },
  {
    quantity: 3,
    minQuantity: 5,
    variantId: { sku: 'SP002', productId: 'P2' }
  },
  {
    quantity: 10,
    minQuantity: 0,
    variantId: { sku: 'SP003', productId: 'P1' }
  }
]

export default function VariantSummaryCard() {
  // =================================================
  const [stats, setStats] = useState(null)

  useEffect(() => {
    socket.connect()

    socket.emit('subscribeInventoryStats') // v1/inventory

    socket.on('inventoryStatsUpdate', (data) => {
      console.log('📦 Realtime update:', data)
      setStats(data)
    })

    // Khi mất kết nối với server (đóng tab, F5, mạng yếu...), event này sẽ chạy.
    socket.on('disconnect', (data) => {
      console.log('Disconnect data: ', data)
    })

    // Gỡ bỏ listener khi component bị unmount (tránh memory leak).
    return () => {
      socket.off('inventoryStatsUpdate')
    }
  }, [])
  // =================================================

  const totalVariants = inventoryList.length
  const totalProducts = new Set(
    inventoryList.map((item) => item.variantId?.productId)
  ).size
  const lowStockVariants = inventoryList.filter(
    (item) => item.quantity <= item.minQuantity
  ).length

  const summaryItems = [
    {
      label: 'Tổng sản phẩm',
      value: `${Number(totalProducts).toLocaleString('vi-VN')}`,
      icon: <CategoryIcon color='primary' />,
      color: '#FF8282'
    },
    {
      label: 'Tổng biến thể',
      value: `${Number(totalVariants).toLocaleString('vi-VN')}`,
      icon: <InventoryIcon color='success' />,
      color: '#9FC87E'
    },
    {
      label: 'Biến thể sắp hết hàng',
      value: `${Number(lowStockVariants).toLocaleString('vi-VN')}`,
      icon: <WarningIcon color='error' />,
      color: '#657C6A'
    }
  ]

  return (
    <Grid container spacing={2}>
      {summaryItems.map((item, index) => (
        <Grid
          item
          size={4}
          xs={6}
          md={3}
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

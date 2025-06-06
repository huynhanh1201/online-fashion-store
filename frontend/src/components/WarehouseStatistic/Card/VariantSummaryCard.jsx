import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Grid, Box, Stack } from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import WarningIcon from '@mui/icons-material/Warning'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import socket from '~/socket/index'

export default function VariantSummaryCard() {
  // =======================TEST WEBSOCKET==========================
  const [stats, setStats] = useState(null)

  useEffect(() => {
    socket.connect()

    // socket.emit('subscribeInventoryStats')

    socket.on('products:update', (data) => {
      console.log('📦 Realtime update:', data)
      if (!data) {
        console.warn('⚠️ Không nhận được dữ liệu thống kê từ socket')
      }
      setStats(data)
    })

    socket.on('disconnect', (data) => {
      console.log('Disconnect data: ', data)
    })

    return () => {
      socket.off('products:update')
    }
  }, [])
  // Xử lý dữ liệu nếu đã nhận được từ socket
  const totalVariants =
    stats?.inventorySummary?.reduce((acc, item) => acc + item.totalStock, 0) ||
    0

  const totalProducts = stats?.inventorySummary?.length || 0

  const lowStockVariants =
    stats?.lowStockCount?.reduce((acc, item) => acc + item.lowStockCount, 0) ||
    0

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

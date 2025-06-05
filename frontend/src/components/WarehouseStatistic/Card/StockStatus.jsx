import React from 'react'
import {
  Grid,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Tooltip
} from '@mui/material'
// Dữ liệu mẫu
const inventoryByWarehouse = [
  {
    warehouseName: 'Kho Cần Thơ',
    capacity: 10000, // tối đa công suất giá trị xuất
    items: [
      { quantity: 20, exportPrice: 100, status: 'in-stock' },
      { quantity: 0, exportPrice: 150, status: 'out-of-stock' },
      { quantity: 10, exportPrice: 200, status: 'in-stock' }
    ],
    color: '#FF8282'
  },
  {
    warehouseName: 'Kho Hồ Chí Minh',
    capacity: 5000,
    items: [
      { quantity: 0, exportPrice: 200, status: 'out-of-stock' },
      { quantity: 5, exportPrice: 300, status: 'in-stock' }
    ],
    color: '#BF9264'
  },
  {
    warehouseName: 'Kho Đồng Tháp',
    capacity: 3000,
    items: [
      { quantity: 0, exportPrice: 200, status: 'out-of-stock' },
      { quantity: 5, exportPrice: 300, status: 'in-stock' }
    ],
    color: '#3A59D1'
  }
]

export default function StockStatus() {
  const renderWarehouseCard = (warehouse, index) => {
    const { warehouseName, items, capacity } = warehouse

    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
    const inStock = items.filter((i) => i.quantity > 0).length
    const outOfStock = items.filter((i) => i.quantity === 0).length
    const totalExportValue = items.reduce(
      (sum, i) => sum + i.quantity * i.exportPrice,
      0
    )
    const usagePercent = Math.min((totalExportValue / capacity) * 100, 100)

    const summaryItems = [
      {
        label: 'Tổng số lượng',
        value: `${Number(totalQuantity).toLocaleString('vi-VN')}`
      },
      {
        label: 'Còn hàng',
        value: `${Number(inStock).toLocaleString('vi-VN')}`
      },
      {
        label: 'Hết hàng',
        value: `${Number(outOfStock).toLocaleString('vi-VN')}`
      },
      {
        label: 'Tổng xuất',
        value: `${Number(totalExportValue).toLocaleString('vi-VN')}đ`
      }
    ]

    return (
      <Grid
        item
        size={4}
        xs={12}
        md={6}
        lg={4}
        key={index}
        sx={{
          borderLeft: '5px solid #3A59D1',
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          p: 2
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='h6' fontWeight='bold'>
            {warehouseName}
          </Typography>
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {summaryItems.map((item, i) => (
            <Grid item size={6} xs={6} key={i}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  fontWeight='700'
                >
                  {item.label}
                </Typography>
                <Typography fontWeight='bold'>{item.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box>
          <Typography variant='body2' sx={{ mb: 0.5 }} fontWeight='medium'>
            Tình trạng công suất ({usagePercent.toFixed(1)}%)
          </Typography>
          <Tooltip
            title={`Tổng giá trị xuất: ${totalExportValue.toLocaleString()}đ / Công suất tối đa: ${capacity.toLocaleString()}đ`}
          >
            <LinearProgress
              variant='determinate'
              value={usagePercent}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    usagePercent < 60
                      ? '#4caf50'
                      : usagePercent < 90
                        ? '#ff9800'
                        : '#f44336'
                }
              }}
            />
          </Tooltip>
        </Box>
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      {inventoryByWarehouse.map((wh, idx) => renderWarehouseCard(wh, idx))}
    </Grid>
  )
}

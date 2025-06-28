import React from 'react'
import { Box, Grid, Typography, Stack } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DiscountIcon from '@mui/icons-material/Discount'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TaskIcon from '@mui/icons-material/Task'
import EventBusyIcon from '@mui/icons-material/EventBusy'

ChartJS.register(ArcElement, Tooltip, Legend)

const OrderStatistic = ({ stats = {} }) => {
  const {
    totalOrders = 0,
    totalDiscountAmount = 0,
    totalShippingFee = 0,
    totalCoupons = 0,
    usedCoupons = 0,
    fullyUsedCoupons = 0,
    paymentMethodCounts = {},
    orderStatusCounts = {}
  } = stats

  const summaryItems = [
    {
      label: 'Tổng đơn hàng',
      value: totalOrders,
      icon: <ShoppingCartIcon color='primary' fontSize='large' />,
      color: '#4FC3F7'
    },
    {
      label: 'Tổng tiền giảm giá',
      value: totalDiscountAmount.toLocaleString('vi-VN') + '₫',
      icon: <DiscountIcon color='secondary' fontSize='large' />,
      color: '#BA68C8'
    },
    {
      label: 'Tổng phí vận chuyển',
      value: totalShippingFee.toLocaleString('vi-VN') + '₫',
      icon: <LocalShippingIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    }
  ]

  const couponItems = [
    {
      label: 'Tổng số lượt dùng mã giảm giá',
      value: totalCoupons,
      icon: <ShowChartIcon color='success' fontSize='large' />,
      color: '#34D399'
    },
    {
      label: 'Số mã đã được sử dụng',
      value: usedCoupons,
      icon: <TaskIcon color='info' fontSize='large' />,
      color: '#60A5FA'
    },
    {
      label: 'Số mã đã sử dụng hết',
      value: fullyUsedCoupons,
      icon: <EventBusyIcon color='error' fontSize='large' />,
      color: '#EF4444'
    }
  ]

  const piePaymentChart = {
    labels: Object.keys(paymentMethodCounts),
    datasets: [
      {
        data: Object.values(paymentMethodCounts),
        backgroundColor: ['#34D399', '#60A5FA']
      }
    ]
  }

  const pieStatusChart = {
    labels: Object.keys(orderStatusCounts),
    datasets: [
      {
        data: Object.values(orderStatusCounts),
        backgroundColor: [
          '#FBBF24',
          '#4ADE80',
          '#60A5FA',
          '#10B981',
          '#EF4444',
          '#9CA3AF'
        ]
      }
    ]
  }

  return (
    <div className='order-statistic-wrapper'>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Tổng quan đơn hàng */}
        <div className='order-summary'>
          <Box>
            <Typography variant='h5' fontWeight='bold' mb={2}>
              Thống kê đơn hàng
            </Typography>
            <Grid container spacing={2}>
              {summaryItems.map((item, index) => (
                <Grid item size={4} xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderLeft: `10px solid ${item.color}`,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2
                    }}
                  >
                    <Stack>
                      <Typography variant='subtitle1' color='text.secondary'>
                        {item.label}
                      </Typography>
                      <Typography
                        variant='h6'
                        fontWeight='bold'
                        sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
                      >
                        {item.icon} {item.value}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>

        {/* Mã giảm giá */}
        <div className='coupon-summary'>
          <Box>
            <Typography variant='h5' fontWeight='bold' mb={1}>
              Thống kê mã giảm giá
            </Typography>
            <Grid container spacing={2}>
              {couponItems.map((item, index) => (
                <Grid item size={4} xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderLeft: `10px solid ${item.color}`,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2
                    }}
                  >
                    <Stack>
                      <Typography variant='subtitle1' color='text.secondary'>
                        {item.label}
                      </Typography>
                      <Typography
                        variant='h6'
                        fontWeight='bold'
                        sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
                      >
                        {item.icon} {item.value}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>

        {/* Biểu đồ thanh toán và trạng thái */}
        <div className='charts'>
          <Box>
            <Grid container spacing={2}>
              <Grid item size={6} xs={12} md={6}>
                <Typography variant='h5' fontWeight='bold' mb={1}>
                  Phương thức thanh toán
                </Typography>
                <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
                  <Pie data={piePaymentChart} />
                </Box>
              </Grid>
              <Grid item size={6} xs={12} md={6}>
                <Typography variant='h5' fontWeight='bold' mb={1}>
                  Trạng thái đơn hàng
                </Typography>
                <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
                  <Pie data={pieStatusChart} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Box>
    </div>
  )
}

export default OrderStatistic

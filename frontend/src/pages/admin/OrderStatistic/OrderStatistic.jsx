import React from 'react'
import { Box, Grid, Typography, Stack } from '@mui/material'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DiscountIcon from '@mui/icons-material/Discount'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TaskIcon from '@mui/icons-material/Task'
import EventBusyIcon from '@mui/icons-material/EventBusy'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
)

const OrderStatistic = ({ stats = {}, financeStats = {} }) => {
  const {
    orderStats: {
      totalOrders = 0,
      totalRevenue = 0,
      totalShipping = 0,
      totalDiscountAmount = 0
    } = {},
    couponStats: {
      totalCoupons = 0,
      totalCouponsUsage = 0,
      totalUsedUpCoupons = 0
    } = {},
    paymentMethodStats = [],
    statusOrdersStats = []
  } = stats

  const {
    totalRevenue: financeRevenue = 0,
    totalCost = 0,
    totalProfit = 0,
    revenueChart = {}
  } = financeStats

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
      value: totalShipping.toLocaleString('vi-VN') + '₫',
      icon: <LocalShippingIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    }
  ]

  const financeSummaryItems = [
    {
      label: 'Số tiền thu được từ đơn hàng',
      value: financeRevenue.toLocaleString('vi-VN') + '₫',
      icon: <ShowChartIcon color='success' fontSize='large' />,
      color: '#34D399'
    },
    {
      label: 'Tổng tiền vốn của các đơn hàng',
      value: totalCost.toLocaleString('vi-VN') + '₫',
      icon: <TaskIcon color='info' fontSize='large' />,
      color: '#60A5FA'
    },
    {
      label: 'Lợi nhuận tổng các đơn hàng',
      value: totalProfit.toLocaleString('vi-VN') + '₫',
      icon: <EventBusyIcon color='error' fontSize='large' />,
      color: '#EF4444'
    }
  ]

  const lineChartData = {
    labels: revenueChart.monthlyStats.map((stat) => `Tháng ${stat.month}`),
    datasets: [
      {
        label: 'Lợi nhuận',
        data: revenueChart.monthlyStats.map((stat) => stat.revenue - totalCost),
        borderColor: '#66bb6a',
        backgroundColor: 'transparent',
        fill: true,
        tension: 0.3
      }
    ]
  }

  return (
    <div className='order-statistic-wrapper'>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Tổng quan đơn hàng */}
        <div className='order-summary'>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              boxShadow: 1
            }}
          >
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
                      height: '150px',
                      borderLeft: `10px solid ${item.color}`,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2
                    }}
                  >
                    <Stack>
                      <Typography
                        variant='h5'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant='h6'
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
          </Box>
        </div>

        {/* Thống kê tài chính */}
        <div className='finance-summary'>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              boxShadow: 1
            }}
          >
            <Typography variant='h5' fontWeight='bold' mb={2}>
              Thống kê tài chính
            </Typography>
            <Grid container spacing={2}>
              {financeSummaryItems.map((item, index) => (
                <Grid item size={4} xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      height: '150px',
                      borderLeft: `10px solid ${item.color}`,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2
                    }}
                  >
                    <Stack>
                      <Typography
                        variant='h5'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant='h6'
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
          </Box>
        </div>

        {/* Biểu đồ lợi nhuận */}
        <div className='profit-chart'>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              boxShadow: 1
            }}
          >
            <Typography variant='h5' fontWeight='bold' mb={2}>
              Biểu đồ lợi nhuận trong 12 tháng
            </Typography>
            <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
              <Line data={lineChartData} options={{ responsive: true }} />
            </Box>
          </Box>
        </div>
      </Box>
    </div>
  )
}

export default OrderStatistic

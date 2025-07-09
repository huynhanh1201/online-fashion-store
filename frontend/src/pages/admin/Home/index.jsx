import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import WavingHandIcon from '@mui/icons-material/WavingHand'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
import SystemDashboard from '~/pages/admin/Home/SystemDashboard.jsx'
import usePermissions from '~/hooks/usePermissions'
const AdminHome = () => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear.toString())
  const { hasPermission } = usePermissions()
  const {
    loading,
    warehouseStatistics,
    productStatistics,
    orderStatistics,
    accountStatistics,
    financeStatistics,
    fetchFinanceStatistics,
    fetchAccountStatistics,
    fetchStatistics,
    fetchOrdersStatistics,
    fetchProductsStatistics
  } = useInventoryStatistics()
  // Fetch các thống kê tổng quan 1 lần
  useEffect(() => {
    fetchStatistics()
    fetchOrdersStatistics()
    fetchProductsStatistics()
    fetchAccountStatistics()
  }, [])
  // Chỉ fetch 1 lần ban đầu
  useEffect(() => {
    fetchFinanceStatistics(year)
  }, [year])
  if (!hasPermission('statistics:use', 'admin:access')) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 126px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 2
        }}
      >
        <WavingHandIcon sx={{ fontSize: 120, color: '#ff9800', mb: 1 }} />
        <Typography variant='h4' fontWeight='bold'>
          Đây là hệ thống quản lý nội bộ
        </Typography>
        <Typography variant='h5' mt={1}>
          Chúc bạn một ngày tốt lành! 😊
        </Typography>
      </Box>
    )
  }
  return (
    <>
      <SystemDashboard
        loading={loading}
        accountStatistics={accountStatistics}
        warehouseStatistics={warehouseStatistics}
        productStatistics={productStatistics}
        orderStatistics={orderStatistics}
        financeStatistics={financeStatistics}
      />
    </>
  )
}

export default AdminHome

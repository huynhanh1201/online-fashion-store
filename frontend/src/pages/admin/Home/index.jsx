// import React, { useEffect } from 'react'
// import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
// import SystemDashboard from '~/pages/admin/Home/SystemDashboard.jsx'
// const AdminHone = () => {
//   const {
//     loading,
//     warehouseStatistics,
//     productStatistics,
//     orderStatistics,
//     fetchStatistics,
//     fetchOrdersStatistics,
//     fetchProductsStatistics
//   } = useInventoryStatistics()
//   useEffect(() => {
//     fetchStatistics()
//     fetchOrdersStatistics()
//     fetchProductsStatistics()
//   }, [])
//   const accountStatistics = {
//     summary: {
//       totalUsers: 120,
//       totalAdmins: 15,
//       totalCustomers: 105
//     },
//     byRole: [
//       {
//         role: 'admin',
//         label: 'Quản trị viên',
//         count: 15
//       },
//       {
//         role: 'customer',
//         label: 'Khách hàng',
//         count: 105
//       }
//     ],
//     chartData: {
//       labels: ['Quản trị viên', 'Khách hàng'],
//       datasets: [
//         {
//           label: 'Số lượng tài khoản theo vai trò',
//           data: [15, 105],
//           backgroundColor: ['#3498db', '#2ecc71']
//         }
//       ]
//     },
//     updatedAt: '2025-06-28T19:00:00+07:00'
//   }
//   return (
//     <SystemDashboard
//       loading={loading}
//       stats={{
//         accountStatistics,
//         warehouseStatistics,
//         productStatistics,
//         orderStatistics
//       }}
//     />
//   )
// }
//
// export default AdminHone

import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import AccountStatistics from '~/pages/admin/AccountStatistic/AccountStatistic'
import WarehouseStatisticTab from '~/pages/admin/InventoryManagement/tab/WarehouseStatisticTab'
import OrderStatistic from '~/pages/admin/OrderStatistic/OrderStatistic'
import ProductStatistics from '~/pages/admin/ProductStatistics/ProductStatistic'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'

const AdminHone = () => {
  const {
    warehouseStatistics,
    productStatistics,
    orderStatistics,
    fetchStatistics,
    fetchOrdersStatistics,
    fetchProductsStatistics
  } = useInventoryStatistics()
  useEffect(() => {
    fetchStatistics()
    fetchOrdersStatistics()
    fetchProductsStatistics()
  }, [])
  const accountStatistics = {
    summary: {
      totalUsers: 120,
      totalAdmins: 15,
      totalCustomers: 105
    },
    byRole: [
      {
        role: 'admin',
        label: 'Quản trị viên',
        count: 15
      },
      {
        role: 'customer',
        label: 'Khách hàng',
        count: 105
      }
    ],
    chartData: {
      labels: ['Quản trị viên', 'Khách hàng'],
      datasets: [
        {
          label: 'Số lượng tài khoản theo vai trò',
          data: [15, 105],
          backgroundColor: ['#3498db', '#2ecc71']
        }
      ]
    },
    updatedAt: '2025-06-28T19:00:00+07:00'
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 3, py: 0 }}>
      <Typography variant='h4' fontWeight='bold'>
        Thống kê toàn hệ thống
      </Typography>
      {/* Account Statistics */}
      <Box>
        <AccountStatistics statistics={accountStatistics} />
      </Box>
      {/* Product Statistics */}
      <Box>
        <ProductStatistics stats={productStatistics} />
      </Box>
      {/* Order Statistics */}
      <Box>
        <OrderStatistic stats={orderStatistics} />
      </Box>

      {/* Warehouse Statistics */}
      <Box>
        <WarehouseStatisticTab statistics={warehouseStatistics} />
      </Box>
    </Box>
  )
}

export default AdminHone

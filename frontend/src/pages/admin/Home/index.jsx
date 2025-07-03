import React, { useEffect, useState } from 'react'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
import SystemDashboard from '~/pages/admin/Home/SystemDashboard.jsx'
import ProfitChartByMonth from '~/pages/admin/Home/Chart/ProfitChartByMonth.jsx'
import { RouteGuard } from '~/components/PermissionGuard'

const AdminHome = () => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear.toString())
  const [financeData, setFinanceData] = useState({})
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
  return (
    <RouteGuard requiredPermissions={['admin:access', 'statistics:use']}>
      <SystemDashboard
        loading={loading}
        accountStatistics={accountStatistics}
        warehouseStatistics={warehouseStatistics}
        productStatistics={productStatistics}
        orderStatistics={orderStatistics}
        financeStatistics={financeStatistics}
      />
    </RouteGuard>
  )
}

export default AdminHome

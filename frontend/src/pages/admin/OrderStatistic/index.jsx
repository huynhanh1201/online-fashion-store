import React, { useEffect, useState } from 'react'
import OrderStatistic from './OrderStatistic.jsx'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
import { RouteGuard } from '~/components/PermissionGuard'

function OrderDashboard() {
  const {
    orderStatistics,
    financeStatistics,
    fetchFinanceStatistics,
    fetchOrdersStatistics
  } = useInventoryStatistics()

  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear.toString())

  useEffect(() => {
    fetchOrdersStatistics()
  }, [])

  useEffect(() => {
    fetchFinanceStatistics(year)
  }, [year])

  return (
    <RouteGuard requiredPermissions={['admin:access', 'orderStatistics:use']}>
      <OrderStatistic
        stats={orderStatistics}
        financeStatistics={financeStatistics}
        year={year}
        setYear={setYear}
      />
    </RouteGuard>
  )
}

export default OrderDashboard

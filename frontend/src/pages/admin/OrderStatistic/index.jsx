import React, { useEffect } from 'react'
import OrderStatistic from './OrderStatistic.jsx'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'

function OrderDashboard() {
  const {
    orderStatistics,
    financeStatistics,
    fetchFinanceStatistics,
    fetchOrdersStatistics
  } = useInventoryStatistics()
  useEffect(() => {
    fetchOrdersStatistics()
    fetchFinanceStatistics('2025')
  }, [])
  return (
    <OrderStatistic
      stats={orderStatistics}
      financeStatistics={financeStatistics}
    />
  )
}

export default OrderDashboard

import React, { useEffect } from 'react'
import OrderStatistic from './OrderStatistic.jsx'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'

function OrderDashboard() {
  const {
    orderStatistics,
    financeStatistics,
    fetchOrdersStatistics,
    fetchFinanceStatistics
  } = useInventoryStatistics()

  useEffect(() => {
    fetchOrdersStatistics()
    fetchFinanceStatistics('2025')
  }, [])
  console.log(financeStatistics)
  return (
    <OrderStatistic stats={orderStatistics} financeStats={financeStatistics} />
  )
}

export default OrderDashboard

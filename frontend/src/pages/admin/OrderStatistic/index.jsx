import React, { useEffect } from 'react'
import OrderStatistic from './OrderStatistic.jsx'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'

function OrderDashboard() {
  const { orderStatistics, fetchOrdersStatistics } = useInventoryStatistics()
  useEffect(() => {
    fetchOrdersStatistics()
  }, [])
  return <OrderStatistic stats={orderStatistics} />
}

export default OrderDashboard

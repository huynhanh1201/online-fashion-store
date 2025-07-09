import React, { useEffect, useState } from 'react'
import OrderStatistic from './OrderStatistic.jsx'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'

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
    <OrderStatistic
      stats={orderStatistics}
      financeStatistics={financeStatistics}
      year={year}
      setYear={setYear}
    />
  )
}

export default OrderDashboard

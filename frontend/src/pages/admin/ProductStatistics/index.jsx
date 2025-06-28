import ProductStatistics from './ProductStatistic.jsx'
import React, { useEffect } from 'react'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
function DashboardPage() {
  const { fetchProductsStatistics, statistics } = useInventoryStatistics()
  useEffect(() => {
    fetchProductsStatistics()
  }, [])
  return <ProductStatistics stats={statistics} />
}

export default DashboardPage

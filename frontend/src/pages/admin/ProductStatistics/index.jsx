import ProductStatistics from './ProductStatistic.jsx'
import React, { useEffect } from 'react'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'

function ProductDashboard() {
  const { fetchProductsStatistics, productStatistics } =
    useInventoryStatistics()

  useEffect(() => {
    fetchProductsStatistics()
  }, [])

  return <ProductStatistics stats={productStatistics} />
}

export default ProductDashboard

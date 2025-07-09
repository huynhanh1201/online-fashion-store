import ProductStatistics from './ProductStatistic.jsx'
import React, { useEffect } from 'react'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
import { RouteGuard } from '~/components/PermissionGuard'

function ProductDashboard() {
  const { fetchProductsStatistics, productStatistics } =
    useInventoryStatistics()

  useEffect(() => {
    fetchProductsStatistics()
  }, [])

  return (
    <RouteGuard requiredPermissions={['admin:access', 'productStatistics:use']}>
      <ProductStatistics stats={productStatistics} />
    </RouteGuard>
  )
}

export default ProductDashboard

import React, { useState } from 'react'
import { getInventoryStatistics } from '~/services/admin/Inventory/StatisticService'

export const useInventoryStatistics = () => {
  const [statistics, setStatistics] = useState([])
  const [loading, setLoading] = useState(true)
  // const [page, setPage] = useState(1)

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const data = await getInventoryStatistics()
      setStatistics(data)
    } catch (error) {
      console.error('Error fetching inventory statistics:', error)
    } finally {
      setLoading(false)
    }
  }
  return {
    statistics,
    loading,
    fetchStatistics
  }
}
export default useInventoryStatistics

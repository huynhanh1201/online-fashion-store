import React, { useState } from 'react'
import {
  getInventoryStatistics,
  getProductsStatistics,
  getOrderStatistics
} from '~/services/admin/StatisticService.js'

export const useInventoryStatistics = () => {
  const [statistics, setStatistics] = useState([])
  const [loading, setLoading] = useState(true)

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

  const fetchProductsStatistics = async () => {
    setLoading(true)
    try {
      const data = await getProductsStatistics()
      setStatistics(data)
    } catch (error) {
      console.error('Error fetching products statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrdersStatistics = async () => {
    setLoading(true)
    try {
      const data = await getOrderStatistics()
      setStatistics(data)
    } catch (error) {
      console.error('Error fetching orders statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    statistics,
    loading,
    fetchStatistics,
    fetchProductsStatistics,
    fetchOrdersStatistics
  }
}

export default useInventoryStatistics

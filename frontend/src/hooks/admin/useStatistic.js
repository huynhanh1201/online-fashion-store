import React, { useState } from 'react'
import {
  getInventoryStatistics,
  getProductsStatistics,
  getOrderStatistics,
  getAccountStatistics,
  finaceStatistics
} from '~/services/admin/StatisticService.js'

export const useInventoryStatistics = () => {
  const [statistics, setStatistics] = useState([])
  const [accountStatistics, setAccountStatistics] = useState([])
  const [warehouseStatistics, setWarehouseStatistics] = useState([])
  const [orderStatistics, setOrderStatistics] = useState([])
  const [productStatistics, setProductStatistics] = useState([])
  const [loading, setLoading] = useState(true)
  const [financeStatistics, setFinanceStatistics] = useState([])

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const data = await getInventoryStatistics()
      setWarehouseStatistics(data)
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
      setProductStatistics(data)
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
      setOrderStatistics(data)
    } catch (error) {
      console.error('Error fetching orders statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAccountStatistics = async () => {
    setLoading(true)
    try {
      const data = await getAccountStatistics()
      setAccountStatistics(data)
    } catch (error) {
      console.error('Error fetching account statistics:', error)
    } finally {
      setLoading(false)
    }
  }
  const fetchFinanceStatistics = async (year) => {
    setLoading(true)
    try {
      const data = await finaceStatistics(year)
      setFinanceStatistics(data)
    } catch (error) {
      console.error('Error fetching finance statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    statistics,
    loading,
    fetchStatistics,
    fetchProductsStatistics,
    fetchOrdersStatistics,
    fetchFinanceStatistics,
    fetchAccountStatistics,
    accountStatistics,
    setAccountStatistics,
    warehouseStatistics,
    setWarehouseStatistics,
    orderStatistics,
    setOrderStatistics,
    productStatistics,
    setProductStatistics,
    setStatistics,
    financeStatistics,
    setFinanceStatistics
  }
}

export default useInventoryStatistics

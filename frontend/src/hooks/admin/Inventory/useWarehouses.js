import { useState } from 'react'
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from '~/services/admin/Inventory/WarehouseService'

const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState([])
  const [totalWarehouse, setTotalPages] = useState(1)
  const [loadingWarehouse, setLoading] = useState(false)

  const fetchWarehouses = async (page = 1, limit = 10, filters) => {
    setLoading(true)
    const buildQuery = (input) => {
      const query = { page, limit, ...input }
      Object.keys(query).forEach((key) => {
        if (
          query[key] === '' ||
          query[key] === undefined ||
          query[key] === null
        ) {
          delete query[key]
        }
      })
      return query
    }

    try {
      const query = buildQuery(filters)
      const response = await getWarehouses(query)
      setWarehouses(response.warehouses || [])
      setTotalPages(response.total || 1)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      setWarehouses([])
      setTotalPages(0)
      setLoading(false)
      return { warehouses: [], total: 0 }
    }
  }

  const createNewWarehouse = async (data) => {
    const result = await createWarehouse(data)
    if (result) await fetchWarehouses()
    return result
  }

  const updateWarehouseById = async (id, data) => {
    const result = await updateWarehouse(id, data)
    if (result) await fetchWarehouses()
    return result
  }

  const deleteWarehouseById = async (id) => {
    const result = await deleteWarehouse(id)
    if (result) await fetchWarehouses()
    return result
  }

  return {
    warehouses,
    totalWarehouse,
    loadingWarehouse,
    fetchWarehouses,
    createNewWarehouse,
    updateWarehouseById,
    deleteWarehouseById
  }
}

export default useWarehouses

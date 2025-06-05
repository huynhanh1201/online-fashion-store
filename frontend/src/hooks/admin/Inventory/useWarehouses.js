import { useState } from 'react'
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from '~/services/admin/Inventory/WarehouseService'

const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchWarehouses = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true)
    const { warehouses, total } = await getWarehouses(page, limit, filters)
    setWarehouses(warehouses)
    setTotalPages(total || 1)
    setLoading(false)
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
    totalPages,
    loading,
    fetchWarehouses,
    createNewWarehouse,
    updateWarehouseById,
    deleteWarehouseById
  }
}

export default useWarehouses

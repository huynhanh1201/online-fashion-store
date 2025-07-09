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
      setTotalPages(response.total)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      setWarehouses([])
      setTotalPages(0)
      setLoading(false)
      return { warehouses: [], total: 0 }
    }
  }

  const createNewWarehouse = async (data, filters = {}) => {
    try {
      const result = await createWarehouse(data)
      if (!result) {
        throw new Error('Failed to create warehouse')
      }

      setWarehouses((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [result, ...prev].slice(0, 10)
        } else if (sort === 'oldest') {
          if (prev.length < 10) {
            updated = [...prev, result]
          }
          // Nếu đã đủ 10 phần tử thì không thêm
        } else {
          updated = [result, ...prev].slice(0, 10) // Mặc định giống newest
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return result
    } catch (error) {
      console.error('Error creating warehouse:', error)
      throw error
    }
  }

  const updateWarehouseById = async (id, data) => {
    try {
      const result = await updateWarehouse(id, data)
      if (result) {
        setWarehouses((prev) =>
          prev.map((warehouse) => (warehouse._id === id ? result : warehouse))
        )
        console.log('Warehouse updated successfully:', result)
        return result
      } else {
        throw new Error('Failed to update warehouse')
      }
    } catch (error) {
      console.error('Error updating warehouse:', error)
      throw error
    }
  }

  const deleteWarehouseById = async (id) => {
    try {
      const result = await deleteWarehouse(id)
      if (result) {
        setWarehouses((prev) =>
          prev.filter((warehouse) => warehouse._id !== id)
        )
        setTotalPages((prev) => prev - 1)
        return result
      } else {
        throw new Error('Failed to delete warehouse')
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error)
      throw error
    }
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

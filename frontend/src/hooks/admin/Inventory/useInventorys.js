import { useState } from 'react'
import {
  getInventories,
  updateInventory,
  deleteInventory,
  createInventory,
  importInventory,
  exportInventory,
  getInventoryById
} from '~/services/admin/Inventory/inventoryService'

const useInventorys = (pageInventory = 1) => {
  const [inventories, setInventories] = useState([]) // Danh sách các biến thể kho
  const [totalPageInventory, setTotalPages] = useState(1) // Tổng số trang phục vụ phân trang
  const [loading, setLoading] = useState(false) // Trạng thái đang tải

  const fetchInventories = async (
    page = pageInventory,
    limit = 10,
    filters = {}
  ) => {
    setLoading(true)
    const inventory = await getInventories(page, limit, filters)
    setInventories(inventory.inventories || [])
    setTotalPages(inventory.total || 1)
    setLoading(false)
  }
  const updateInventoryById = async (id, data) => {
    const result = await updateInventory(id, data)
    return result
  }

  const deleteInventoryById = async (id) => {
    const result = await deleteInventory(id)
    return result
  }

  const createNewInventory = async (data) => {
    const result = await createInventory(data)
    return result
  }

  const handleImport = async (inventoryId, quantity) => {
    try {
      const res = await importInventory(inventoryId, quantity)
      return res.data
    } catch (error) {
      console.error('Import error', error)
      return null
    }
  }

  const handleExport = async (inventoryId, quantity) => {
    try {
      const res = await exportInventory(inventoryId, quantity)
      return res.data
    } catch (error) {
      console.error('Export error', error)
      return null
    }
  }

  const getInventoryId = async (id) => {
    try {
      const res = await getInventoryById(id)
      return res
    } catch (error) {
      console.error('Get inventory by ID error', error)
      return null
    }
  }

  return {
    inventories,
    totalPageInventory,
    fetchInventories,
    loading,
    updateInventoryById,
    deleteInventoryById,
    createNewInventory,
    handleImport,
    handleExport,
    getInventoryId
  }
}

export default useInventorys

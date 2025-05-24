import { useState, useEffect } from 'react'
import {
  getInventories,
  updateInventory,
  deleteInventory
} from '~/services/admin/inventoryService'

const useInventories = (pageInventory = 1, limit = 10) => {
  const [inventories, setInventories] = useState([]) // Danh sách các biến thể kho
  const [totalPages, setTotalPages] = useState(1) // Tổng số trang phục vụ phân trang
  const [loading, setLoading] = useState(false) // Trạng thái đang tải

  const fetchInventories = async (page = pageInventory, filters = {}) => {
    setLoading(true)
    const { inventories, total } = await getInventories(page, limit, filters)
    setInventories(inventories)
    setTotalPages(Math.max(1, Math.ceil(total / limit)))
    setLoading(false)
  }
  const updateInventoryById = async (id, data) => {
    const result = await updateInventory(id, data)
    if (result) await fetchInventories(pageInventory)
    return result
  }

  const deleteInventoryById = async (id) => {
    const result = await deleteInventory(id)
    if (result) await fetchInventories(pageInventory)
    return result
  }
  return {
    inventories,
    totalPages,
    fetchInventories,
    loading,
    updateInventoryById,
    deleteInventoryById
  }
}

export default useInventories

import { useState } from 'react'
import { getInventories } from '~/services/admin/inventoryService'

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

  return { inventories, totalPages, fetchInventories, loading }
}

export default useInventories

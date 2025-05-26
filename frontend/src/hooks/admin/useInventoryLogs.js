import { useState, useEffect } from 'react'
import { getInventoryLogs } from '~/services/admin/inventoryService.js'

const useInventoryLogs = (page = 1, limit = 10) => {
  const [logs, setLogs] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await getInventoryLogs({ page, limit })

      // Nếu API trả về mảng thuần
      if (Array.isArray(response)) {
        setLogs(response)
        setTotalPages(1) // hoặc tính theo limit nếu API không hỗ trợ phân trang
      }

      // Nếu sau này API có hỗ trợ thêm: { logs: [...], totalPages }
      else if (response?.logs) {
        setLogs(response.logs)
        setTotalPages(response.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch inventory logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

  return {
    logs,
    totalPages,
    loading,
    fetchLogs
  }
}

export default useInventoryLogs

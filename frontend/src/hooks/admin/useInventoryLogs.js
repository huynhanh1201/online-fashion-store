import { useState, useEffect } from 'react'
import { getInventoryLogs } from '~/services/admin/inventoryService.js'

const useInventoryLogs = (page = 1, limit = 10) => {
  const [logs, setLogs] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchLogs = async (pageInventory = page) => {
    setLoading(true)
    try {
      const { logs: fetchedLogs = [], totalPages = 1 } = await getInventoryLogs(
        { page: pageInventory, limit }
      )
      setLogs(fetchedLogs)
      setTotalPages(totalPages)
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

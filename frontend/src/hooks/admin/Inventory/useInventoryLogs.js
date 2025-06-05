import { useState } from 'react'
import {
  getInventoryLogs,
  getInventoryLogDetail,
  createInventory
} from '~/services/admin/Inventory/inventoryService'

const useInventoryLogs = () => {
  const [logs, setLogs] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [logDetail, setLogDetail] = useState(null)

  const fetchLogs = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true)
    const { logs, totalPages } = await getInventoryLogs({
      page,
      limit,
      ...filters
    })
    setLogs(logs)
    setTotalPages(totalPages || 1)
    setLoading(false)
  }

  const fetchLogDetail = async (logId) => {
    const detail = await getInventoryLogDetail(logId)
    setLogDetail(detail)
    return detail
  }

  const createNewLog = async (data) => {
    const result = await createInventory(data)
    if (result) await fetchLogs()
    return result
  }
  return {
    logs,
    totalPages,
    loading,
    fetchLogs,
    fetchLogDetail,
    logDetail,
    createNewLog
  }
}

export default useInventoryLogs

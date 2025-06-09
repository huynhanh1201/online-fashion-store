import { useState } from 'react'
import {
  getInventoryLogs,
  getInventoryLogDetail,
  createInventory
} from '~/services/admin/Inventory/inventoryService'

const useInventoryLogs = () => {
  const [logs, setLogs] = useState([])
  const [totalPagesLogs, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [loading, setLoading] = useState(false)
  const [logDetail, setLogDetail] = useState(null)

  const fetchLogs = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true)
    const logs = await getInventoryLogs({
      page,
      limit,
      ...filters
    })
    setLogs(logs?.logs || [])
    setTotalLogs(logs?.total || 0)
    setTotalPages(logs?.totalPages || 1)
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
    totalLogs,
    logs,
    totalPagesLogs,
    loading,
    fetchLogs,
    fetchLogDetail,
    logDetail,
    createNewLog
  }
}

export default useInventoryLogs

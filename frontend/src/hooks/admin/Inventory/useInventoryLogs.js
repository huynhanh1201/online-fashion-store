import { useState } from 'react'
import {
  getInventoryLogs,
  getInventoryLogDetail
} from '~/services/admin/Inventory/inventoryService'

const useInventoryLogs = (page = 1, limit = 10) => {
  const [logs, setLogs] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [logDetail, setLogDetail] = useState(null)

  const fetchLogs = async (filters = {}) => {
    setLoading(true)
    const response = await getInventoryLogs({ page, limit, ...filters })
    setLogs(response.data || [])
    setTotalPages(response.totalPages || 1)
    setLoading(false)
  }

  const fetchLogDetail = async (logId) => {
    const detail = await getInventoryLogDetail(logId)
    setLogDetail(detail)
    return detail
  }

  return {
    logs,
    totalPages,
    loading,
    fetchLogs,
    fetchLogDetail,
    logDetail
  }
}

export default useInventoryLogs

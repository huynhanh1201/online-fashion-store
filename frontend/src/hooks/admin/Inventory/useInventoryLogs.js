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
  const [loadingLog, setLoading] = useState(false)
  const [logDetail, setLogDetail] = useState(null)

  const fetchLogs = async (page = 1, limit = 10, filters = {}) => {
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
      const response = await getInventoryLogs(query)
      setLogs(response.logs || [])
      setTotalPages(response.totalPages || 1)
      setTotalLogs(response.total || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching inventory logs:', error)
      setLogs([])
      setTotalPages(0)
      setTotalLogs(0)
      setLoading(false)
    }
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
    loadingLog,
    fetchLogs,
    fetchLogDetail,
    logDetail,
    createNewLog
  }
}

export default useInventoryLogs

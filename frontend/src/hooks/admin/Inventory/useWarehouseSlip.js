import { useState } from 'react'
import {
  getWarehouseSlips,
  createWarehouseSlip,
  getWarehouseSlipById,
  deleteWarehouseSlip,
  updateWarehouseSlip
} from '~/services/admin/Inventory/WarehouseSlipSetvice.js'

const useWarehouseSlips = () => {
  const [warehouseSlips, setWarehouseSlips] = useState([])
  const [totalPageSlip, setTotalPages] = useState(1)
  const [loadingSlip, setLoading] = useState(false)
  const fetchWarehouseSlips = async (page = 1, limit = 10, filters = {}) => {
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
      const response = await getWarehouseSlips(query)
      setWarehouseSlips(response.warehouseSlips || [])
      setTotalPages(response.total || 1)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching warehouse slips:', error)
      setWarehouseSlips([])
      setTotalPages(0)
      setLoading(false)
      return { warehouseSlips: [], total: 0 }
    }
  }
  const createNewWarehouseSlip = async (data) => {
    try {
      const result = await createWarehouseSlip(data)
      if (result) {
        setWarehouseSlips((prev) => [...prev, result])
        setTotalPages((prev) => prev + 1)
        return result
      } else {
        throw new Error('Không thể tạo phiếu kho mới')
      }
    } catch (error) {
      console.error('Lỗi khi tạo phiếu kho mới:', error)
      throw error // Ném lỗi để xử lý bên ngoài nếu cần
    }
  }
  const getWarehouseSlipId = async (id) => {
    const result = await getWarehouseSlipById(id)
    if (result) fetchWarehouseSlips()
    return result
  }
  const removeWarehouseSlip = async (id) => {
    const result = await deleteWarehouseSlip(id)
    if (result) fetchWarehouseSlips()
    return result
  }
  const update = async (id, data) => {
    const result = await updateWarehouseSlip(id, data)
    if (result) fetchWarehouseSlips()
    return result
  }

  return {
    warehouseSlips,
    totalPageSlip,
    loadingSlip,
    fetchWarehouseSlips,
    createNewWarehouseSlip,
    getWarehouseSlipId,
    removeWarehouseSlip,
    update
  }
}
export default useWarehouseSlips

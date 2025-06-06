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
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const fetchWarehouseSlips = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true)
    const { warehouseSlips, total } = await getWarehouseSlips(
      page,
      limit,
      filters
    )
    setWarehouseSlips(warehouseSlips)
    setTotalPages(total || 1)
    setLoading(false)
  }
  const createNewWarehouseSlip = async (data) => {
    const result = await createWarehouseSlip(data)
    if (result) await fetchWarehouseSlips()
    return result
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
    totalPages,
    loading,
    fetchWarehouseSlips,
    createNewWarehouseSlip,
    getWarehouseSlipId,
    removeWarehouseSlip,
    update
  }
}
export default useWarehouseSlips

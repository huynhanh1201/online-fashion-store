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
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = useState(10)
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
      setTotalPages(response.total)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching warehouse slips:', error)
      setWarehouseSlips([])
      setTotalPages(0)
      setLoading(false)
      return { warehouseSlips: [], total: 0 }
    }
  }
  const createNewWarehouseSlip = async (data, filters = {}) => {
    try {
      const result = await createWarehouseSlip(data)
      if (!result) {
        throw new Error('Không thể tạo phiếu kho mới')
      }

      setWarehouseSlips((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [result, ...prev].slice(0, ROWS_PER_PAGE)
        } else if (sort === 'oldest') {
          if (prev.length < ROWS_PER_PAGE) {
            updated = [...prev, result]
          }
          // Nếu đủ 10 thì không thêm
        } else {
          updated = [result, ...prev].slice(0, ROWS_PER_PAGE)
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return result
    } catch (error) {
      console.error('Lỗi khi tạo phiếu kho mới:', error)
      throw error
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
    update,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE
  }
}
export default useWarehouseSlips

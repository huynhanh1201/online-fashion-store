import { useState } from 'react'
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchById
} from '~/services/admin/Inventory/BatchService'

const useBatches = () => {
  const [batches, setBatches] = useState([])
  const [totalPageBatch, setTotalPages] = useState(1)
  const [loadingBatch, setLoading] = useState(false)

  const fetchBatches = async (page = 1, limit = 10, filters = {}) => {
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
      const response = await getBatches(query)
      setBatches(response.batches || [])
      setTotalPages(response.total)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching batches:', error)
      setBatches([])
      setTotalPages(0)
      setLoading(false)
    }
  }

  const createNewBatch = async (data) => {
    try {
      const newBatch = await createBatch(data)
      setBatches((prev) => {
        const updated = [newBatch, ...prev]
        return updated.slice(0, 10) // Keep only the 10 most recent batches
      })
      setTotalPages((prev) => prev + 1)
      return newBatch
    } catch (error) {
      console.error('Error creating new batch:', error)
      return null
    }
  }

  const updateBatchById = async (id, newData) => {
    try {
      const oldBatch = batches.find((batch) => batch._id === id)
      if (!oldBatch) return null

      const importPriceChanged = newData.importPrice !== oldBatch.importPrice
      const manufactureDateChanged =
        new Date(newData.manufactureDate).toISOString() !==
        new Date(oldBatch.manufactureDate).toISOString()

      // Nếu không có gì thay đổi thì bỏ qua
      if (!importPriceChanged && !manufactureDateChanged) {
        console.log('Không có thay đổi, bỏ qua cập nhật.')
        return oldBatch
      }

      // Nếu có 1 trong 2 thay đổi thì gửi cả 2
      const changedData = {
        importPrice: newData.importPrice,
        manufactureDate: newData.manufactureDate
      }

      // Gửi dữ liệu đã thay đổi lên server
      await updateBatch(id, changedData)

      // Cập nhật lại trong state
      setBatches((prev) =>
        prev.map((batch) =>
          batch._id === id
            ? {
                ...batch,
                ...changedData
              }
            : batch
        )
      )

      return {
        ...oldBatch,
        ...changedData
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật batch:', error)
      return null
    }
  }

  const deleteBatchById = async (id) => {
    try {
      await deleteBatch(id)
      setBatches((prev) => prev.filter((batch) => batch._id !== id))
      setTotalPages((prev) => prev - 1)
      return true
    } catch (error) {
      console.error('Error deleting batch:', error)
      return false
    }
  }
  const fetchBatchId = async (id) => {
    const result = await getBatchById(id)
    return result
  }

  const Save = (data) => {
    try {
      setBatches((prev) => prev.map((d) => (d._id === data._id ? data : d)))
    } catch (error) {
      console.error('Error saving inventory:', error)
    }
  }

  return {
    batches,
    totalPageBatch,
    loadingBatch,
    fetchBatches,
    createNewBatch,
    updateBatchById,
    deleteBatchById,
    fetchBatchId,
    Save
  }
}

export default useBatches

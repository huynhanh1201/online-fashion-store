import { useState } from 'react'
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch
} from '~/services/admin/Inventory/BatchService'

const useBatches = (pageBatch = 1, limit = 10) => {
  const [batches, setBatches] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchBatches = async (page = pageBatch, filters = {}) => {
    setLoading(true)
    const { batches, total } = await getBatches(page, limit, filters)
    setBatches(batches)
    setTotalPages(total || 1)
    setLoading(false)
  }

  const createNewBatch = async (data) => {
    const result = await createBatch(data)
    if (result) await fetchBatches(pageBatch)
    return result
  }

  const updateBatchById = async (id, data) => {
    const result = await updateBatch(id, data)
    if (result) await fetchBatches(pageBatch)
    return result
  }

  const deleteBatchById = async (id) => {
    const result = await deleteBatch(id)
    if (result) await fetchBatches(pageBatch)
    return result
  }

  return {
    batches,
    totalPages,
    loading,
    fetchBatches,
    createNewBatch,
    updateBatchById,
    deleteBatchById
  }
}

export default useBatches

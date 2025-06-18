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
      setTotalPages(response.total || 1)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching batches:', error)
      setBatches([])
      setTotalPages(0)
      setLoading(false)
    }
  }

  const createNewBatch = async (data) => {
    const result = await createBatch(data)
    return result
  }

  const updateBatchById = async (id, data) => {
    const result = await updateBatch(id, data)
    return result
  }

  const deleteBatchById = async (id) => {
    const result = await deleteBatch(id)
    return result
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

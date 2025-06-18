import { useState } from 'react'
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantId
} from '~/services/admin/Inventory/VariantService'

const useVariants = () => {
  const [variants, setVariants] = useState([])
  const [totalVariant, setTotalPages] = useState(1)
  const [loadingVariant, setLoading] = useState(false)

  const fetchVariants = async (page = 1, limit = 10, filters = {}) => {
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
      const { variants = [], total = 0 } = await getVariants(query)
      setVariants(variants)
      setTotalPages(total || 1)
    } catch (err) {
      setVariants([])
      setTotalPages(1)
      console.error('Lỗi fetchVariants:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNewVariant = async (data) => {
    const result = await createVariant(data)
    return result
  }

  const updateVariantById = async (id, data) => {
    const result = await updateVariant(id, data)
    return result
  }

  const deleteVariantById = async (id) => {
    const result = await deleteVariant(id)
    return result
  }
  const fetchVariantId = async (id) => {
    const result = await getVariantId(id)
    return result
  }

  const Save = (data) => {
    console.log('Cập nhật biến thể ID:', data._id)
    setVariants((prev) => {
      const updated = prev.map((d) => {
        console.log('So sánh:', d._id, data._id)
        return String(d._id) === String(data._id) ? data : d
      })
      return updated
    })
  }

  return {
    variants,
    totalVariant,
    loadingVariant,
    fetchVariants,
    createNewVariant,
    updateVariantById,
    deleteVariantById,
    Save,
    fetchVariantId
  }
}

export default useVariants

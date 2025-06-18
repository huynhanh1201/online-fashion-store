import { useState } from 'react'
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantById
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

  const fetchVariantById = async (id) => {
    const result = await getVariantById(id)
    return result
  }

  const Save = (data) => {
    setVariants((prev) =>
      prev.map((d) => (d.productId === data.productId ? data : d))
    )
  }

  return {
    variants,
    totalVariant,
    loadingVariant,
    fetchVariants,
    createNewVariant,
    updateVariantById,
    deleteVariantById,
    fetchVariantById,
    Save
  }
}

export default useVariants

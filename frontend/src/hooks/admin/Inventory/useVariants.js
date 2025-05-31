import { useState } from 'react'
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant
} from '~/services/admin/Inventory/VariantService'

const useVariants = (pageVariant = 1, limit = 10) => {
  const [variants, setVariants] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchVariants = async (page = pageVariant, filters = {}) => {
    setLoading(true)
    const { variants, total } = await getVariants(page, limit, filters)
    setVariants(variants)
    setTotalPages(total || 1)
    setLoading(false)
  }

  const createNewVariant = async (data) => {
    const result = await createVariant(data)
    if (result) await fetchVariants(pageVariant)
    return result
  }

  const updateVariantById = async (id, data) => {
    const result = await updateVariant(id, data)
    if (result) await fetchVariants(pageVariant)
    return result
  }

  const deleteVariantById = async (id) => {
    const result = await deleteVariant(id)
    if (result) await fetchVariants(pageVariant)
    return result
  }

  return {
    variants,
    totalPages,
    loading,
    fetchVariants,
    createNewVariant,
    updateVariantById,
    deleteVariantById
  }
}

export default useVariants

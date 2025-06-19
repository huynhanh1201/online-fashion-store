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
    try {
      const result = await createVariant(data)
      if (result) {
        setVariants((prev) => [...prev, result])
        return result
      } else {
        throw new Error('Không thể tạo biến thể mới')
      }
    } catch (error) {
      console.error('Lỗi khi tạo biến thể mới:', error)
      throw error // Ném lỗi để xử lý bên ngoài nếu cần
    }
  }

  const updateVariantById = async (id, data) => {
    try {
      const result = await updateVariant(id, data)
      if (result) {
        setVariants((prev) => {
          return prev.map((variant) =>
            String(variant._id) === String(id)
              ? { ...variant, ...data }
              : variant
          )
        })
        return result
      } else {
        throw new Error('Không thể cập nhật biến thể')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật biến thể:', error)
      throw error // Ném lỗi để xử lý bên ngoài nếu cần
    }
  }

  const deleteVariantById = async (id) => {
    try {
      const result = await deleteVariant(id)
      if (result) {
        setVariants((prev) =>
          prev.filter((variant) => String(variant._id) !== String(id))
        )
        setTotalPages((prev) => prev - 1)
        return result
      } else {
        throw new Error('Không thể xoá biến thể')
      }
    } catch (error) {
      console.error('Lỗi khi xoá biến thể:', error)
      throw error // Ném lỗi để xử lý bên ngoài nếu cần
    }
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

import { useState } from 'react'
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantId,
  restoreVariant
} from '~/services/admin/Inventory/VariantService'

const useVariants = () => {
  const [variants, setVariants] = useState([])
  const [totalVariant, setTotalPages] = useState(1)
  const [loadingVariant, setLoading] = useState(false)
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = useState(10)
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
      const { variants = [], total } = await getVariants(query)
      setVariants(variants)
      setTotalPages(total)
    } catch (err) {
      setVariants([])
      setTotalPages(1)
      console.error('Lỗi fetchVariants:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNewVariant = async (data, filters = {}) => {
    try {
      const result = await createVariant(data)
      if (!result) {
        throw new Error('Không thể tạo biến thể mới')
      }

      setVariants((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [result, ...prev].slice(0, ROWS_PER_PAGE)
        } else if (sort === 'oldest') {
          if (prev.length < ROWS_PER_PAGE) {
            updated = [...prev, result]
          }
          // Nếu đã đủ 10 phần tử thì không thêm
        } else {
          // Mặc định giống newest
          updated = [result, ...prev].slice(0, ROWS_PER_PAGE)
        }

        return updated
      })

      return result
    } catch (error) {
      console.error('Lỗi khi tạo biến thể mới:', error)
      throw error // ✅ vẫn giữ nguyên để xử lý ngoài nếu cần
    }
  }

  const updateVariantById = async (id, data) => {
    try {
      const result = await updateVariant(id, data)
      if (result) {
        setVariants((prev) =>
          prev.map((variant) =>
            String(variant._id) === String(id)
              ? { ...variant, ...result } // ✅ Sử dụng dữ liệu từ server trả về
              : variant
          )
        )
        return result
      } else {
        throw new Error('Không thể cập nhật biến thể')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật biến thể:', error)
      throw error
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

  const restore = async (id) => {
    try {
      const result = await restoreVariant(id)
      if (result) {
        setVariants((prev) =>
          prev.filter((variant) => String(variant._id) !== String(id))
        )
        setTotalPages((prev) => prev - 1)
        return result
      } else {
        throw new Error('Không thể khôi phục biến thể')
      }
    } catch (error) {
      console.error('Lỗi khi khôi phục biến thể:', error)
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
    fetchVariantId,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    restore
  }
}

export default useVariants

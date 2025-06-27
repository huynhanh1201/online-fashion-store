import { useState } from 'react'
import {
  getDiscounts,
  getDiscountById,
  updateDiscount,
  addDiscount,
  deleteDiscount
} from '~/services/admin/discountService'

const useDiscounts = () => {
  const [discounts, setDiscounts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = useState(10)
  const fetchDiscounts = async (page = 1, limit = 10, filters) => {
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
      const { discounts, total } = await getDiscounts(query)
      setDiscounts(discounts)
      setTotalPages(total)
    } catch (error) {
      console.error('Error fetching discounts:', error)
    }
    setLoading(false)
  }
  const fetchDiscountById = async (id) => {
    try {
      const discount = await getDiscountById(id)
      return discount
    } catch (error) {
      console.error('Error fetching discount by ID:', error)
      return []
    }
  }

  const add = async (data, filters = {}) => {
    try {
      const newDiscount = await addDiscount(data)
      if (!newDiscount) {
        console.error('Không thể thêm giảm giá mới')
        return null
      }

      setDiscounts((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [newDiscount, ...prev].slice(0, ROWS_PER_PAGE)
        } else if (sort === 'oldest') {
          if (prev.length < ROWS_PER_PAGE) {
            updated = [...prev, newDiscount]
          }
          // Nếu đủ 10 thì không thêm vào mảng
        } else {
          // Mặc định xử lý như 'newest'
          updated = [newDiscount, ...prev].slice(0, ROWS_PER_PAGE)
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return newDiscount
    } catch (err) {
      console.error('Lỗi khi thêm giảm giá:', err)
      return null
    }
  }

  const update = async (id, data) => {
    try {
      const updated = await updateDiscount(id, data)
      if (!updated) {
        console.error('Không thể cập nhật giảm giá')
        return null
      }
      setDiscounts((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      )
      return updated
    } catch (err) {
      console.error('Error updating category:', err)
      return null
    }
  }

  const remove = async (id) => {
    try {
      const remove = await deleteDiscount(id)
      if (!remove) {
        console.error('Không thể xoá giảm giá')
        return null
      }
      setDiscounts((prev) => prev.filter((d) => d._id !== id))
      setTotalPages((prev) => prev - 1)
      return true
    } catch (err) {
      console.error('Error deleting category:', err)
      return false
    }
  }

  const saveDiscount = (data) => {
    setDiscounts((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }
  return {
    discounts,
    totalPages,
    loading,
    fetchDiscounts,
    fetchDiscountById,
    saveDiscount,
    add,
    update,
    remove
  }
}

export default useDiscounts

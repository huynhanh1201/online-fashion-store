import { useState } from 'react'
import { getDiscounts, getDiscountById } from '~/services/admin/discountService'

const useDiscounts = () => {
  const [discounts, setDiscounts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

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

  const saveDiscount = (data) => {
    setDiscounts((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }
  return {
    discounts,
    totalPages,
    loading,
    fetchDiscounts,
    fetchDiscountById,
    saveDiscount
  }
}

export default useDiscounts

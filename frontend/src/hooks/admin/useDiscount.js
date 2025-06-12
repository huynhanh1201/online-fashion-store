import { useState } from 'react'
import { getDiscounts } from '~/services/admin/discountService'

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

  // useEffect(() => {
  //   fetchDiscounts(initialPage)
  // }, [initialPage])
  return { discounts, totalPages, loading, fetchDiscounts }
}

export default useDiscounts

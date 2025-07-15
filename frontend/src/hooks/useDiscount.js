import { useState } from 'react'
import { getDiscounts } from '~/services/discountService'

const useDiscounts = (initialPage = 1, limit = 10) => {
  const [discounts, setDiscounts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchDiscounts = async (page = initialPage) => {
    setLoading(true)
    const { discounts, total } = await getDiscounts(page, limit)
    setDiscounts(discounts)
    setTotalPages(Math.max(1, Math.ceil(total / limit)))
    setLoading(false)
  }

  // useEffect(() => {
  //   fetchDiscounts(initialPage)
  // }, [initialPage])
  return { discounts, totalPages, loading, fetchDiscounts }
}

export default useDiscounts

import { useState } from 'react'
import { getSizes } from '~/services/admin/sizeService'

const useSizes = (pageSize = 1, limit = 10) => {
  const [sizes, setSizes] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchSizes = async (page = pageSize) => {
    setLoading(true)
    try {
      const { sizes, total } = await getSizes(page, limit)
      setSizes(sizes)
      setTotalPages(Math.max(1, Math.ceil(total / limit)))
    } catch (error) {
      console.error('Lỗi khi lấy danh sách kích thước:', error)
    }
    setLoading(false)
  }

  return { sizes, totalPages, fetchSizes, loading }
}

export default useSizes

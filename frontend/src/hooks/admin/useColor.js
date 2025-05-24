import { useState } from 'react'
import { getColors } from '~/services/admin/ColorService'

const useColors = (pageColor = 1, limit = 10) => {
  const [colors, setColors] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchColors = async (page = pageColor) => {
    setLoading(true)
    try {
      const { colors, total } = await getColors(page, limit)
      setColors(colors)
      setTotalPages(Math.max(1, Math.ceil(total / limit)))
    } catch (error) {
      console.error('Lỗi khi lấy danh sách màu:', error)
    }
    setLoading(false)
  }

  return { colors, totalPages, fetchColors, loading }
}

export default useColors

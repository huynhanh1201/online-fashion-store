import { useState } from 'react'
import { getColors, addColor } from '~/services/admin/ColorService'

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

  const createNewColor = async (data) => {
    try {
      const result = await addColor(data)
      if (result) {
        await fetchColors(pageColor)
      }
      return result
    } catch (error) {
      console.error('Lỗi khi tạo màu mới:', error)
      return null
    }
  }

  return { colors, totalPages, fetchColors, loading, createNewColor }
}

export default useColors

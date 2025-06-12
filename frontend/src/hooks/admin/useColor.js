import { useState } from 'react'
import { getColors, addColor } from '~/services/admin/ColorService'

const useColors = () => {
  const [colors, setColors] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchColors = async (page = 1, limit = 10, filters) => {
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
      const { colors, total } = await getColors(query)
      setColors(colors)
      setTotalPages(total)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách màu:', error)
    }
    setLoading(false)
  }

  const createNewColor = async (data) => {
    try {
      const result = await addColor(data)
      return result
    } catch (error) {
      console.error('Lỗi khi tạo màu mới:', error)
      return null
    }
  }

  return { colors, totalPages, fetchColors, loading, createNewColor }
}

export default useColors

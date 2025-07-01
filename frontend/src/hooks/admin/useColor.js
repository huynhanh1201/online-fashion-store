import { useState } from 'react'
import {
  getColors,
  addColor,
  getColorById,
  deleteColor,
  updateColor,
  restoreColor
} from '~/services/admin/ColorService'

const useColors = () => {
  const [colors, setColors] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = useState(10)
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

  const createNewColor = async (data, filters = {}) => {
    try {
      const newColor = await addColor(data)
      if (!newColor) {
        console.error('Không thể thêm màu mới')
        return null
      }

      setColors((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [newColor, ...prev].slice(0, ROWS_PER_PAGE)
        } else if (sort === 'oldest') {
          if (prev.length < ROWS_PER_PAGE) {
            updated = [...prev, newColor]
          }
        } else {
          updated = [newColor, ...prev].slice(0, ROWS_PER_PAGE)
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return newColor
    } catch (error) {
      console.error('Lỗi khi thêm màu mới:', error)
      return null
    }
  }

  const update = async (id, data) => {
    try {
      const updated = await updateColor(id, data)
      if (!updated) {
        console.error('Không thể cập nhật màu')
        return null
      }
      setColors((prev) =>
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
      const remove = await deleteColor(id)
      if (!remove) {
        console.error('Không thể xoá màu')
        return null
      }
      setColors((prev) => prev.filter((d) => d._id !== id))
      setTotalPages((prev) => prev - 1)
      return true
    } catch (err) {
      console.error('Error deleting category:', err)
      return false
    }
  }

  const restore = async (id) => {
    try {
      const restored = await restoreColor(id)
      if (!restored) {
        console.error('Không thể khôi phục màu')
        return null
      }
      setColors((prev) => prev.filter((d) => d._id !== id))
      setTotalPages((prev) => prev - 1)
      return restored
    } catch (err) {
      console.error('Error restoring color:', err)
      return null
    }
  }

  const getColorId = async (id) => {
    try {
      const color = await getColorById(id)
      return color
    } catch (error) {
      console.error('Lỗi khi lấy màu:', error)
      return null
    }
  }

  const saveColor = (data) => {
    setColors((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }
  return {
    setROWS_PER_PAGE,
    ROWS_PER_PAGE,
    colors,
    totalPages,
    fetchColors,
    loading,
    createNewColor,
    getColorId,
    saveColor,
    update,
    remove,
    restore
  }
}

export default useColors

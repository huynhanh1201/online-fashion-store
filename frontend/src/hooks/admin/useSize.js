import { useState } from 'react'
import {
  getSizes,
  addSize,
  getSizeById,
  updateSize,
  deleteSize,
  restoreSize
} from '~/services/admin/sizeService'

const useSizes = () => {
  const [sizes, setSizes] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = useState(10)
  const fetchSizes = async (page = 1, limit = 10, filters) => {
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
      const { sizes, total } = await getSizes(query)
      setSizes(sizes)
      setTotalPages(total)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách kích thước:', error)
    }
    setLoading(false)
  }

  const createNewSize = async (data, filters = {}) => {
    try {
      const newSize = await addSize(data)
      if (!newSize) {
        console.error('Không thể thêm size mới')
        return null
      }

      setSizes((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [newSize, ...prev].slice(0, ROWS_PER_PAGE)
        } else if (sort === 'oldest') {
          if (prev.length < ROWS_PER_PAGE) {
            updated = [...prev, newSize]
          }
          // Nếu đã đủ 10 thì không thêm
        } else {
          // Mặc định: xử lý như newest
          updated = [newSize, ...prev].slice(0, ROWS_PER_PAGE)
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return newSize
    } catch (error) {
      console.error('Lỗi khi thêm size mới:', error)
      return null
    }
  }

  const update = async (id, data) => {
    try {
      const updated = await updateSize(id, data)
      if (!updated || !updated._id) {
        console.error('Dữ liệu trả về không hợp lệ')
        return null
      }
      setSizes((prev) => prev.map((d) => (d._id === updated._id ? updated : d)))
      return updated
    } catch (err) {
      console.error('Error updating category:', err)
      return null
    }
  }

  const remove = async (id) => {
    try {
      const remove = await deleteSize(id)
      if (!remove) {
        console.error('Không thể xoá kích thước')
        return null
      }
      setSizes((prev) => prev.filter((d) => d._id !== id))
      setTotalPages((prev) => prev - 1)
      return true
    } catch (err) {
      console.error('Error deleting category:', err)
      return false
    }
  }

  const restore = async (id) => {
    try {
      const restored = await restoreSize(id)
      if (!restored) {
        console.error('Không thể khôi phục kích thước')
        return null
      }
      setSizes((prev) => prev.filter((d) => d._id !== id))
      setTotalPages((prev) => prev - 1)
      return restored
    } catch (err) {
      console.error('Error restoring size:', err)
      return null
    }
  }

  const fetchSizeById = async (id) => {
    try {
      const size = await getSizeById(id)
      return size
    } catch (error) {
      console.error('Lỗi khi lấy kích thước theo ID:', error)
      return null
    }
  }

  const Save = (data) => {
    setSizes((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }
  return {
    sizes,
    totalPages,
    fetchSizes,
    loading,
    createNewSize,
    fetchSizeById,
    Save,
    update,
    remove,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    restore
  }
}

export default useSizes

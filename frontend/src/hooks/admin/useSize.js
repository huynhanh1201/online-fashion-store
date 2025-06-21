import { useState } from 'react'
import {
  getSizes,
  addSize,
  getSizeById,
  updateSize,
  deleteSize
} from '~/services/admin/sizeService'

const useSizes = () => {
  const [sizes, setSizes] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

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
          updated = [newSize, ...prev].slice(0, 10)
        } else if (sort === 'oldest') {
          if (prev.length < 10) {
            updated = [...prev, newSize]
          }
          // Nếu đã đủ 10 thì không thêm
        } else {
          // Mặc định: xử lý như newest
          updated = [newSize, ...prev].slice(0, 10)
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
      setSizes((prev) => prev.map((d) => (d._id === updated._id ? updated : d)))
      return updated
    } catch (err) {
      console.error('Error updating category:', err)
      return null
    }
  }

  const remove = async (id) => {
    try {
      await deleteSize(id)
      setSizes((prev) => prev.filter((d) => d._id !== id))
      setTotalPages((prev) => prev - 1)
      return true
    } catch (err) {
      console.error('Error deleting category:', err)
      return false
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
    remove
  }
}

export default useSizes

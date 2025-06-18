import { useState } from 'react'
import { getSizes, addSize, getSizeById } from '~/services/admin/sizeService'

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

  const createNewSize = async (data) => {
    try {
      const result = await addSize(data)
      return result
    } catch (error) {
      console.error('Lỗi khi tạo kích thước mới:', error)
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
    Save
  }
}

export default useSizes

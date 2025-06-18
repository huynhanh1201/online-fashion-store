import { useState } from 'react'
import {
  getCategories,
  getCategoryById
} from '~/services/admin/categoryService'

const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setloading] = useState(false)
  const fetchCategories = async (page = 1, limit = 10, filters = {}) => {
    setloading(true)
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
      console.log('Fetching categories with query:', query)
      const { categories, total } = await getCategories(query)
      setCategories(categories)
      setTotalPages(total)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setloading(false)
      return { categories: [], total: 0 }
    }
    setloading(false)
  }

  const fetchById = async (id) => {
    try {
      const category = await getCategoryById(id)
      return category
    } catch (err) {
      console.error('Error fetching category by ID:', err)
      return null
    }
  }

  const Save = (data) => {
    setCategories((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }

  return {
    categories,
    totalPages,
    fetchCategories,
    loading,
    fetchById,
    Save
  }
}

export default useCategories

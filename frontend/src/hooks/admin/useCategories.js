import { useState } from 'react'
import {
  getCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory
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
  const add = async (data, filters = {}) => {
    try {
      const newCategory = await addCategory(data)
      if (!newCategory) {
        console.error('Failed to add category')
        return null
      }

      setCategories((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [newCategory, ...prev].slice(0, 10)
        } else if (sort === 'oldest') {
          if (prev.length < 10) {
            updated = [...prev, newCategory]
          } // nếu >=10 thì bỏ qua
        } else {
          updated = [newCategory, ...prev].slice(0, 10)
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return newCategory
    } catch (err) {
      console.error('Error adding category:', err)
      return null
    }
  }

  const update = async (id, data) => {
    try {
      const updatedCategory = await updateCategory(id, data)
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      )
      return updatedCategory
    } catch (err) {
      console.error('Error updating category:', err)
      return null
    }
  }

  const remove = async (id) => {
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((cat) => cat._id !== id))
      setTotalPages((prev) => prev - 1)
      return true
    } catch (err) {
      console.error('Error deleting category:', err)
      return false
    }
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
    Save,
    add,
    remove,
    update
  }
}

export default useCategories

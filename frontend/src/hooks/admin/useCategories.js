// hooks/useCategories.js
import { useState } from 'react'
import { getCategories } from '~/services/admin/categoryService'

const useCategories = (pageCategory = 1, limit = 10) => {
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setloading] = useState(false)
  const fetchCategories = async (page = pageCategory) => {
    setloading(true)
    const { categories, total } = await getCategories(page, limit)
    setCategories(categories)
    setTotalPages(Math.max(1, Math.ceil(total / limit)))
    setloading(false)
  }

  return { categories, totalPages, fetchCategories, loading }
}

export default useCategories

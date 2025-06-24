import React from 'react'
import { getBlogs } from '~/services/admin/blogService.js'

const useBlog = () => {
  const [blogs, setBlogs] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [totalPages, setTotalPages] = React.useState(0)

  const fetchBlogs = async (page = 1, limit = 10, filters = {}) => {
    try {
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
      const query = buildQuery(filters)
      const response = await getBlogs(query)
      setBlogs(response.blogs)
      setTotalPages(response.total)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  return { blogs, loading, totalPages, fetchBlogs }
}

export default useBlog

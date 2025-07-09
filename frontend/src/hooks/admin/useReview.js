import React from 'react'
import {
  updateReview,
  deleteReview,
  getReviews,
  restoreReview
} from '~/services/admin/ReviewService.js'

const useReviews = () => {
  const [reviews, setReviews] = React.useState([])
  const [totalPages, setTotalPages] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const fetchReview = async (page = 1, limit = 10, filter = {}) => {
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
    const query = buildQuery(filter)
    try {
      const response = await getReviews(query)
      setReviews(response.data)
      setTotalPages(response.total)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const update = async (id, data) => {
    try {
      const updatedReview = await updateReview(id, data)
      if (updatedReview) {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === id ? { ...review, ...data } : review
          )
        )
      } else {
        throw new Error('Failed to update review')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const remove = async (id) => {
    try {
      const removedReview = await deleteReview(id)
      if (!removedReview) {
        throw new Error('Failed to delete review')
      }
      setReviews((prev) => prev.filter((review) => review._id !== id))
      setTotalPages((prev) => prev - 1)
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }

  const restore = async (id) => {
    try {
      const restoredReview = await restoreReview(id)
      if (!restoredReview) {
        throw new Error('Failed to restore review')
      }
      setReviews((prev) => prev.filter((review) => review._id !== id))
      setTotalPages((prev) => prev - 1)
    } catch (error) {
      console.error('Error restoring review:', error)
      throw error
    }
  }

  return {
    reviews,
    totalPages,
    fetchReview,
    update,
    remove,
    loading,
    restore
  }
}

export default useReviews

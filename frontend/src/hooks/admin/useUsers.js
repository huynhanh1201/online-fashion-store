import { useState } from 'react'
import { getUsers, deleteUser } from '~/services/admin/userService'

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [Loading, setLoading] = useState(false)
  const ROWS_PER_PAGE = 10

  const fetchUsers = async (page = 1, limit = 10, filters = {}) => {
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
      const { users, total } = await getUsers(query)
      setUsers(users)
      setTotalPages(Math.max(1, Math.ceil(total / limit)))
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  const removeUser = async (id, page) => {
    const success = await deleteUser(id)
    if (success) {
      const newPage = page > 1 && users.length === 1 ? page - 1 : page
      fetchUsers(newPage)
    }
  }

  return { users, totalPages, fetchUsers, removeUser, Loading }
}

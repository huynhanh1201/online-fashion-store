import { useState } from 'react'
import { getUsers, deleteUser } from '~/services/admin/userService'

export default function useUsers(limit = 10) {
  const [users, setUsers] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [Loading, setLoading] = useState(false)
  const ROWS_PER_PAGE = 10

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    const { users, total } = await getUsers(page, ROWS_PER_PAGE)
    setUsers(users)
    setTotalPages(Math.max(1, Math.ceil(total / limit)))
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

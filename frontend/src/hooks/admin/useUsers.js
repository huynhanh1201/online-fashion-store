import { useState } from 'react'
import { getUsers, deleteUser, updateUser } from '~/services/admin/userService'

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

  const update = async (id, data) => {
    try {
      const updated = await updateUser(id, data)
      if (!updated) {
        console.error('Cập nhật người dùng thất bại')
        return null
      }
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)))
      return updated
    } catch (err) {
      console.error('Lỗi khi cập nhật người dùng:', err)
      return null
    }
  }

  const removeUser = async (id) => {
    try {
      const result = await deleteUser(id)
      if (!result) {
        console.error('Xoá người dùng thất bại')
        return null
      }
      setUsers((prev) => prev.filter((u) => u._id !== id))
      setTotalPages((prev) => Math.max(1, prev - 1))
      return true
    } catch (err) {
      console.error('Lỗi khi xoá người dùng:', err)
      return false
    }
  }

  return { users, totalPages, fetchUsers, removeUser, Loading, update }
}

import { useState } from 'react'
import {
  getUsers,
  deleteUser,
  updateUser,
  CreateUser,
  RestoreUser
} from '~/services/admin/userService'

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [Loading, setLoading] = useState(false)
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = useState(10)

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

  const add = async (data, filters = {}) => {
    try {
      const newAccount = await CreateUser(data)
      if (!newAccount) {
        console.error('Tạo blog thất bại')
        return null
      }

      setUsers((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [newAccount, ...prev].slice(0, ROWS_PER_PAGE)
        } else if (sort === 'oldest') {
          if (prev.length < ROWS_PER_PAGE) {
            updated = [...prev, newAccount]
          }
        } else {
          updated = [newAccount, ...prev].slice(0, ROWS_PER_PAGE)
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return newAccount
    } catch (err) {
      console.error('Lỗi khi thêm blog:', err)
      return null
    }
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
  const Restore = async (id) => {
    try {
      const result = await RestoreUser(id)
      if (!result) {
        console.error('Khôi phục người dùng thất bại')
        return null
      }
      setUsers((prev) => prev.filter((u) => u._id !== id))
      setTotalPages((prev) => Math.max(1, prev - 1))
      return true
    } catch (err) {
      console.error('Lỗi khi khôi phục người dùng:', err)
      return false
    }
  }

  return {
    users,
    totalPages,
    fetchUsers,
    removeUser,
    Loading,
    update,
    add,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    Restore
  }
}

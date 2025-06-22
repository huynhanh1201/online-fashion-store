import {
  deletePermission,
  addPermission,
  updatePermission,
  getPermissionById,
  getPermissions
} from '~/services/admin/PermissionService.js'
import React from 'react'

const usePermissions = () => {
  const [permissions, setPermissions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [totalPages, setTotalPages] = React.useState(0)

  const fetchPermissions = async (page = 1, limit = 10) => {
    setLoading(true)
    try {
      const response = await getPermissions(page, limit)
      setPermissions(response)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  const add = async (data) => {
    try {
      const response = await addPermission(data)
      setPermissions((prev) => [...prev, response])
      return response
    } catch (err) {
      setError(err)
      throw err
    }
  }
  const update = async (id, data) => {
    try {
      const response = await updatePermission(id, data)
      setPermissions((prev) =>
        prev.map((perm) => (perm._id === id ? response : perm))
      )
      return response
    } catch (err) {
      setError(err)
      throw err
    }
  }
  const remove = async (id) => {
    try {
      await deletePermission(id)
      setPermissions((prev) => prev.filter((perm) => perm._id !== id))
    } catch (err) {
      setError(err)
      throw err
    }
  }
  const getById = async (id) => {
    try {
      const response = await getPermissionById(id)
      return response
    } catch (err) {
      setError(err)
      throw err
    }
  }
  return {
    permissions,
    loading,
    error,
    totalPages,
    fetchPermissions,
    add,
    update,
    remove,
    getById
  }
}
export default usePermissions

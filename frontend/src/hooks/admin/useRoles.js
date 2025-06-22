// hooks/admin/useRoles.js
import { useState } from 'react'
import {
  getRoles,
  getRoleById,
  addRole,
  deleteRole,
  updateRole
} from '~/services/admin/roleService'

const useRoles = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const data = await getRoles()
      setRoles(data)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const add = async (data) => {
    try {
      const newRole = await addRole(data)
      if (newRole) setRoles((prev) => [...prev, newRole])
      return newRole
    } catch (error) {
      console.error('Error adding role:', error)
      return null
    }
  }

  const update = async (id, data) => {
    try {
      const updated = await updateRole(id, data)
      if (updated)
        setRoles((prev) => prev.map((r) => (r._id === id ? updated : r)))
      return updated
    } catch (error) {
      console.error('Error updating role:', error)
      return null
    }
  }

  const remove = async (id) => {
    try {
      await deleteRole(id)
      setRoles((prev) => prev.filter((r) => r._id !== id))
      return true
    } catch (error) {
      console.error('Error deleting role:', error)
      return false
    }
  }

  const fetchById = async (id) => {
    try {
      const role = await getRoleById(id)
      return role
    } catch (error) {
      console.error('Error fetching role by ID:', error)
      return null
    }
  }

  return {
    roles,
    loading,
    fetchRoles,
    fetchById,
    add,
    update,
    remove
  }
}

export default useRoles

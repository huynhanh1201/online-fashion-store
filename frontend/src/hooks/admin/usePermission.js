import React from 'react'
import {
  getPermissions,
  getPermissionById
} from '~/services/admin/permissionService.js'

const usePermission = () => {
  const [permissions, setPermissions] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const fetchPermissions = async () => {
    setLoading(true)
    try {
      const response = await getPermissions()
      setPermissions(response.data)
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissionById = async (id) => {
    try {
      const response = await getPermissionById(id)
      return response.data
    } catch (error) {
      console.error('Failed to fetch permission by ID:', error)
      throw error
    }
  }

  return { permissions, loading, fetchPermissions, fetchPermissionById }
}

export default usePermission

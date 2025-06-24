// // hooks/admin/useRoles.js
// import { useState } from 'react'
// import {
//   getRoles,
//   getRoleById,
//   addRole,
//   deleteRole,
//   updateRole
// } from '~/services/admin/roleService'
//
// const useRoles = () => {
//   const [roles, setRoles] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [totalPages, setTotalPages] = useState(0)
//   const fetchRoles = async () => {
//     setLoading(true)
//     try {
//       const data = await getRoles()
//       console.log('Fetched roles:', data)
//       setRoles(data.data)
//       setTotalPages(data.total || 0)
//     } catch (error) {
//       console.error('Error fetching roles:', error)
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   const add = async (data) => {
//     try {
//       const newRole = await addRole(data)
//       if (newRole) setRoles((prev) => [...prev, newRole])
//       return newRole
//     } catch (error) {
//       console.error('Error adding role:', error)
//       return null
//     }
//   }
//
//   const update = async (id, data) => {
//     try {
//       const updated = await updateRole(id, data)
//       if (updated)
//         setRoles((prev) => prev.map((r) => (r._id === id ? updated : r)))
//       return updated
//     } catch (error) {
//       console.error('Error updating role:', error)
//       return null
//     }
//   }
//
//   const remove = async (id) => {
//     try {
//       await deleteRole(id)
//       setRoles((prev) => prev.filter((r) => r._id !== id))
//       return true
//     } catch (error) {
//       console.error('Error deleting role:', error)
//       return false
//     }
//   }
//
//   const fetchById = async (id) => {
//     try {
//       const role = await getRoleById(id)
//       return role
//     } catch (error) {
//       console.error('Error fetching role by ID:', error)
//       return null
//     }
//   }
//
//   return {
//     totalPages,
//     roles,
//     loading,
//     fetchRoles,
//     fetchById,
//     add,
//     update,
//     remove
//   }
// }
//
// export default useRoles

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
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchRoles = async (page = 1, limit = 10, filters = {}) => {
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
      const { data, total } = await getRoles(query)
      setRoles(data)
      setTotalPages(total || 1)
    } catch (error) {
      console.error('Error fetching roles:', error)
      setRoles([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const add = async (data, filters = {}) => {
    try {
      const newRole = await addRole(data)
      if (!newRole) return null

      setRoles((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [newRole, ...prev].slice(0, 10)
        } else if (sort === 'oldest') {
          if (prev.length < 10) updated = [...prev, newRole]
        } else {
          updated = [newRole, ...prev].slice(0, 10)
        }

        return updated
      })

      setTotalPages((prev) => prev + 1)
      return newRole
    } catch (error) {
      console.error('Error adding role:', error)
      return null
    }
  }

  const update = async (id, data) => {
    try {
      const updatedRole = await updateRole(id, data)
      if (!updatedRole) return null

      setRoles((prev) =>
        prev.map((r) => (r._id === updatedRole._id ? updatedRole : r))
      )
      return updatedRole
    } catch (error) {
      console.error('Error updating role:', error)
      return null
    }
  }

  const remove = async (id) => {
    try {
      const deleted = await deleteRole(id)
      if (!deleted) return null

      setRoles((prev) => prev.filter((r) => r._id !== id))
      setTotalPages((prev) => prev - 1)
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

  const Save = (data) => {
    setRoles((prev) => prev.map((r) => (r._id === data._id ? data : r)))
  }

  return {
    roles,
    totalPages,
    loading,
    fetchRoles,
    fetchById,
    add,
    update,
    remove,
    Save
  }
}

export default useRoles

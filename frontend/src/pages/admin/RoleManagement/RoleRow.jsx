// components/admin/RolePermissionRow.jsx
import React from 'react'
import { TableRow, TableCell, Checkbox } from '@mui/material'

const actions = ['create', 'read', 'update', 'delete']

const RolePermissionRow = ({ permissionGroup, roles }) => {
  return (
    <TableRow>
      <TableCell>{permissionGroup.label}</TableCell>
      {roles.map((role) =>
        actions.map((action) => {
          const permissionKey = `${permissionGroup.key}:${action}`
          const hasPermission = role.permissions.includes(permissionKey)
          return (
            <TableCell key={`${role._id}-${permissionKey}`} align='center'>
              <Checkbox checked={hasPermission} disabled />
            </TableCell>
          )
        })
      )}
    </TableRow>
  )
}

export default RolePermissionRow

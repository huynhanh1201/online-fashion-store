// components/admin/RolePermissionTable.jsx
import React from 'react'
import RolePermissionRow from './RoleRow.jsx'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

const actions = ['create', 'read', 'update', 'delete']
const actionLabels = {
  create: 'Tạo',
  read: 'Xem',
  update: 'Sửa',
  delete: 'Xoá'
}

const RolePermissionTable = ({ roles, permissionsList }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Quyền</TableCell>
          {roles.map((role) => (
            <TableCell key={role._id} colSpan={4} align='center'>
              {role.label}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell></TableCell>
          {roles.map((role) =>
            actions.map((action) => (
              <TableCell key={`${role._id}-${action}`} align='center'>
                {actionLabels[action]}
              </TableCell>
            ))
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {permissionsList.map((permissionGroup) => (
          <RolePermissionRow
            key={permissionGroup.key}
            permissionGroup={permissionGroup}
            roles={roles}
          />
        ))}
      </TableBody>
    </Table>
  )
}

export default RolePermissionTable

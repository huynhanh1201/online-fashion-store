import React from 'react'
import { Box } from '@mui/material'
import PermissionRow from './PermissionRow'

export default function PermissionTable({ data, onReload }) {
  return (
    <Box>
      {data.map((groupItem, idx) => (
        <PermissionRow
          key={idx}
          group={groupItem.group}
          permissions={groupItem.permissions}
          onReload={onReload}
        />
      ))}
    </Box>
  )
}

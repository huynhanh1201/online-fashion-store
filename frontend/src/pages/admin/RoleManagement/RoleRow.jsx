import React from 'react'
import { TableCell, TableRow, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

const formatDateTime = (isoString) => {
  if (!isoString) return 'Không xác định'
  const date = new Date(isoString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  },
  cellPadding: {
    height: 55,
    minHeight: 55,
    maxHeight: 55,
    lineHeight: '49px',
    py: 0,
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle',
    background: '#fff'
  }
}

export default function RoleRow({
  role,
  index,
  columns,
  handleOpenModal,
  filters
}) {
  const { hasPermission } = usePermissions()
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        if (column.id === 'name') {
          const originalName = role.name || 'Không có tên'
          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={originalName}
              onClick={
                hasPermission('role:read')
                  ? () => handleOpenModal('view', role)
                  : null
              }
              sx={{
                ...styles.cellPadding,
                maxWidth: 200,
                display: 'table-cell',
                cursor: hasPermission('role:read') ? 'pointer' : 'default'
              }}
            >
              {originalName}
            </TableCell>
          )
        }
        if (column.id === 'label') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={role?.label || 'Không có tên vai trò'}
              onClick={
                hasPermission('role:read')
                  ? () => handleOpenModal('view', role)
                  : null
              }
              sx={{
                ...styles.cellPadding,
                pr: column.pr,
                cursor: hasPermission('role:read') ? 'pointer' : 'default'
              }}
            >
              {role?.label || 'Không có tên vai trò'}
            </TableCell>
          )
        }

        if (column.id === 'permissionCount') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={`Số lượng quyền: ${role.permissions?.length || 0}`}
              onClick={
                hasPermission('role:read')
                  ? () => handleOpenModal('view', role)
                  : null
              }
              sx={{
                ...styles.cellPadding,
                pr: column.pr,
                cursor: hasPermission('role:read') ? 'pointer' : 'default'
              }}
            >
              {role.permissions?.length || 0}
            </TableCell>
          )
        }

        // Trạng thái
        if (column.id === 'destroy') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Chip
                label={role.destroy ? 'Không hoạt động' : 'Hoạt động'}
                color={role.destroy ? 'error' : 'success'}
                size='medium'
                sx={{ width: '127px', fontWeight: 'bold' }}
              />
            </TableCell>
          )
        }

        // Hành động
        if (column.id === 'action') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Stack direction='row' sx={styles.groupIcon}>
                {hasPermission('role:read') && (
                  <Tooltip title='Xem'>
                    <IconButton
                      onClick={() => handleOpenModal('view', role)}
                      size='small'
                    >
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}
                {filters.destroy === 'true' ? (
                  hasPermission('role:restore') && (
                    <Tooltip title='Khôi phục'>
                      <IconButton
                        onClick={() => handleOpenModal('restore', role)}
                        size='small'
                      >
                        <RestartAltIcon color='success' />
                      </IconButton>
                    </Tooltip>
                  )
                ) : (
                  <>
                    {hasPermission('role:update') && (
                      <Tooltip title='Sửa'>
                        <IconButton
                          onClick={() => handleOpenModal('edit', role)}
                          size='small'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('role:delete') && (
                      <Tooltip title='Xoá'>
                        <IconButton
                          onClick={() => handleOpenModal('delete', role)}
                          size='small'
                        >
                          <DeleteForeverIcon color='error' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
              </Stack>
            </TableCell>
          )
        }

        let value = ''
        if (column.id === 'index') value = index
        else if (['createdAt', 'updatedAt'].includes(column.id))
          value = formatDateTime(role[column.id])
        else value = role[column.id]

        return (
          <TableCell
            key={column.id}
            align={column.align}
            title={typeof value === 'string' ? value : undefined}
            sx={styles.cellPadding}
          >
            {value ?? 'Không có dữ liệu'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

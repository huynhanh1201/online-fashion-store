import React from 'react'
import {
  TableCell,
  TableRow,
  IconButton,
  Stack,
  Chip,
  Avatar,
  Tooltip
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

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
    verticalAlign: 'middle'
  }
}

export default function AccountRow({
  user,
  index,
  columns,
  handleOpenModal,
  permissions = {},
  roles
}) {
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        if (column.id === 'avatar') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                sx={{
                  borderRadius: 0, // hoặc '4px', '50%', v.v.
                  width: 40,
                  height: 40,
                  bgcolor: '#ccc'
                }}
              />
            </TableCell>
          )
        }

        if (column.id === 'name') {
          const originalName = user.name || 'Không có tên'
          const formattedName = originalName
            .split(' ')
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ')

          user.name = originalName // cập nhật lại nếu bạn cần dùng sau

          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={formattedName}
              sx={{
                ...styles.cellPadding,
                maxWidth: 300,
                display: 'table-cell'
              }}
            >
              {formattedName}
            </TableCell>
          )
        }

        if (column.id === 'email') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={user.email}
              sx={{ ...styles.cellPadding, maxWidth: 200 }}
            >
              {user.email || 'Không có email'}
            </TableCell>
          )
        }

        if (column.id === 'role') {
          const roleLabel =
            roles.find((r) => r.name === user?.role)?.label ||
            'Không có vai trò'

          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Chip
                label={roleLabel.toUpperCase()}
                size='large'
                sx={{
                  maxWidth: 300,
                  fontWeight: 800,
                  backgroundColor: '#001f5d',
                  color: '#fff'
                }}
              />
            </TableCell>
          )
        }

        if (column.id === 'action') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Stack direction='row' sx={styles.groupIcon}>
                {permissions.canView && (
                  <Tooltip title='Xem'>
                    <IconButton
                      onClick={() => handleOpenModal('view', user)}
                      size='small'
                    >
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}
                {permissions.canEdit && (
                  <Tooltip title='Sửa'>
                    <IconButton
                      onClick={() => handleOpenModal('edit', user)}
                      size='small'
                    >
                      <BorderColorIcon color='warning' />
                    </IconButton>
                  </Tooltip>
                )}
                {permissions.canDelete && (
                  <Tooltip title='Xoá'>
                    <IconButton
                      onClick={() => handleOpenModal('delete', user)}
                      size='small'
                    >
                      <DeleteForeverIcon color='error' />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </TableCell>
          )
        }

        let value = ''
        if (column.id === 'index') value = index
        else if (['createdAt', 'updatedAt'].includes(column.id))
          value = formatDateTime(user[column.id])
        else value = user[column.id]

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

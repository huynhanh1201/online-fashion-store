import React, { useEffect, useState } from 'react'
import { Stack, IconButton, TableCell, TableRow } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
const formatDateTime = (isoString) => {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const styles = {
  cell: {
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
  },
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'start',
    gap: 1,
    width: '130px'
  }
}

export default function SizeRow({
  size,
  index,
  columns,
  handleOpenModal,
  permissions = {},
  filters
}) {
  const [showRestoreIcon, setShowRestoreIcon] = useState(false)

  useEffect(() => {
    if (filters.destroy === 'true') {
      const timer = setTimeout(() => {
        setShowRestoreIcon(true)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    } else {
      setShowRestoreIcon(true)
    }
  }, [filters.destroy])

  return (
    <TableRow hover>
      {columns.map(({ id, align }) => {
        let content = null

        if (id === 'index') content = index
        else if (id === 'name') {
          const name = size.name || 'Không có tên'
          content = name.toUpperCase()
        } else if (id === 'destroy') {
          content = (
            <Chip
              label={size.destroy ? 'Không hoạt động' : 'Hoạt động'}
              color={size.destroy ? 'error' : 'success'}
              size='large'
              sx={{ width: '127px', fontWeight: '800' }}
            />
          )
        } else if (id === 'createdAt' || id === 'updatedAt') {
          content = formatDateTime(size[id])
        } else if (id === 'action') {
          content = (
            <Stack direction='row' sx={styles.groupIcon}>
              {permissions.canView && (
                <Tooltip title='Xem'>
                  <IconButton
                    onClick={() => handleOpenModal('view', size)}
                    size='small'
                  >
                    <RemoveRedEyeIcon color='primary' />
                  </IconButton>
                </Tooltip>
              )}
              {showRestoreIcon === false ? (
                permissions.canRestore && (
                  <Tooltip title='Khôi phục'>
                    <IconButton
                      onClick={() => handleOpenModal('restore', size)}
                      size='small'
                    >
                      <RestartAltIcon color='success' />
                    </IconButton>
                  </Tooltip>
                )
              ) : (
                <>
                  {permissions.canEdit && (
                    <Tooltip title='Sửa'>
                      <IconButton
                        onClick={() => handleOpenModal('edit', size)}
                        size='small'
                      >
                        <BorderColorIcon color='warning' />
                      </IconButton>
                    </Tooltip>
                  )}
                  {permissions.canDelete && (
                    <Tooltip title='Xoá'>
                      <IconButton
                        onClick={() => handleOpenModal('delete', size)}
                        size='small'
                      >
                        <DeleteForeverIcon color='error' />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Stack>
          )
        } else {
          content = size[id] ?? '—'
        }

        return (
          <TableCell
            key={id}
            align={align || 'left'}
            onClick={
              id === 'name' && permissions.canView
                ? () => handleOpenModal('view', size)
                : undefined
            }
            title={typeof content === 'string' ? content : undefined}
            sx={{
              ...styles.cell,
              ...(id === 'name' && permissions.canView
                ? { cursor: 'pointer' }
                : {})
            }}
          >
            {content}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

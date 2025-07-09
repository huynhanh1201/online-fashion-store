import React from 'react'
import { TableCell, TableRow, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Tooltip from '@mui/material/Tooltip'
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
    justifyContent: 'center',
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

export default function ColorRow({
  color,
  index,
  columns,
  handleOpenModal,
  permissions = {},
  filters
}) {
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        if (column.id === 'name') {
          const originalName = color.name || 'Không có tên'
          const formattedName = originalName
            .split(' ')
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ')

          color.name = originalName // cập nhật lại nếu bạn cần dùng sau

          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={formattedName}
              sx={{
                ...styles.cellPadding,
                maxWidth: 200,
                display: 'table-cell'
              }}
            >
              {formattedName}
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
                label={color.destroy ? 'Không hoạt động' : 'Hoạt động'}
                color={color.destroy ? 'error' : 'success'}
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
                {permissions.canView && (
                  <Tooltip title='Xem'>
                    <IconButton
                      onClick={() => handleOpenModal('view', color)}
                      size='small'
                    >
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}
                {filters.destroy === 'true' ? (
                  permissions.canRestore && (
                    <Tooltip title='Khôi phục'>
                      <IconButton
                        onClick={() => handleOpenModal('restore', color)}
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
                          onClick={() => handleOpenModal('edit', color)}
                          size='small'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                      </Tooltip>
                    )}
                    {permissions.canDelete && (
                      <Tooltip title='Xoá'>
                        <IconButton
                          onClick={() => handleOpenModal('delete', color)}
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

        // Các cột thông tin khác
        let value = ''
        if (column.id === 'index') value = index
        else if (['createdAt', 'updatedAt'].includes(column.id))
          value = formatDateTime(color[column.id])
        else value = color[column.id]

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

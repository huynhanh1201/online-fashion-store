import React from 'react'
import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import Tooltip from '@mui/material/Tooltip'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '—'

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

export default function DiscountRow({
  discount,
  index,
  columns,
  onAction,
  permissions = {},
  filters
}) {
  const remaining = discount.usageLimit - discount.usedCount

  return (
    <TableRow hover>
      {columns.map(({ id, align }) => {
        let content = null

        switch (id) {
          case 'index':
            content = index
            break
          case 'code':
            content = discount.code?.toUpperCase() || '—'
            break
          case 'type':
            content = discount.type === 'fixed' ? 'Giảm theo số tiền' : 'Giảm theo phần trăm'
            break
          case 'amount':
            content =
              discount.type === 'fixed'
                ? `${discount.amount?.toLocaleString('vi-VN')}₫`
                : `${discount.amount}%`
            break
          case 'minOrderValue':
            content = `${discount.minOrderValue?.toLocaleString('vi-VN')}₫`
            break
          case 'usageLimit':
            content = discount.usageLimit
            break
          case 'remaining':
            content = remaining >= 0 ? remaining : 0
            break
          case 'status':
            content = (
              <Chip
                label={discount.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                color={discount.isActive ? 'success' : 'error'}
                size='large'
                sx={{ width: '130px', fontWeight: '800' }}
              />
            )
            break
          case 'validFrom':
            content = formatDate(discount.validFrom)
            break
          case 'validUntil':
            content = formatDate(discount.validUntil)
            break
          case 'action':
            content = (
              <Stack direction='row' sx={styles.groupIcon}>
                {permissions.canView && (
                  <Tooltip title='Xem'>
                    <IconButton
                      onClick={() => onAction('view', discount)}
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
                        onClick={() => onAction('restore', discount)}
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
                          onClick={() => onAction('edit', discount)}
                          size='small'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                      </Tooltip>
                    )}
                    {permissions.canDelete && (
                      <Tooltip title='Xoá'>
                        <IconButton
                          onClick={() => onAction('delete', discount)}
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
            break
          default:
            content = discount[id] ?? '—'
        }

        return (
          <TableCell
            key={id}
            align={align || 'left'}
            onClick={
              id === 'code' && permissions.canView
                ? () => onAction('view', discount)
                : null
            }
            sx={{
              ...styles.cell,
              ...(id === 'index' && StyleAdmin.TableColumnSTT),
              ...(id === 'remaining' && { paddingRight: '72px' }),
              ...(id === 'code' && permissions.canView
                ? { cursor: 'pointer' }
                : {})
            }}
            title={typeof content === 'string' ? content : undefined}
          >
            {content}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

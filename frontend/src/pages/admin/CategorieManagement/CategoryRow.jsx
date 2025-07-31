import React, { useEffect, useMemo } from 'react'
import {
  TableCell,
  TableRow,
  IconButton,
  Stack,
  Typography,
  Box,
  Chip,
  Tooltip
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useNavigate } from 'react-router-dom'
import useCategories from '~/hooks/admin/useCategories'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  },
  cellPadding: {
    height: 54,
    minHeight: 54,
    maxHeight: 54,
    lineHeight: '49px',
    py: 0,
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle',
    background: '#fff '
  }
}

export default function CategoryRow({
  category,
  index,
  columns,
  handleOpenModal,
  permissions = {},
  filters,
  isParentCategory
}) {
  const navigate = useNavigate()
  const { categories, fetchCategories } = useCategories()

  useEffect(() => {
    fetchCategories(1, 100000, { destroy: 'false' })
  }, [])

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        // Xử lý ảnh
        if (column.id === 'image') {
          return (
            <TableCell
              key={column.id}
              align='center'
              onClick={
                permissions.canView
                  ? () => handleOpenModal('view', category)
                  : null
              }
              sx={{
                ...styles.cellPadding,
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                height: 50,
                minHeight: 55,
                maxHeight: 55
              }}
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt='Ảnh danh mục'
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    cursor: permissions.canView ? 'pointer' : 'default'
                  }}
                />
              ) : (
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    p: '0 !important',
                    cursor: 'default',
                    pointerEvents: 'none'
                  }}
                >
                  <ImageNotSupportedIcon
                    sx={{ width: 40, height: 40, p: '0 !important' }}
                  />
                </IconButton>
              )}
            </TableCell>
          )
        }

        // Xử lý hiển thị tên + label "Nhóm" nếu là danh mục cha thực sự
        if (column.id === 'name' || column.id === 'description') {
          if (column.id === 'name') {
            const name = category[column.id] || 'Không có tên'
            category[column.id] = name
              .split(' ')
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(' ')
          }

          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={category[column.id]}
              onClick={
                permissions.canView
                  ? () => handleOpenModal('view', category)
                  : null
              }
              sx={{
                ...styles.cellPadding,
                maxWidth: 200,
                display: 'table-cell',
                cursor: permissions.canView ? 'pointer' : 'default',
                position: 'relative'
              }}
            >
              {column.id === 'name' ? (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    width: 'auto',
                    maxWidth: '100%',
                    height: '39px'
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      pl: 0,
                      pr: !isParentCategory(category._id) ? 5 : 0,
                      position: 'relative',
                      height: 'auto'
                    }}
                  >
                    {category[column.id] || 'Không có tên'}

                    {!isParentCategory(category._id) && (
                      <Box
                        component='span'
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: 7,
                          color: '#f00',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          px: 0.5,
                          height: 20,
                          lineHeight: '20px',
                          borderRadius: 1
                        }}
                      >
                        Nhóm
                      </Box>
                    )}
                  </Typography>
                </Box>
              ) : (
                category[column.id] || 'Không có mô tả'
              )}
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
                label={category[column.id] ? 'Không hoạt động' : 'Hoạt động'}
                color={category[column.id] ? 'error' : 'success'}
                size='large'
                sx={{ width: '127px', fontWeight: '800' }}
              />
            </TableCell>
          )
        }

        // Ngày tạo / cập nhật
        if (column.id === 'createdAt' || column.id === 'updatedAt') {
          const date = new Date(category[column.id])
          const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              {formattedDate}
            </TableCell>
          )
        }

        // Xem sản phẩm thuộc danh mục
        if (column.id === 'more') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={{
                ...styles.cellPadding,
                cursor: 'pointer',
                color: '#1976d2'
              }}
              onClick={() => {
                if (category._id) {
                  navigate(
                    `/admin/product-management?categoryId=${category._id}`
                  )
                }
              }}
            >
              Xem sản phẩm thuộc danh mục này
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
                      onClick={() => handleOpenModal('view', category)}
                      size='small'
                      color='primary'
                    >
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}

                {filters.destroy === 'true' ? (
                  permissions.canRestore && (
                    <Tooltip title='Khôi phục'>
                      <IconButton
                        onClick={() => handleOpenModal('restore', category)}
                        size='small'
                      >
                        <RestartAltIcon color='success' />
                      </IconButton>
                    </Tooltip>
                  )
                ) : (
                  <>
                    {permissions.canEdit && (
                      <Tooltip title='Chỉnh sửa'>
                        <IconButton
                          onClick={() => handleOpenModal('edit', category)}
                          size='small'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                      </Tooltip>
                    )}

                    {permissions.canDelete && (
                      <Tooltip title='Xoá'>
                        <IconButton
                          onClick={() => handleOpenModal('delete', category)}
                          size='small'
                          color='error'
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

        // Mặc định các cột còn lại
        const value = column.id === 'index' ? index : category[column.id]
        return (
          <TableCell
            key={column.id}
            align={column.align}
            title={
              ['name', 'description'].includes(column.id) ? value : undefined
            }
            sx={styles.cellPadding}
          >
            {value ?? 'Không có dữ liệu'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

// VariantsTab.js
import React, { useState, useEffect, useMemo } from 'react'
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Box,
  Button,
  IconButton
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddVariantModal from '~/pages/admin/InventoryManagement/modal/Variant/AddVariantModal.jsx'
import ViewVariantModal from '~/pages/admin/InventoryManagement/modal/Variant/ViewVariantModal.jsx' // Thêm Chart mới
import EditVariantModal from '~/pages/admin/InventoryManagement/modal/Variant/EditVariantModal.jsx' // Thêm Chart mới
import DeleteVariantModal from '~/pages/admin/InventoryManagement/modal/Variant/DeleteVariantModal.jsx'
import RestoreVariantModal from '~/pages/admin/InventoryManagement/modal/Variant/RestoreVariantModal.jsx' // Thêm Chart mới
import AddIcon from '@mui/icons-material/Add'
import FilterVariant from '~/components/FilterAdmin/FilterVariant.jsx'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useProducts from '~/hooks/admin/useProducts.js'
import useColors from '~/hooks/admin/useColor.js'
import useSizes from '~/hooks/admin/useSize.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'
import { useLocation } from 'react-router-dom'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
const VariantsTab = () => {
  const { hasPermission } = usePermissions()
  const {
    variants,
    fetchVariants,
    createNewVariant,
    updateVariantById,
    deleteVariantById,
    loadingVariant,
    totalVariant,
    Save,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    restore
  } = useVariants()
  const { products, fetchProducts } = useProducts()
  const { colors, fetchColors } = useColors()
  const { sizes, fetchSizes } = useSizes()

  const enrichedVariants = useMemo(() => {
    return (variants || []).map((variant) => {
      const product = (products || []).find((p) => p.id === variant.productId)
      return {
        ...variant,
        productName: product ? product.name : 'N/A'
      }
    })
  }, [variants, products])

  const [openAddModal, setOpenAddModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openRestoreModal, setOpenRestoreModal] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [page, setPage] = useState(1)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchFromUrl = queryParams.get('productId') || ''
  const [filter, setFilter] = React.useState({
    destroy: 'false',
    sort: 'newest',
    ...(searchFromUrl ? { productId: searchFromUrl } : {})
  })
  React.useEffect(() => {
    if (searchFromUrl) {
      // Xoá `search` khỏi URL sau khi đã đưa vào filters
      const newParams = new URLSearchParams(location.productId)
      newParams.delete('productId')
      window.history.replaceState({}, '', `${location.pathname}?${newParams}`)
    }
  }, [])
  useEffect(() => {
    fetchProducts(1, 100000, { destroy: 'false' })
    fetchColors(1, 100000, { destroy: 'false' })
    fetchSizes(1, 100000, { destroy: 'false' })
  }, [])
  useEffect(() => {
    fetchVariants(page, ROWS_PER_PAGE, filter)
  }, [page, ROWS_PER_PAGE, filter])
  const handleAddVariant = () => {
    if (hasPermission('variant:create')) {
      setOpenAddModal(true)
    }
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    // fetchVariants(page, rowsPerPage, filter)
  }

  const handleViewVariant = (variant) => {
    if (hasPermission('variant:read')) {
      setSelectedVariant(variant)
      setOpenViewModal(true)
    }
  }

  const handleRestoreVariant = (variant) => {
    if (hasPermission('variant:restore')) {
      setSelectedVariant(variant)
      setOpenRestoreModal(true)
    }
  }

  const handleEditVariant = (variant) => {
    if (hasPermission('variant:update')) {
      setSelectedVariant(variant)
      setOpenEditModal(true)
    }
  }

  const handleDeleteVariant = (variant) => {
    if (hasPermission('variant:delete')) {
      setSelectedVariant(variant)
      setOpenDeleteModal(true)
    }
  }

  const handleCloseViewModal = () => {
    setOpenViewModal(false)
    setSelectedVariant(null)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setSelectedVariant(null)
    // fetchVariants(page, rowsPerPage, filter)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedVariant(null)
    // fetchVariants(page, rowsPerPage, filter)
  }
  const handleCloseRestoreModal = () => {
    setOpenRestoreModal(false)
    setSelectedVariant(null)
    // fetchVariants(page, rowsPerPage, filter)
  }

  const handleSave = async (variant, type, variantId) => {
    if (type === 'add') {
      await createNewVariant(variant, filter)
    } else if (type === 'edit') {
      await updateVariantById(variantId, variant)
    } else if (type === 'delete') {
      await deleteVariantById(variant)
    } else if (type === 'restore') {
      await restore(variant)
    }
  }

  const variantColumns = [
    {
      id: 'index',
      label: 'STT',
      minWidth: 50,
      maxWidth: 50,
      width: 50,
      align: 'center'
    },
    { id: 'sku', label: 'Mã biến thể', minWidth: 100, maxWidth: 130 },
    { id: 'name', label: 'Tên biến thể', minWidth: 200, maxWidth: 200 },
    { id: 'color', label: 'Màu sắc', minWidth: 120 },
    { id: 'size.name', label: 'Kích thước', minWidth: 120 },
    {
      id: 'quantity',
      label: 'Trạng thái trong kho',
      minWidth: 150,
      align: 'right'
    },
    // {
    //   id: 'importPrice',
    //   label: 'Giá nhập',
    //   minWidth: 150,
    //   maxWidth: 150,
    //   align: 'right',
    //   format: (value) => `${value.toLocaleString('vi-VN')}đ`
    // },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 150,
      maxWidth: 150,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}₫`
    },
    {
      id: 'discountPrice',
      label: 'Giảm giá cho biến thế',
      minWidth: 170,
      maxWidth: 170,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}₫`
    },
    {
      id: 'finalSalePrice',
      label: 'Giá bán hiển thị',
      minWidth: 180,
      maxWidth: 180,
      align: 'right',
      pr: 4,
      format: (Me) => `${(Me ?? 0).toLocaleString('vi-VN')}₫`
    },
    {
      id: 'status',
      label: 'Trạng thái biến thể',
      minWidth: 150,
      align: 'start'
    },
    // {
    //   id: 'createdAt',
    //   label: 'Ngày tạo',
    //   minWidth: 150,
    //   align: 'start',
    //   format: (value) => new Date(value).toLocaleDateString('vi-VN')
    // },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
  ]

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filter, newFilters)) {
      setPage(1)
      setFilter(newFilters)
    }
  }
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return ''
    return Number(value).toLocaleString('vi-VN')
  }

  const parseCurrency = (value) => {
    return value.replaceAll('.', '').replace(/[^\d]/g, '') // Loại bỏ dấu . và ký tự khác ngoài số
  }
  const handleChangePage = (event, value) => setPage(value)

  const onChangeRowsPerPage = (newLimit) => {
    setPage(1)
    setROWS_PER_PAGE(newLimit)
  }
  return (
    <RouteGuard requiredPermissions={['admin:access', 'variant:use']}>
      <Paper
        sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
      >
        <TableContainer>
          <Table stickyHeader aria-label='variants table'>
            <TableHead>
              <TableRow>
                <TableCell colSpan={variantColumns.length}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        minWidth: 200
                      }}
                    >
                      <Typography variant='h6' sx={{ fontWeight: '800' }}>
                        Danh Sách Biến Thể
                      </Typography>
                      {hasPermission('variant:create') && (
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleAddVariant}
                          startIcon={<AddIcon />}
                          sx={{
                            textTransform: 'none',
                            width: 100,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'var(--primary-color)',
                            color: '#fff'
                          }}
                        >
                          Thêm
                        </Button>
                      )}
                    </Box>
                    <FilterVariant
                      onFilter={handleFilter}
                      products={products}
                      variants={variants}
                      loading={loadingVariant}
                      fetchVariants={fetchVariants}
                      colors={colors}
                      sizes={sizes}
                      initialSearch={searchFromUrl}
                    />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                {variantColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      minWidth: column.minWidth,
                      width: column.width,
                      px: 1,
                      pr: column.pr,
                      ...(column.maxWidth && { maxWidth: column.maxWidth }),
                      ...(column.id === 'action' && {
                        width: '130px',
                        maxWidth: '130px',
                        paddingLeft: '12px'
                      })
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingVariant ? (
                <TableRow>
                  <TableCell colSpan={variantColumns.length} align='center'>
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : enrichedVariants.length === 0 ? (
                <TableNoneData
                  col={variantColumns.length}
                  message='Không có dữ liệu biến thể.'
                />
              ) : (
                enrichedVariants.map((row, index) => (
                  <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                    {variantColumns.map((column) => {
                      const getValueByPath = (obj, path) =>
                        path
                          .split('.')
                          .reduce(
                            (acc, key) => (acc ? acc[key] : undefined),
                            obj
                          )

                      const { id, align, format } = column
                      const rawValue = id.includes('.')
                        ? getValueByPath(row, id)
                        : row[id]
                      let content = rawValue ?? '—'
                      if (column.id === 'index') {
                        content = (page - 1) * ROWS_PER_PAGE + index + 1
                      }
                      if (id === 'name') {
                        const name = row.name || 'Không có tên sản phẩm'
                        content = name
                          .toLowerCase()
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')
                      }
                      if (format) content = format(rawValue)
                      if (id === 'color') {
                        const colorName = row.color?.name || 'Không có màu sắc'
                        content = colorName
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(' ')
                      }
                      if (id === 'size.name') {
                        content =
                          row.size?.name.toUpperCase() || 'Không có màu sắc'
                      }
                      if (id === 'quantity') {
                        content = (
                          <Chip
                            label={rawValue === 0 ? 'Hết hàng' : 'Còn hàng'}
                            color={rawValue === 0 ? 'error' : 'success'}
                            size='large'
                            sx={{ width: 127, fontWeight: 800 }}
                          />
                        )
                      }
                      if (id === 'status') {
                        content = (
                          <Chip
                            label={
                              row.status === 'draft'
                                ? 'Bản nháp'
                                : row.status === 'active'
                                  ? 'Hoạt động'
                                  : 'Không hoạt động'
                            }
                            color={
                              row.status === 'draft'
                                ? 'default'
                                : row.status === 'active'
                                  ? 'success'
                                  : 'error'
                            }
                            size='large'
                            sx={{ width: 127, fontWeight: 800 }}
                          />
                        )
                      }

                      if (id === 'action') {
                        content = (
                          <Stack
                            direction='row'
                            spacing={1}
                            justifyContent='start'
                          >
                            {hasPermission('variant:read') && (
                              <Tooltip title='Xem'>
                                <IconButton
                                  onClick={() => handleViewVariant(row)}
                                  size='small'
                                >
                                  <RemoveRedEyeIcon color='primary' />
                                </IconButton>
                              </Tooltip>
                            )}
                            {row.destroy ? (
                              hasPermission('variant:restore') && (
                                <Tooltip title='Khôi phục'>
                                  <IconButton
                                    onClick={() => handleRestoreVariant(row)}
                                    size='small'
                                  >
                                    <RestartAltIcon color='success' />
                                  </IconButton>
                                </Tooltip>
                              )
                            ) : (
                              <>
                                {hasPermission('variant:update') && (
                                  <Tooltip title='Sửa'>
                                    <IconButton
                                      onClick={() => handleEditVariant(row)}
                                      size='small'
                                    >
                                      <BorderColorIcon color='warning' />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {hasPermission('variant:delete') && (
                                  <Tooltip title='Xoá'>
                                    <IconButton
                                      onClick={() => handleDeleteVariant(row)}
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
                      }

                      return (
                        <TableCell
                          key={id}
                          align={align || 'left'}
                          title={
                            typeof content === 'string' ? content : undefined
                          }
                          onClick={
                            id === 'sku' ||
                            (id === 'name' && hasPermission('variant:read'))
                              ? () => handleViewVariant(row)
                              : undefined
                          }
                          sx={{
                            height: 55,
                            minHeight: 55,
                            maxHeight: 55,
                            py: 0,
                            px: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            verticalAlign: 'middle',
                            background: '#fff',
                            ...(id === 'sku' || id === 'name'
                              ? { maxWidth: 150, cursor: 'pointer' } // Ẩn tràn nếu mã hoặc tên dài
                              : {}),
                            ...(id === 'finalSalePrice' && { pr: column.pr }),
                            ...(id === 'sku' ||
                              (id === 'name' &&
                                hasPermission('variant:read') && {
                                  cursor: 'pointer'
                                }))
                          }}
                        >
                          {content || '—'}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ background: '#fff' }}
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={totalVariant || 0}
          rowsPerPage={ROWS_PER_PAGE}
          page={page - 1}
          onPageChange={(event, newPage) =>
            handleChangePage(event, newPage + 1)
          } // truyền lại đúng logic cho parent
          onRowsPerPageChange={(event) => {
            const newLimit = parseInt(event.target.value, 10)
            if (onChangeRowsPerPage) {
              onChangeRowsPerPage(newLimit)
            }
          }}
          labelRowsPerPage='Số dòng mỗi trang'
          labelDisplayedRows={({ from, to, count }) => {
            const totalPages = Math.max(1, Math.ceil(count / ROWS_PER_PAGE))
            return `${from}–${to} trên ${count} | Trang ${page} / ${totalPages}`
          }}
          ActionsComponent={TablePaginationActions}
        />

        <PermissionWrapper requiredPermissions={['variant:create']}>
          <AddVariantModal
            open={openAddModal}
            onClose={handleCloseAddModal}
            addVariant={handleSave}
            products={products}
            parseCurrency={parseCurrency}
            formatCurrency={formatCurrency}
            colors={colors}
            sizes={sizes}
            fetchColors={fetchColors}
            fetchSizes={fetchSizes}
          />
        </PermissionWrapper>

        <ViewVariantModal
          open={openViewModal}
          onClose={handleCloseViewModal}
          variant={selectedVariant}
          products={products}
        />

        <PermissionWrapper requiredPermissions={['variant:update']}>
          <EditVariantModal
            open={openEditModal}
            onClose={handleCloseEditModal}
            variant={selectedVariant}
            onUpdateVariant={handleSave}
            products={products}
            parseCurrency={parseCurrency}
            formatCurrency={formatCurrency}
          />
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['variant:delete']}>
          <DeleteVariantModal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            variant={selectedVariant}
            deleteVariant={handleSave}
          />
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['variant:restore']}>
          <RestoreVariantModal
            open={openRestoreModal}
            onClose={handleCloseRestoreModal}
            variant={selectedVariant}
            restoreVariant={handleSave}
          />
        </PermissionWrapper>
      </Paper>
    </RouteGuard>
  )
}

export default VariantsTab

// VariantsTab.js
import React, { useState, useEffect } from 'react'
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
import AddVariantModal from '../modal/Variant/AddVariantModal.jsx'
import ViewVariantModal from '../modal/Variant/ViewVariantModal.jsx' // Thêm modal mới
import EditVariantModal from '../modal/Variant/EditVariantModal.jsx' // Thêm modal mới
import DeleteVariantModal from '../modal/Variant/DeleteVariantModal.jsx'
import AddIcon from '@mui/icons-material/Add'
import FilterVariant from '~/components/FilterAdmin/FilterVariant.jsx'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useProducts from '~/hooks/admin/useProducts.js'
import useColors from '~/hooks/admin/useColor.js'
import useSizes from '~/hooks/admin/useSize.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import Chip from '@mui/material/Chip'

const VariantsTab = () => {
  const {
    variants,
    fetchVariants,
    createNewVariant,
    updateVariantById,
    deleteVariantById,
    loadingVariant,
    totalVariant
  } = useVariants()
  const { products, fetchProducts } = useProducts()
  const { colors, fetchColors } = useColors()
  const { sizes, fetchSizes } = useSizes()

  const enrichedVariants = (variants || []).map((variant) => {
    const product = (products || []).find((p) => p.id === variant.productId)
    return {
      ...variant,
      productName: product ? product.name : 'N/A'
    }
  })

  const [openAddModal, setOpenAddModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filter, setFilter] = useState({})

  useEffect(() => {
    fetchProducts()
    fetchColors()
    fetchSizes()
  }, [])
  useEffect(() => {
    fetchVariants(page, rowsPerPage, filter)
  }, [page, rowsPerPage])
  const handleAddVariant = () => {
    setOpenAddModal(true)
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    fetchVariants(1, rowsPerPage)
  }

  const handleViewVariant = (variant) => {
    setSelectedVariant(variant)
    setOpenViewModal(true)
  }

  const handleEditVariant = (variant) => {
    setSelectedVariant(variant)
    setOpenEditModal(true)
  }

  const handleDeleteVariant = (variant) => {
    setSelectedVariant(variant)
    setOpenDeleteModal(true)
  }

  const handleCloseViewModal = () => {
    setOpenViewModal(false)
    setSelectedVariant(null)
    fetchVariants(1, rowsPerPage)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setSelectedVariant(null)
    fetchVariants(1, rowsPerPage)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedVariant(null)
  }

  const variantColumns = [
    { id: 'sku', label: 'SKU', minWidth: 100 },
    { id: 'name', label: 'Tên biến thể', minWidth: 150 },
    { id: 'color.name', label: 'Màu sắc', minWidth: 100 },
    { id: 'size.name', label: 'Kích thước', minWidth: 100 },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 150,
      align: 'start',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 150,
      align: 'start',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    { id: 'destroy', label: 'Trạng thái', minWidth: 150, align: 'start' },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 150,
      align: 'start',
      format: (value) => new Date(value).toLocaleDateString('vi-VN')
    },
    {
      id: 'updatedAt',
      label: 'Ngày cập nhật',
      minWidth: 150,
      align: 'start',
      format: (value) => new Date(value).toLocaleDateString('vi-VN')
    },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
  ]

  const handleFilter = (newFilters) => {
    setFilter(newFilters)
    if (Object.keys(newFilters).length > 0) {
      fetchVariants(1, rowsPerPage, newFilters)
    }
  }
  const formatCurrency = (value) => {
    if (!value) return ''
    return Number(value).toLocaleString('vi-VN') // Thêm dấu chấm theo chuẩn VNĐ
  }

  const parseCurrency = (value) => {
    return value.replaceAll('.', '').replace(/[^\d]/g, '') // Loại bỏ dấu . và ký tự khác ngoài số
  }
  const handleChangePage = (event, value) => setPage(value)

  const onChangeRowsPerPage = (newLimit) => {
    setPage(1)
    setRowsPerPage(newLimit)
  }
  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
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
                      minWidth: 250
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '800' }}>
                      Danh Sách Biến Thể
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleAddVariant}
                      startIcon={<AddIcon />}
                      sx={{
                        textTransform: 'none',
                        width: 100,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      Thêm
                    </Button>
                  </Box>
                  <FilterVariant
                    onFilter={handleFilter}
                    products={products}
                    variants={variants}
                    loading={loadingVariant}
                    fetchVariants={fetchVariants}
                    colors={colors}
                    sizes={sizes}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {variantColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      paddingLeft: '20px'
                    })
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {enrichedVariants.map((row, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                {variantColumns.map((column) => {
                  let value = column.id.includes('.')
                    ? column.id.split('.').reduce((o, i) => o[i], row)
                    : row[column.id]
                  if (column.id === 'destroy') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Chip
                          label={value ? 'Đã huỷ' : 'Còn hàng'}
                          color={value ? 'error' : 'success'}
                          size='large'
                          sx={{ width: '127px', fontWeight: '800' }}
                        />
                      </TableCell>
                    )
                  }
                  if (column.id === 'action') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <IconButton
                          onClick={() => handleViewVariant(row)}
                          size='small'
                          color='primary'
                        >
                          <RemoveRedEyeIcon color='primary' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditVariant(row)}
                          size='small'
                          color='info'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteVariant(row)}
                          size='small'
                          color='error'
                        >
                          <DeleteForeverIcon color='error' />
                        </IconButton>
                      </TableCell>
                    )
                  }
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value) : value || '—'}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={totalVariant || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => handleChangePage(event, newPage + 1)} // truyền lại đúng logic cho parent
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.ceil(count / rowsPerPage)
          return `${from}–${to} trên ${count} | Trang ${page} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
      />
      <AddVariantModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        addVariant={createNewVariant}
        products={products}
        parseCurrency={parseCurrency}
        formatCurrency={formatCurrency}
        colors={colors}
        sizes={sizes}
        fetchColors={fetchColors}
        fetchSizes={fetchSizes}
      />
      <ViewVariantModal
        open={openViewModal}
        onClose={handleCloseViewModal}
        variant={selectedVariant}
        products={products}
      />
      <EditVariantModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        variant={selectedVariant}
        onUpdateVariant={updateVariantById}
        products={products}
        parseCurrency={parseCurrency}
        formatCurrency={formatCurrency}
      />
      <DeleteVariantModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        variant={selectedVariant}
        deleteVariant={deleteVariantById}
      />
    </Paper>
  )
}

export default VariantsTab

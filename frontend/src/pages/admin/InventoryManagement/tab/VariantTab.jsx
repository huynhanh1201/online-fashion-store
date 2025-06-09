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
import DeleteVariantModal from '../modal/Variant/DeleteVariantModal.jsx' // Thêm modal mới

const VariantsTab = ({
  data,
  products,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  refreshVariants,
  addVariant,
  updateVariant, // Giả định prop mới
  deleteVariant, // Giả định prop mới
  refreshProducts,
  formatCurrency,
  parseCurrency
}) => {
  const enrichedVariants = (data || []).map((variant) => {
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
  useEffect(() => {
    refreshVariants()
    refreshProducts()
  }, [])
  const handleAddVariant = () => {
    setOpenAddModal(true)
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
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
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setSelectedVariant(null)
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
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'center' }
  ]

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
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách biến thể sản phẩm
                  </Typography>
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{ mr: 1 }}
                    onClick={handleAddVariant}
                  >
                    Thêm biến thể
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {variantColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
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
                      {column.format && typeof value === 'number'
                        ? column.format(value)
                        : value || '—'}
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={(e) => onRowsPerPageChange(e, 'variant')}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const actualTo = to > count ? count : to // nếu to vượt quá count thì lấy count
          const actualFrom = from > count ? count : from // nếu from vượt quá count thì lấy count
          return `${actualFrom}–${actualTo} trên ${count !== -1 ? count : `hơn ${actualTo}`}`
        }}
      />
      <AddVariantModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        addVariant={addVariant}
        products={products}
        parseCurrency={parseCurrency}
        formatCurrency={formatCurrency}
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
        onUpdateVariant={updateVariant}
        products={products}
        parseCurrency={parseCurrency}
        formatCurrency={formatCurrency}
      />
      <DeleteVariantModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        variant={selectedVariant}
        deleteVariant={deleteVariant}
      />
    </Paper>
  )
}

export default VariantsTab

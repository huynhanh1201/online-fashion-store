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
  Button
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddVariantModal from '../modal/Variant/AddVariantModal.jsx'
import useColorPalettes from '~/hooks/admin/useColorPalettes.js'
import useSizesPalettes from '~/hooks/admin/useSizePalettes.js'
const VariantsTab = ({
  data,
  products,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  refreshVariants,
  addVariant
}) => {
  const enrichedVariants = (data || []).map((variant) => {
    const product = (products || []).find((p) => p.id === variant.productId)
    return {
      ...variant,
      productName: product ? product.name : 'N/A'
    }
  })

  const { colorPalettes, fetchColorPalettes } = useColorPalettes(products._id)
  const { sizePalettes, fetchSizePalettes } = useSizesPalettes(products._id)
  const [openAddModal, setOpenAddModal] = useState(false)
  useEffect(() => {
    fetchColorPalettes()
    fetchSizePalettes()
  }, [])
  const handleAddVariant = () => {
    setOpenAddModal(true)
    fetchColorPalettes()
    fetchSizePalettes()
    refreshVariants()
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    refreshVariants()
  }
  const variantColumns = [
    { id: 'sku', label: 'SKU', minWidth: 100 },
    { id: 'name', label: 'Tên biến thể', minWidth: 150 },
    { id: 'productName', label: 'Sản phẩm', minWidth: 150 },
    { id: 'color.name', label: 'Màu sắc', minWidth: 100 },
    { id: 'size.name', label: 'Kích thước', minWidth: 100 },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString()}đ`
    },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString()}đ`
    },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]
  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
                    onClick={() => handleAddVariant()}
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
            {enrichedVariants
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  {variantColumns.map((column) => {
                    let value = column.id.includes('.')
                      ? column.id.split('.').reduce((o, i) => o[i], row)
                      : row[column.id]
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <VisibilityIcon />
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
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
        count={enrichedVariants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
      <AddVariantModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        addVariant={addVariant}
        colors={colorPalettes}
        sizes={sizePalettes}
        products={products}
      />
    </Paper>
  )
}

export default VariantsTab

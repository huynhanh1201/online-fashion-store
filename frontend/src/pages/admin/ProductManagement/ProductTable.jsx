// import React from 'react'
// import TableHead from '@mui/material/TableHead'
// import TableBody from '@mui/material/TableBody'
// import Table from '@mui/material/Table'
// import ProductRow from './ProductRow'
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow,
//   StyledTableContainer
// } from '~/assets/StyleAdmin.jsx'
//
// const ProductTable = ({ products, loading, handleOpenModal }) => {
//   return (
//     <>
//       <Table>
//         <TableHead>
//           <StyledTableRow>
//             <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
//               STT
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '50px' }}>Ảnh</StyledTableCell>
//             <StyledTableCell sx={{ width: '100%' }}>Tên</StyledTableCell>
//             <StyledTableCell sx={{ width: '150px', minWidth: '150px' }}>
//               Giá (VNĐ)
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '100px', minWidth: '100px' }}>
//               Số lượng
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '150px', minWidth: '150px' }}>
//               Mô tả
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '250px', minWidth: '250px' }}>
//               Danh mục
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '150px', minWidth: '150px' }}>
//               Trạng thái
//             </StyledTableCell>
//             <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
//               Hành động
//             </StyledTableCell>
//           </StyledTableRow>
//         </TableHead>
//         <TableBody>
//           {loading ? (
//             <StyledTableRow>
//               <StyledTableCell colSpan={10} align='center'>
//                 Đang tải sản phẩm...
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : products.filter((product) => !product.destroy).length === 0 ? (
//             <StyledTableRow>
//               <StyledTableCell colSpan={10} align='center'>
//                 Không có sản phẩm nào.
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : (
//             products
//               .filter((product) => !product.destroy)
//               .map((product, index) => (
//                 <ProductRow
//                   key={product.id || index}
//                   index={index + 1}
//                   product={product}
//                   handleOpenModal={handleOpenModal}
//                 />
//               ))
//           )}
//         </TableBody>
//       </Table>
//     </>
//   )
// }
//
// export default ProductTable

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Paper,
  Box
} from '@mui/material'

import ProductRow from './ProductRow'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import FilterProduct from '~/components/FilterAdmin/FilterPoduct.jsx'
const ProductTable = ({
  products,
  loading,
  page,
  rowsPerPage,
  handleOpenModal,
  addProduct,
  total,
  onPageChange,
  onChangeRowsPerPage,
  categories,
  fetchCategories,
  onFilter
}) => {
  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'image', label: 'Ảnh', minWidth: 70 },
    { id: 'name', label: 'Tên sản phẩm', minWidth: 150 },
    { id: 'exportPrice', label: 'Giá bán', minWidth: 120 },
    { id: 'description', label: 'Mô tả', minWidth: 120 },
    { id: 'category', label: 'Danh mục', minWidth: 120 },
    { id: 'status', label: 'Trạng thái', minWidth: 100 },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'center' }
  ]

  const filtered = products.filter((p) => !p.destroy)

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='product table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      flex: '1'
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '800' }}>
                      Danh Sách Sản Phẩm
                    </Typography>
                    <Button
                      variant='contained'
                      sx={{
                        textTransform: 'none',
                        width: 100,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      startIcon={<AddIcon />}
                      onClick={addProduct}
                    >
                      Thêm
                    </Button>
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', flex: '2' }}
                  >
                    <FilterProduct
                      categories={categories}
                      fetchCategories={fetchCategories}
                      onFilter={onFilter}
                      products={products}
                    />
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((product, idx) => (
                <ProductRow
                  key={product._id || idx}
                  product={product}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  onAction={handleOpenModal}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  )
}

export default ProductTable

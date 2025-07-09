// import React from 'react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Typography,
//   Paper,
//   Box
// } from '@mui/material'
//
// import ProductRow from './ProductRow'
// import AddIcon from '@mui/icons-material/Add'
// import Button from '@mui/material/Button'
// import FilterProduct from '~/components/FilterAdmin/FilterPoduct.jsx'
// const ProductTable = ({
//   products,
//   loading,
//   page,
//   rowsPerPage,
//   handleOpenModal,
//   addProduct,
//   total,
//   onPageChange,
//   onChangeRowsPerPage,
//   categories,
//   fetchCategories,
//   onFilter,
//   fetchProducts
// }) => {
//   const columns = [
//     { id: 'index.jsx', label: 'STT', minWidth: 50, align: 'center' },
//     { id: 'image', label: 'Ảnh', minWidth: 70 },
//     { id: 'productCode', label: 'Mã sản phẩm', minWidth: 150 },
//     { id: 'name', label: 'Tên sản phẩm', minWidth: 350 },
//     { id: 'exportPrice', label: 'Giá bán', minWidth: 150 },
//     { id: 'description', label: 'Mô tả', minWidth: 150 },
//     { id: 'category', label: 'Danh mục', minWidth: 150 },
//     { id: 'status', label: 'Trạng thái', minWidth: 100 },
//     { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
//   ]
//   const filtered = products.filter((p) => !p.destroy)
//
//   return (
//     <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
//       <TableContainer>
//         <Table stickyHeader aria-label='product table'>
//           <TableHead>
//             <TableRow>
//               <TableCell colSpan={columns.length}>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'start'
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       gap: 1,
//                       flex: '1',
//                       minWidth: 250
//                     }}
//                   >
//                     <Typography variant='h6' sx={{ fontWeight: '800' }}>
//                       Danh Sách Sản Phẩm
//                     </Typography>
//                     <Button
//                       variant='contained'
//                       sx={{
//                         textTransform: 'none',
//                         width: 100,
//                         display: 'flex',
//                         alignItems: 'center'
//                       }}
//                       startIcon={<AddIcon />}
//                       onClick={addProduct}
//                     >
//                       Thêm
//                     </Button>
//                   </Box>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center'
//                     }}
//                   >
//                     <FilterProduct
//                       categories={categories}
//                       fetchCategories={fetchCategories}
//                       onFilter={onFilter}
//                       products={products}
//                       fetchProducts={fetchProducts}
//                     />
//                   </Box>
//                 </Box>
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align || 'left'}
//                   sx={{
//                     minWidth: column.minWidth,
//                     ...(column.id === 'action' ? { maxWidth: '150px' } : {})
//                   }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={columns.length} align='center'>
//                   Đang tải...
//                 </TableCell>
//               </TableRow>
//             ) : filtered.length > 0 ? (
//               filtered.map((product, idx) => (
//                 <ProductRow
//                   key={product._id || idx}
//                   product={product}
//                   index.jsx={page * rowsPerPage + idx + 1}
//                   columns={columns}
//                   onAction={handleOpenModal}
//                 />
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} align='center'>
//                   Không có sản phẩm nào.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component='div'
//         count={total || 0}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
//         onRowsPerPageChange={(event) => {
//           const newLimit = parseInt(event.target.value, 10)
//           if (onChangeRowsPerPage) {
//             onChangeRowsPerPage(newLimit)
//           }
//         }}
//         labelRowsPerPage='Số dòng mỗi trang'
//         labelDisplayedRows={({ from, to, count }) =>
//           `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
//         }
//       />
//     </Paper>
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
  Box,
  Button
} from '@mui/material'
import ProductRow from './ProductRow'
import AddIcon from '@mui/icons-material/Add'
import FilterProduct from '~/components/FilterAdmin/FilterPoduct.jsx'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
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
  onFilter,
  fetchProducts,
  permissions = {},
  initialSearch,
  filters
}) => {
  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'image', label: 'Ảnh', minWidth: 100, align: 'start' },
    { id: 'productCode', label: 'Mã sản phẩm', minWidth: 100, align: 'start' },
    { id: 'name', label: 'Tên sản phẩm', minWidth: 250, align: 'start' },
    {
      id: 'category',
      label: 'Danh mục',
      minWidth: 200,
      width: 200,
      align: 'start'
    },
    { id: 'moreVariants', label: 'Biến thể', minWidth: 100, align: 'start' },
    { id: 'exportPrice', label: 'Giá bán', minWidth: 100, align: 'right' },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 150,
      align: 'right',
      pr: 7
    },
    { id: 'description', label: 'Mô tả', minWidth: 150, align: 'start' },
    // { id: 'status', label: 'Trạng thái', minWidth: 130, align: 'start' },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'start' }
  ]

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
                      Danh sách sản phẩm
                    </Typography>
                    {permissions.canCreate && (
                      <Button
                        variant='contained'
                        sx={{
                          textTransform: 'none',
                          width: 100,
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff'
                        }}
                        startIcon={<AddIcon />}
                        onClick={addProduct}
                      >
                        Thêm
                      </Button>
                    )}
                  </Box>
                  <FilterProduct
                    categories={categories}
                    fetchCategories={fetchCategories}
                    onFilter={onFilter}
                    products={products}
                    fetchProducts={fetchProducts}
                    initialSearch={initialSearch}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    width: column.width,
                    px: 1,
                    pr: column.pr,
                    ...(column.id === 'action' && {
                      maxWidth: 130,
                      width: '130px',
                      paddingLeft: '16px'
                    }),
                    ...(column.id === 'index' && { width: 50 })
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id}></TableCell>
                ))}
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product, idx) => (
                <ProductRow
                  key={idx}
                  product={product}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  onAction={handleOpenModal}
                  permissions={permissions}
                  filters={filters}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu sản phẩm.'
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ backgroundColor: '#fff' }}
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // truyền lại đúng logic cho parent
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.ceil(count / rowsPerPage)
          return `${from}–${to} trên ${count} | Trang ${page + 1} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  )
}

export default ProductTable

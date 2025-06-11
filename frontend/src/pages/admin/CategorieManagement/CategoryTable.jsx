// // components/CategoryTable.jsx
// import React from 'react'
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableHead from '@mui/material/TableHead'
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow,
//   StyledTableContainer
// } from '~/assets/StyleAdmin.jsx'
// import CategoryRow from './CategoryRow'
//
// const CategoryTable = ({ categories, loading, handleOpenModal }) => {
//   const FilteredCategories = categories.filter((c) => c.destroy !== true)
//   return (
//     <Table>
//       <TableHead>
//         <StyledTableRow>
//           <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
//           <StyledTableCell sx={{ width: '20%' }}>Tên danh mục</StyledTableCell>
//           <StyledTableCell sx={{ width: '100%' }}>Mô tả</StyledTableCell>
//           <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
//             Hành động
//           </StyledTableCell>
//         </StyledTableRow>
//       </TableHead>
//       <TableBody>
//         {loading ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={4} align='center'>
//               Đang tải danh mục...
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : FilteredCategories.length === 0 ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={4} align='center'>
//               Không có danh mục nào.
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : (
//           FilteredCategories.map((category, idx) => (
//             <CategoryRow
//               key={category._id}
//               category={category}
//               idx={idx}
//               handleOpenModal={handleOpenModal}
//             />
//           ))
//         )}
//       </TableBody>
//     </Table>
//   )
// }
//
// export default CategoryTable

import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Box,
  TablePagination,
  Button
} from '@mui/material'
import CategoryRow from './CategoryRow'
import AddIcon from '@mui/icons-material/Add'
import FilterCategory from '~/components/FilterAdmin/FilterCategory.jsx'
const CategoryTable = ({
  categories,
  page,
  rowsPerPage,
  loading,
  handleOpenModal,
  addCategory,
  onFilter,
  fetchCategories
}) => {
  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'name', label: 'Tên danh mục', minWidth: 200 },
    { id: 'description', label: 'Mô tả', minWidth: 400 },
    {
      id: 'action',
      label: 'Hành động',
      minWidth: 130,
      align: 'center'
    }
  ]
  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='categories table'>
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
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '800' }}>
                      Danh Sách Danh Mục
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={addCategory}
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
                  <FilterCategory
                    onFilter={onFilter}
                    categories={categories}
                    fetchCategories={fetchCategories}
                    loading={loading}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    minWidth: column.minWidth,
                    ...(column.id === 'index' && { width: '50px' }),
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px'
                    })
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
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}></TableCell>
                ))}
              </TableRow>
            ) : categories.length > 0 ? (
              categories.map((category, idx) => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  index={idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có danh mục nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={categories.length || 1}
        rowsPerPage={rowsPerPage || 10}
        page={page || 0}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const actualTo = to > count ? count : to
          const actualFrom = from > count ? count : from
          return `${actualFrom}–${actualTo} trên ${count !== -1 ? count : `hơn ${actualTo}`}`
        }}
      />
    </Paper>
  )
}

export default CategoryTable

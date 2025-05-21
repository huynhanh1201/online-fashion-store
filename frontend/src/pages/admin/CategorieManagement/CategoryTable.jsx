// components/CategoryTable.jsx
import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/assets/StyleAdmin.jsx'
import CategoryRow from './CategoryRow'

const CategoryTable = ({ categories, loading, handleOpenModal }) => {
  const FilteredCategories = categories.filter((c) => c.destroy !== true)
  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell sx={{ width: '20%' }}>Tên danh mục</StyledTableCell>
          <StyledTableCell sx={{ width: '100%' }}>Mô tả</StyledTableCell>
          <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
            Hành động
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={4} align='center'>
              Đang tải danh mục...
            </StyledTableCell>
          </StyledTableRow>
        ) : FilteredCategories.length === 0 ? (
          <StyledTableRow>
            <StyledTableCell colSpan={4} align='center'>
              Không có danh mục nào.
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          FilteredCategories.map((category, idx) => (
            <CategoryRow
              key={category._id}
              category={category}
              idx={idx}
              handleOpenModal={handleOpenModal}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default CategoryTable

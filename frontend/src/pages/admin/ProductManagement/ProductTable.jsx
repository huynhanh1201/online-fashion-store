import React from 'react'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import CircularProgress from '@mui/material/CircularProgress'
import ProductRow from './ProductRow'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/components/StyleAdmin'

import AddIcon from '@mui/icons-material/Add'
const ProductTable = ({ products, loading, handleOpenModal }) => {
  if (loading) return <CircularProgress />

  return (
    <>
      <StyledTableContainer>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
              STT
            </StyledTableCell>
            <StyledTableCell sx={{ width: '50px' }}>Ảnh</StyledTableCell>
            <StyledTableCell sx={{ width: '20%' }}>Tên</StyledTableCell>
            <StyledTableCell sx={{ width: '150px' }}>Giá (VNĐ)</StyledTableCell>
            <StyledTableCell sx={{ width: '70px' }}>Số lượng</StyledTableCell>
            <StyledTableCell sx={{ width: '100%' }}>Mô tả</StyledTableCell>
            <StyledTableCell sx={{ width: '250px' }}>Xuất xứ</StyledTableCell>
            <StyledTableCell sx={{ width: '100px' }}>Danh mục</StyledTableCell>
            <StyledTableCell sx={{ width: '70px' }}>Trạng thái</StyledTableCell>
            <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
              Hành động
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align='center'>
                Đang tải sản phẩm...
              </TableCell>
            </TableRow>
          ) : products.filter((product) => !product.destroy).length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align='center'>
                Không có sản phẩm nào.
              </TableCell>
            </TableRow>
          ) : (
            products
              .filter((product) => !product.destroy)
              .map((product, index) => (
                <ProductRow
                  key={product.id || index}
                  index={index + 1}
                  product={product}
                  handleOpenModal={handleOpenModal}
                />
              ))
          )}
        </TableBody>
      </StyledTableContainer>
    </>
  )
}

export default ProductTable

import React from 'react'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Table from '@mui/material/Table'
import ProductRow from './ProductRow'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/assets/StyleAdmin.jsx'

const ProductTable = ({ products, loading, handleOpenModal }) => {
  return (
    <>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
              STT
            </StyledTableCell>
            <StyledTableCell sx={{ width: '50px' }}>Ảnh</StyledTableCell>
            <StyledTableCell sx={{ width: '100%' }}>Tên</StyledTableCell>
            <StyledTableCell sx={{ width: '150px', minWidth: '150px' }}>
              Giá (VNĐ)
            </StyledTableCell>
            <StyledTableCell sx={{ width: '100px', minWidth: '100px' }}>
              Số lượng
            </StyledTableCell>
            <StyledTableCell sx={{ width: '150px', minWidth: '150px' }}>
              Mô tả
            </StyledTableCell>
            <StyledTableCell sx={{ width: '250px', minWidth: '250px' }}>
              Danh mục
            </StyledTableCell>
            <StyledTableCell sx={{ width: '150px', minWidth: '150px' }}>
              Trạng thái
            </StyledTableCell>
            <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
              Hành động
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <StyledTableRow>
              <StyledTableCell colSpan={10} align='center'>
                Đang tải sản phẩm...
              </StyledTableCell>
            </StyledTableRow>
          ) : products.filter((product) => !product.destroy).length === 0 ? (
            <StyledTableRow>
              <StyledTableCell colSpan={10} align='center'>
                Không có sản phẩm nào.
              </StyledTableCell>
            </StyledTableRow>
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
      </Table>
    </>
  )
}

export default ProductTable

// import React from 'react'
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableHead from '@mui/material/TableHead'
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow,
//   StyledTableContainer
// } from '~/assets/StyleAdmin.jsx'
// import InventoryRow from './InventoryRow'
//
// const InventoryTable = ({ inventories, loading, handleOpenModal }) => {
//   return (
//     <Table>
//       <TableHead>
//         <StyledTableRow>
//           <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
//           <StyledTableCell>Tên sản phẩm</StyledTableCell>
//           <StyledTableCell>phân loại </StyledTableCell>
//           <StyledTableCell>Giá nhập</StyledTableCell>
//           <StyledTableCell>Giá bán</StyledTableCell>
//           <StyledTableCell>Trạng thái</StyledTableCell>
//           <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
//             Hành động
//           </StyledTableCell>
//         </StyledTableRow>
//       </TableHead>
//       <TableBody>
//         {loading ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={9} align='center'>
//               Đang tải dữ liệu kho...
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : inventories.length === 0 ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={9} align='center'>
//               Không có dữ liệu kho.
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : (
//           inventories.map((item, idx) => (
//             <InventoryRow
//               key={item._id}
//               inventory={item}
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
// export default InventoryTable

import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/assets/StyleAdmin.jsx'
import InventoryRow from './InventoryRow'
import { groupBy } from 'lodash'
const InventoryTable = ({ inventories, loading, handleOpenModal }) => {
  const groupedData = Object.values(
    groupBy(inventories, (item) => item.productId._id)
  )
  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>#</StyledTableCell>
          <StyledTableCell sx={{ width: '150px' }}>
            Tên sản phẩm
          </StyledTableCell>
          <StyledTableCell sx={{ width: '150px' }}>Màu sắc</StyledTableCell>
          <StyledTableCell sx={{ width: '150px' }}>Kich thước</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>Số lượng</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>Giá nhập</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>Giá bán</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>Trạng thái</StyledTableCell>
          <StyledTableCell sx={{ width: '220px', maxWidth: '220px' }}>
            Hành động
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={10} align='center'>
              Đang tải dữ liệu kho...
            </StyledTableCell>
          </StyledTableRow>
        ) : inventories.length === 0 ? (
          <StyledTableRow>
            <StyledTableCell colSpan={10} align='center'>
              Không có dữ liệu kho.
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          Object.values(groupedData).map((group, index) => (
            <InventoryRow
              index={index}
              key={group[0]._id}
              inventory={group[0]}
              childrenInventories={group} // truyền toàn bộ group
              handleOpenModal={handleOpenModal}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default InventoryTable

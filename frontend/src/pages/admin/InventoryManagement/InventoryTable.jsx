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
  // ================
  // const data = [
  //   {
  //     '6831811485a5d1d6a736bd75': [
  //       {
  //         _id: '68312205c9153f7bca8fcc8a',
  //         productId: {
  //           _id: '68312205c9153f7bca8fcc82',
  //           name: 'asdasd',
  //           description: 'asdasd',
  //           price: 1232,
  //           quantity: 0,
  //           image: [
  //             'https://res.cloudinary.com/dkwsy9sph/image/upload/v1748050434/product_upload/qqj8j0nnvlxmsmkplafz.webp'
  //           ],
  //           categoryId: '68307c968c717d3d673af4e5',
  //           slug: 'asdasd',
  //           destroy: false,
  //           importPrice: 123213,
  //           exportPrice: 1232,
  //           createdAt: '2025-05-24T01:33:57.741Z',
  //           updatedAt: '2025-05-24T01:33:57.741Z',
  //           __v: 0
  //         }
  //       },
  //       {
  //         _id: '68312205c9153f7bca8fcc8a',
  //         productId: {
  //           _id: '68312205c9153f7bca8fcc82',
  //           name: 'asdasd',
  //           description: 'asdasd',
  //           price: 1232,
  //           quantity: 0,
  //           image: [
  //             'https://res.cloudinary.com/dkwsy9sph/image/upload/v1748050434/product_upload/qqj8j0nnvlxmsmkplafz.webp'
  //           ],
  //           categoryId: '68307c968c717d3d673af4e5',
  //           slug: 'asdasd',
  //           destroy: false,
  //           importPrice: 123213,
  //           exportPrice: 1232,
  //           createdAt: '2025-05-24T01:33:57.741Z',
  //           updatedAt: '2025-05-24T01:33:57.741Z',
  //           __v: 0
  //         }
  //       }
  //     ]
  //   }
  // ]
  // //==================
  // // const result = data.map((item) => {
  // //   const productId = Object.keys(item)[0]
  // // })
  //
  // console.log('inventories: ', data[0]['6831811485a5d1d6a736bd75'])
  // console.log('inventories 2: ', inventories)
  const groupedData = Object.values(
    groupBy(inventories, (item) => item.productId._id)
  )
  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell>Tên sản phẩm</StyledTableCell>
          <StyledTableCell>Màu sắc</StyledTableCell>
          <StyledTableCell>Kich thước</StyledTableCell>
          <StyledTableCell>Số lượng</StyledTableCell>
          <StyledTableCell>Giá nhập</StyledTableCell>
          <StyledTableCell>Giá bán</StyledTableCell>
          <StyledTableCell>Trạng thái</StyledTableCell>
          <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
            Hành động
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={9} align='center'>
              Đang tải dữ liệu kho...
            </StyledTableCell>
          </StyledTableRow>
        ) : inventories.length === 0 ? (
          <StyledTableRow>
            <StyledTableCell colSpan={9} align='center'>
              Không có dữ liệu kho.
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          Object.values(groupedData).map((group) => (
            <InventoryRow
              key={group[0]._id}
              inventory={group[0]}
              childrenInventories={group.slice(1)}
              handleOpenModal={handleOpenModal}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default InventoryTable

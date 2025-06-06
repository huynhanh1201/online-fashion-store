import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Stack
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

// export default function LowStockAlertCard({ data, loading }) {
//   return (
//     <Stack spacing={2}>
//       {data?.map((warehouse, wIndex) => (
//         <Box key={wIndex} sx={{ mb: 3 }}>
//           <Typography variant='h6' sx={{ mb: 1, color: '#5e35b1' }}>
//             Kho: {warehouse.warehouseId}
//           </Typography>
//
//           {warehouse.lowStockVariants?.length > 0 ? (
//             warehouse.lowStockVariants.map((item, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   backgroundColor: '#fce4ec',
//                   borderRadius: 2,
//                   p: 2,
//                   mb: 1.5,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between'
//                 }}
//               >
//                 <Box>
//                   <Typography fontWeight='bold' sx={{ color: '#333' }}>
//                     {item.sku} - {item.name}
//                   </Typography>
//                   <Typography color='text.secondary' fontSize={14}>
//                     {item.quantity === 0
//                       ? 'Hết hàng hoàn toàn'
//                       : `Còn lại: ${item.quantity} sản phẩm (Min: ${item.minQuantity})`}
//                   </Typography>
//                 </Box>
//                 <Button
//                   variant='contained'
//                   sx={{
//                     background: 'linear-gradient(to right, #5e35b1, #7e57c2)',
//                     borderRadius: 4,
//                     textTransform: 'none',
//                     fontWeight: 'bold',
//                     fontSize: 13,
//                     px: 2
//                   }}
//                 >
//                   Tạo Phiếu Nhập
//                 </Button>
//               </Box>
//             ))
//           ) : (
//             <Typography color='text.secondary'>
//               Không có cảnh báo hết hàng
//             </Typography>
//           )}
//         </Box>
//       ))}
//     </Stack>
//   )
// }
export default function LowStockAlertCard({ data, loading }) {
  // Lọc ra các kho có cảnh báo tồn kho thấp
  const filteredWarehouses = (data ?? []).filter(
    (warehouse) => warehouse.lowStockVariants?.length > 0
  )

  return (
    <Stack spacing={2}>
      {filteredWarehouses.length === 0 ? (
        <Typography color='text.secondary'>
          Không có kho nào cần cảnh báo
        </Typography>
      ) : (
        filteredWarehouses.map((warehouse, wIndex) => (
          <Box key={wIndex} sx={{ mb: 3 }}>
            {/*<Typography variant='h6' sx={{ mb: 1, color: '#5e35b1' }}>*/}
            {/*  Kho: {warehouse.warehouseId}*/}
            {/*</Typography>*/}

            {warehouse.lowStockVariants.map((item, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: '#fce4ec',
                  borderRadius: 2,
                  p: 2,
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography fontWeight='bold' sx={{ color: '#333' }}>
                    {item.sku} - {item.name}
                  </Typography>
                  <Typography color='text.secondary' fontSize={14}>
                    {item.quantity === 0
                      ? 'Hết hàng hoàn toàn'
                      : `Còn lại: ${item.quantity} sản phẩm (Min: ${item.minQuantity})`}
                  </Typography>
                </Box>
                <Button
                  variant='contained'
                  sx={{
                    background: 'linear-gradient(to right, #5e35b1, #7e57c2)',
                    borderRadius: 4,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: 13,
                    px: 2
                  }}
                >
                  Tạo Phiếu Nhập
                </Button>
              </Box>
            ))}
          </Box>
        ))
      )}
    </Stack>
  )
}

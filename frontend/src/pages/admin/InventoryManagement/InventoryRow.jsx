// import React from 'react'
// import { Stack, IconButton } from '@mui/material'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
// import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'
//
// const styles = {
//   groupIcon: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%'
//   }
// }
//
// export default function InventoryRow({ inventory, idx, handleOpenModal }) {
//   return (
//     <StyledTableRow>
//       <StyledTableCell sx={{ textAlign: 'center' }}>{idx + 1}</StyledTableCell>
//       <StyledTableCell>
//         {inventory.productId?.name || 'Không xác định'}
//       </StyledTableCell>
//       <StyledTableCell>
//         {inventory.variant?.color?.name} - {inventory.variant?.size?.name} | SL:{' '}
//         {inventory.quantity} | Giá: {inventory.exportPrice?.toLocaleString()}đ
//       </StyledTableCell>
//       <StyledTableCell>
//         {inventory.importPrice?.toLocaleString()}đ
//       </StyledTableCell>
//       <StyledTableCell>
//         {inventory.exportPrice?.toLocaleString()}đ
//       </StyledTableCell>
//       <StyledTableCell>
//         {inventory.status === 'in-stock'
//           ? 'Còn hàng'
//           : inventory.status === 'out-of-stock'
//             ? 'Hết hàng'
//             : 'Ngừng bán'}
//       </StyledTableCell>
//       <StyledTableCell>
//         <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//           <IconButton
//             onClick={() => handleOpenModal('view', inventory)}
//             size='small'
//           >
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('edit', inventory)}
//             size='small'
//           >
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('delete', inventory)}
//             size='small'
//           >
//             <DeleteForeverIcon color='error' />
//           </IconButton>
//         </Stack>
//       </StyledTableCell>
//     </StyledTableRow>
//   )
// }
import React, { useState } from 'react'
import { Stack, IconButton, Box, Typography } from '@mui/material'
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  RemoveRedEye,
  BorderColor,
  DeleteForever
} from '@mui/icons-material'
import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  detailText: {
    fontSize: '0.85rem',
    color: '#555'
  }
}

export default function InventoryRow({
  inventory,
  handleOpenModal,
  childrenInventories
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Dòng chính */}
      <StyledTableRow>
        <StyledTableCell sx={{ textAlign: 'center' }}>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell>
          {inventory.productId?.name || 'Không xác định'}
        </StyledTableCell>

        <StyledTableCell>{inventory.variant?.color?.name}</StyledTableCell>

        <StyledTableCell>{inventory.variant?.size?.name}</StyledTableCell>

        <StyledTableCell>{inventory.quantity}</StyledTableCell>
        <StyledTableCell>
          {inventory.importPrice?.toLocaleString()}đ
        </StyledTableCell>

        <StyledTableCell>
          {inventory.exportPrice?.toLocaleString()}đ
        </StyledTableCell>

        <StyledTableCell>
          {inventory.status === 'in-stock'
            ? 'Còn hàng'
            : inventory.status === 'out-of-stock'
              ? 'Hết hàng'
              : 'Ngừng bán'}
        </StyledTableCell>

        <StyledTableCell>
          <Stack direction='row' spacing={1} sx={styles.groupIcon}>
            <IconButton
              onClick={() => handleOpenModal('view', inventory)}
              size='small'
            >
              <RemoveRedEye color='primary' />
            </IconButton>
            <IconButton
              onClick={() => handleOpenModal('edit', inventory)}
              size='small'
            >
              <BorderColor color='warning' />
            </IconButton>
            <IconButton
              onClick={() => handleOpenModal('delete', inventory)}
              size='small'
            >
              <DeleteForever color='error' />
            </IconButton>
          </Stack>
        </StyledTableCell>
      </StyledTableRow>

      {/* Dòng chi tiết xổ xuống có cùng số cột */}
      {open &&
        childrenInventories.map((inv) => (
          <StyledTableRow key={inv._id}>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>{inv.variant.color.name}</StyledTableCell>
            <StyledTableCell>{inv.variant.size.name}</StyledTableCell>
            <StyledTableCell>{inv.quantity}</StyledTableCell>
            <StyledTableCell>
              {inv.importPrice?.toLocaleString()}đ
            </StyledTableCell>
            <StyledTableCell>
              {inv.exportPrice?.toLocaleString()}đ
            </StyledTableCell>
            <StyledTableCell>
              {inv.status === 'in-stock'
                ? 'Còn hàng'
                : inv.status === 'out-of-stock'
                  ? 'Hết hàng'
                  : 'Ngừng bán'}
            </StyledTableCell>
            <StyledTableCell>
              <Stack direction='row' spacing={1} sx={styles.groupIcon}>
                <IconButton
                  onClick={() => handleOpenModal('view', inv)}
                  size='small'
                >
                  <RemoveRedEye color='primary' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('edit', inv)}
                  size='small'
                >
                  <BorderColor color='warning' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('delete', inv)}
                  size='small'
                >
                  <DeleteForever color='error' />
                </IconButton>
              </Stack>
            </StyledTableCell>
          </StyledTableRow>
        ))}
    </>
  )
}

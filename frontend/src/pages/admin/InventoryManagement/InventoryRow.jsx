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
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
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
  childrenInventories,
  index
}) {
  const [open, setOpen] = useState(false)
  // Lấy danh sách màu không trùng, có thể thêm màu biến thể cha
  const getUniqueColors = () => {
    const colors = [
      inventory.variant?.color?.name,
      ...childrenInventories.map((item) => item.variant?.color?.name)
    ].filter(Boolean)
    return [...new Set(colors)]
  }

  // Lấy danh sách size không trùng, có thể thêm size biến thể cha
  const getUniqueSizes = () => {
    const sizes = [
      inventory.variant?.size?.name,
      ...childrenInventories.map((item) => item.variant?.size?.name)
    ].filter(Boolean)
    return [...new Set(sizes)]
  }

  const uniqueColors = getUniqueColors()
  const uniqueSizes = getUniqueSizes()
  return (
    <>
      {/* Dòng chính */}
      <StyledTableRow>
        <StyledTableCell sx={{ textAlign: 'center' }}>
          {index + 1}
        </StyledTableCell>
        <StyledTableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell
          sx={{
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {inventory.productId?.name || 'Không xác định'}
        </StyledTableCell>

        {/* Hiển thị danh sách màu tổng hợp */}
        <StyledTableCell
          sx={{
            maxWidth: '100px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {uniqueColors.length > 0 ? uniqueColors.join(', ') : '-'}
        </StyledTableCell>

        {/* Hiển thị danh sách size tổng hợp */}
        <StyledTableCell
          sx={{
            maxWidth: '100px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {uniqueSizes.length > 0 ? uniqueSizes.join(', ') : '-'}
        </StyledTableCell>

        <StyledTableCell>{inventory.productId.quantity}</StyledTableCell>
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
              onClick={() => handleOpenModal('add', inventory)}
              size='small'
            >
              <AssignmentAddIcon color='success' />
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
        childrenInventories.map((inv, idx) => (
          <StyledTableRow key={inv._id}>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
              {idx + 1}
            </StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell
              sx={{
                maxWidth: '100px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {inv.variant.color.name}
            </StyledTableCell>
            <StyledTableCell
              sx={{
                maxWidth: '100px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {inv.variant.size.name}
            </StyledTableCell>
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
                  onClick={() => handleOpenModal('in', inventory)}
                  size='small'
                >
                  <LoginIcon color='success' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('out', inventory)}
                  size='small'
                >
                  <LogoutIcon />
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

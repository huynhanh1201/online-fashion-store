import React from 'react'
import { TableRow, TableCell } from '@mui/material'
import dayjs from 'dayjs'

const InventoryLogRow = ({ log }) => {
  console.log('InventoryLogRow:', log)
  return (
    <TableRow>
      <TableCell>{dayjs(log.date).format('DD/MM/YYYY HH:mm')}</TableCell>
      <TableCell>{log.variant?.sku}</TableCell>
      <TableCell>{log.variant?.color}</TableCell>
      <TableCell>{log.variant?.size}</TableCell>
      <TableCell>{log.type}</TableCell>
      <TableCell>{log.source || '-'}</TableCell>
      <TableCell>{log.amount}</TableCell>
      <TableCell>{log.importPrice || '-'}</TableCell>
      <TableCell>{log.exportPrice || '-'}</TableCell>
      <TableCell>{log.note || '-'}</TableCell>
    </TableRow>
  )
}

export default InventoryLogRow

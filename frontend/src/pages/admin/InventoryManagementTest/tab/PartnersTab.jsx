import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material'
import AddPartnerModal from '../modal/Partner/AddPartnerModal.jsx'
const PartnersTab = ({
  data = [],
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  refreshPartners,
  addPartner
}) => {
  const getPartnerTypeLabel = (type) => {
    switch (type) {
      case 'supplier':
        return <Chip label='Nhà cung cấp' color='primary' size='small' />
      case 'customer':
        return <Chip label='Khách hàng' color='success' size='small' />
      case 'both':
        return <Chip label='Khách hàng & NCC' color='warning' size='small' />
      default:
        return <Chip label='Không xác định' size='small' />
    }
  }
  const [openAddDialog, setOpenAddDialog] = React.useState(false)
  const handleAddPartner = () => {
    setOpenAddDialog(true)
  }
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
    refreshPartners()
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Danh sách đối tác</Typography>
        <Button variant='contained' onClick={handleAddPartner}>
          thêm đối tác
        </Button>
      </Box>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>Điện thoại</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((partner, index) => (
              <TableRow key={partner._id || index}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{partner.name || '---'}</TableCell>
                <TableCell>{getPartnerTypeLabel(partner.type)}</TableCell>
                <TableCell>{partner.contact?.phone || '---'}</TableCell>
                <TableCell>{partner.contact?.email || '---'}</TableCell>
              </TableRow>
            ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align='center'>
                Không có dữ liệu đối tác
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component='div'
        count={data.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage='Số dòng mỗi trang'
      />
      <AddPartnerModal
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        addPartner={addPartner}
      />
    </Paper>
  )
}

export default PartnersTab

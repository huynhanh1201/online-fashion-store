import React, { useState, useEffect } from 'react'
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
  Chip,
  IconButton
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPartnerModal from '../modal/Partner/AddPartnerModal.jsx'
import EditPartnerModal from '../modal/Partner/EditPartnerModal.jsx'
import ViewPartnerModal from '../modal/Partner/ViewPartnerModal.jsx'
import DeletePartnerModal from '../modal/Partner/DeletePartnerModal.jsx'

const PartnersTab = ({
  data = [],
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  refreshPartners,
  addPartner,
  updatePartner,
  deletePartner
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

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)

  useEffect(() => {
    refreshPartners()
  }, [])

  const handleAddPartner = () => {
    setOpenAddDialog(true)
  }
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
  }

  const handleEditPartner = (partner) => {
    setSelectedPartner(partner)
    setOpenEditDialog(true)
  }
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    refreshPartners()
  }

  const handleViewPartner = (partner) => {
    setSelectedPartner(partner)
    setOpenViewDialog(true)
  }
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
  }

  const handleDeletePartner = (partner) => {
    setSelectedPartner(partner)
    setOpenDeleteDialog(true)
  }
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
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
          Thêm đối tác
        </Button>
      </Box>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>SĐT</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mã số thuế</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Ngân hàng</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell align='center'>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((partner, index) => {
              const fullAddress = [
                partner.address?.street,
                partner.address?.ward,
                partner.address?.district,
                partner.address?.city
              ]
                .filter(Boolean)
                .join(', ')

              const bankInfo = partner.bankInfo?.accountNumber
                ? `${partner.bankInfo.accountNumber} - ${partner.bankInfo.bankName || ''}`
                : '---'

              return (
                <TableRow key={partner._id || index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{partner.code || '---'}</TableCell>
                  <TableCell>{partner.name || '---'}</TableCell>
                  <TableCell>{getPartnerTypeLabel(partner.type)}</TableCell>
                  <TableCell>{partner.contact?.phone || '---'}</TableCell>
                  <TableCell>{partner.contact?.email || '---'}</TableCell>
                  <TableCell>{partner.taxCode || '---'}</TableCell>
                  <TableCell>{fullAddress || '---'}</TableCell>
                  <TableCell>{bankInfo}</TableCell>
                  <TableCell>
                    {partner.createdAt
                      ? new Date(partner.createdAt).toLocaleDateString()
                      : '---'}
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      size='small'
                      color='primary'
                      onClick={() => handleViewPartner(partner)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size='small'
                      color='info'
                      onClick={() => handleEditPartner(partner)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size='small'
                      color='error'
                      onClick={() => handleDeletePartner(partner)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} align='center'>
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
      <EditPartnerModal
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        partner={selectedPartner}
        updatePartner={updatePartner}
        fetchPartners={refreshPartners}
      />
      <ViewPartnerModal
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        partner={selectedPartner}
      />
      <DeletePartnerModal
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        partner={selectedPartner}
        deletePartner={deletePartner}
      />
    </Paper>
  )
}

export default PartnersTab

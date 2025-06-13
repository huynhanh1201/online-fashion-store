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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddPartnerModal from '../modal/Partner/AddPartnerModal.jsx'
import EditPartnerModal from '../modal/Partner/EditPartnerModal.jsx'
import ViewPartnerModal from '../modal/Partner/ViewPartnerModal.jsx'
import DeletePartnerModal from '../modal/Partner/DeletePartnerModal.jsx'
import AddIcon from '@mui/icons-material/Add'
import FilterPartner from '~/components/FilterAdmin/FilterPartner.jsx'

const PartnersTab = ({
  data = [],
  page,
  rowsPerPage,
  onPageChange,
  loading,
  onChangeRowsPerPage,
  total,
  refreshPartners,
  addPartner,
  updatePartner,
  deletePartner
}) => {
  const getPartnerTypeLabel = (type) => {
    switch (type) {
      case 'supplier':
        return (
          <Chip
            label='Nhà cung cấp'
            color='primary'
            size='large'
            sx={{ width: '120px', fontWeight: '800' }}
          />
        )
      case 'customer':
        return (
          <Chip
            label='Khách hàng'
            color='success'
            size='large'
            sx={{ width: '120px', fontWeight: '800' }}
          />
        )
      case 'both':
        return (
          <Chip
            label='Khách hàng & NCC'
            color='warning'
            size='large'
            sx={{ width: '137px', fontWeight: '800' }}
          />
        )
      default:
        return (
          <Chip
            label='Không xác định'
            size='large'
            sx={{ width: '120px', fontWeight: '800' }}
          />
        )
    }
  }

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [filter, setFilter] = useState({})

  useEffect(() => {
    refreshPartners(page, rowsPerPage, filter)
  }, [page, rowsPerPage])

  const handleFilter = (newFilters) => {
    setFilter(newFilters)
    if (Object.keys(newFilters).length > 0) {
      refreshPartners(1, rowsPerPage, newFilters)
    }
  }
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
  const styles = {
    groupIcon: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }
  }
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            flex: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              minWidth: 250
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: '800' }}>
              Danh Sách Đối tác
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddPartner}
              startIcon={<AddIcon />}
              sx={{
                textTransform: 'none',
                width: 100,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Thêm
            </Button>
          </Box>
          <FilterPartner
            partners={data}
            loading={loading}
            onFilter={handleFilter}
            fetchPartners={refreshPartners}
          />
        </Box>
      </Box>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell sx={{ textAlign: 'center', width: '150px' }}>
              Loại
            </TableCell>
            <TableCell>SĐT</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mã số thuế</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Ngân hàng</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell
              align='center'
              sx={{ minWidth: '130px', width: '130px', maxWidth: '130px' }}
            >
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((partner, index) => {
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
                <TableCell align='center' spacing={1} sx={styles.groupIcon}>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() => handleViewPartner(partner)}
                  >
                    <RemoveRedEyeIcon color='primary' />
                  </IconButton>
                  <IconButton
                    size='small'
                    color='info'
                    onClick={() => handleEditPartner(partner)}
                  >
                    <BorderColorIcon color='warning' />
                  </IconButton>
                  <IconButton
                    size='small'
                    color='error'
                    onClick={() => handleDeletePartner(partner)}
                  >
                    <DeleteForeverIcon color='error' />
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
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
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

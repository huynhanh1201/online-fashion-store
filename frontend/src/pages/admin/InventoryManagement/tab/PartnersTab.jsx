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
import RestorePartnerModal from '../modal/Partner/RestorePartnerModal.jsx'
import AddIcon from '@mui/icons-material/Add'
import FilterPartner from '~/components/FilterAdmin/FilterPartner.jsx'
import usePartner from '~/hooks/admin/Inventory/usePartner.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import { Stack } from '@mui/system'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
const PartnersTab = () => {
  const { hasPermission } = usePermissions()
  const {
    partners,
    fetchPartners,
    createNewPartner,
    updateExistingPartner,
    removePartner,
    loadingPartner,
    totalPartner,
    Save,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    restore
  } = usePartner()
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
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    destroy: 'false',
    sort: 'newest'
  })
  useEffect(() => {
    fetchPartners(page, ROWS_PER_PAGE, filter)
  }, [page, ROWS_PER_PAGE, filter])

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filter, newFilters)) {
      setPage(1)
      setFilter(newFilters)
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
    // fetchPartners(page, rowsPerPage, filter)
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

  const handleRestorePartner = (partner) => {
    setSelectedPartner(partner)
    setOpenRestoreDialog(true)
  }
  const handleCloseRestoreDialog = () => {
    setOpenRestoreDialog(false)
  }

  const handleChangePage = (event, value) => setPage(value)

  const onChangeRowsPerPage = (newLimit) => {
    setPage(1)
    setROWS_PER_PAGE(newLimit)
  }
  const handleSave = async (partner, type, partnerId) => {
    if (type === 'add') {
      await createNewPartner(partner, filter)
    } else if (type === 'edit') {
      await updateExistingPartner(partnerId, partner)
    } else if (type === 'delete') {
      await removePartner(partner)
    } else if (type === 'restore') {
      await restore(partner)
    }
  }
  const partnerColumns = [
    {
      id: 'index',
      label: 'STT',
      minWidth: 50,
      maxWidth: 50,
      width: 50,
      align: 'center'
    },

    { id: 'code', label: 'Mã đối tác', minWidth: 100, maxWidth: 100 },
    { id: 'name', label: 'Tên đối tác', minWidth: 150 },
    {
      id: 'type',
      label: 'Kiểu đối tác',
      minWidth: 160,
      format: (val) => getPartnerTypeLabel(val)
    },
    { id: 'phone', label: 'SĐT', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 180 },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 130,
      format: (val) => (val ? new Date(val).toLocaleDateString('vi-VN') : '—')
    },
    // {
    //   id: 'destroy',
    //   label: 'Trạng thái hoạt động',
    //   minWidth: 150,
    //   format: (val) => (
    //     <Chip
    //       label={val ? 'Không hoạt động' : 'Hoạt động'}
    //       color={val ? 'error' : 'success'}
    //       size='large'
    //       sx={{ width: 127, fontWeight: 800 }}
    //     />
    //   )
    // },
    {
      id: 'action',
      label: 'Hành động',
      minWidth: 150,
      align: 'start'
    }
  ]

  return (
    <Paper
      elevation={3}
      sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
    >
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={partnerColumns.length}
              sx={{ py: 2, background: '#fff' }}
            >
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                sx={{ background: '#fff', borderColor: '#fff' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    flex: 1,
                    background: '#fff'
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
                    {hasPermission('partner:create') && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={handleAddPartner}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: 'none',
                          width: 100,
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff'
                        }}
                      >
                        Thêm
                      </Button>
                    )}
                  </Box>
                  <FilterPartner
                    partners={partners}
                    loading={loadingPartner}
                    onFilter={handleFilter}
                    fetchPartners={fetchPartners}
                  />
                </Box>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            {partnerColumns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
                sx={{
                  minWidth: col.minWidth,
                  height: 57,
                  width: col.width,
                  background: '#fff !important',
                  ...(col.maxWidth && { maxWidth: col.maxWidth }),
                  ...(col.id === 'action' && {
                    width: '130px',
                    maxWidth: '130px',
                    paddingLeft: '20px'
                  }),
                  px: 1
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingPartner ? (
            <TableRow>
              <TableCell colSpan={partnerColumns.length} align='center'>
                Đang tải đối tác...
              </TableCell>
            </TableRow>
          ) : partners.length === 0 ? (
            <TableNoneData
              col={partnerColumns.length}
              message='Không có dữ liệu đối tác.'
            />
          ) : (
            partners.map((row, index) => (
              <TableRow hover key={row._id || index}>
                {partnerColumns.map((col) => {
                  let rawValue
                  const capitalizeWords = (text) =>
                    (text || '')
                      .toLowerCase()
                      .split(' ')
                      .filter(Boolean)
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(' ')

                  switch (col.id) {
                    case 'index':
                      rawValue = (page - 1) * ROWS_PER_PAGE + index + 1
                      break
                    case 'name':
                      rawValue = row.name ? capitalizeWords(row.name) : '—'
                      break
                    case 'phone':
                      rawValue = row.contact?.phone || '—'
                      break
                    case 'email':
                      rawValue = row.contact?.email || '—'
                      break
                    case 'address':
                      rawValue =
                        [
                          row.address?.street,
                          row.address?.ward,
                          row.address?.district,
                          row.address?.city
                        ]
                          .filter(Boolean)
                          .join(', ') || '—'
                      break
                    case 'bank':
                      rawValue = row.bankInfo?.accountNumber
                        ? `${row.bankInfo.accountNumber} - ${row.bankInfo.bankName || ''}`
                        : '—'
                      break
                    default:
                      rawValue = row[col.id] ?? '—'
                  }

                  let content = rawValue

                  if (col.format) content = col.format(rawValue)

                  if (col.id === 'action') {
                    content = (
                      <Stack direction='row' spacing={1} justifyContent='start'>
                        {hasPermission('partner:read') && (
                          <Tooltip title='Xem'>
                            <IconButton
                              onClick={() => handleViewPartner(row)}
                              size='small'
                            >
                              <RemoveRedEyeIcon color='primary' />
                            </IconButton>
                          </Tooltip>
                        )}
                        {String(filter.destroy) === 'true' ? (
                          hasPermission('partner:restore') && (
                            <Tooltip title='Khôi phục'>
                              <IconButton
                                onClick={() => handleRestorePartner(row)}
                                size='small'
                              >
                                <RestartAltIcon color='success' />
                              </IconButton>
                            </Tooltip>
                          )
                        ) : (
                          <>
                            {hasPermission('partner:update') && (
                              <Tooltip title='Sửa'>
                                <IconButton
                                  onClick={() => handleEditPartner(row)}
                                  size='small'
                                >
                                  <BorderColorIcon color='warning' />
                                </IconButton>
                              </Tooltip>
                            )}
                            {hasPermission('partner:delete') && (
                              <Tooltip title='Xoá'>
                                <IconButton
                                  onClick={() => handleDeletePartner(row)}
                                  size='small'
                                >
                                  <DeleteForeverIcon color='error' />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Stack>
                    )
                  }

                  return (
                    <TableCell
                      key={col.id}
                      align={col.align || 'left'}
                      onClick={
                        col.id === 'code' && hasPermission('partner:read')
                          ? () => handleViewPartner(row)
                          : undefined
                      }
                      sx={{
                        background: '#fff',
                        py: 0,
                        px: 1,
                        height: 55,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        ...(col.maxWidth && { maxWidth: col.maxWidth }),
                        ...(col.id === 'code' &&
                          hasPermission('partner:read') && {
                            cursor: 'pointer'
                          })
                      }}
                      title={typeof content === 'string' ? content : undefined}
                    >
                      {content}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        sx={{ background: '#fff' }}
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={totalPartner || 0}
        rowsPerPage={ROWS_PER_PAGE}
        page={page - 1}
        onPageChange={(event, newPage) => handleChangePage(event, newPage + 1)} // truyền lại đúng logic cho parent
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.max(1, Math.ceil(count / ROWS_PER_PAGE))
          return `${from}–${to} trên ${count} | Trang ${page} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
      />

      <AddPartnerModal
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        addPartner={handleSave}
      />
      <EditPartnerModal
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        partner={selectedPartner}
        updatePartner={handleSave}
        fetchPartners={fetchPartners}
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
        deletePartner={handleSave}
      />
      <RestorePartnerModal
        open={openRestoreDialog}
        onClose={handleCloseRestoreDialog}
        partner={selectedPartner}
        restorePartner={handleSave}
      />
    </Paper>
  )
}

export default PartnersTab

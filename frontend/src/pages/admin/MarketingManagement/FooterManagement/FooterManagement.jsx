import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Paper,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { getFooterConfig } from '~/services/admin/webConfig/footerService.js'
import AddFooterModal from './Modal/AddFooterModal.jsx'
import DeleteFooterModal from './Modal/DeleteFooterModal.jsx'
import EditFooterModal from './Modal/EditFooterModal.jsx'

const FooterManagement = () => {
  const [footerData, setFooterData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const footer = await getFooterConfig()
      setFooterData(footer)
    } catch (e) {
      setError(e.message)
      setFooterData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOpenAddModal = () => setOpenAddModal(true)
  const handleCloseAddModal = () => setOpenAddModal(false)

  const handleOpenDeleteModal = () => setOpenDeleteModal(true)
  const handleCloseDeleteModal = () => setOpenDeleteModal(false)

  const handleOpenEditModal = () => setOpenEditModal(true)
  const handleCloseEditModal = () => setOpenEditModal(false)

  const handleSuccess = () => {
    fetchData()
    handleCloseAddModal()
    handleCloseDeleteModal()
    handleCloseEditModal()
  }

  const existingFooter = footerData?.content?.[0]

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 700, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <ImageIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
          Quản lý nội dung chân trang
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Cấu hình và quản lý nội dung chân trang cho website. Chỉ có thể tồn tại một cấu hình duy nhất.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Typography color="error">Error: {error}</Typography>
      )}

      {!loading && !error && (
        <>
          {existingFooter ? (
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell>Logo</TableCell>
                    <TableCell>Giới thiệu</TableCell>
                    <TableCell>Menu</TableCell>
                    <TableCell>Cửa hàng</TableCell>
                    <TableCell>Mạng xã hội</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Avatar src={existingFooter.logo} sx={{ width: 80, height: 80 }} variant="rounded" />
                    </TableCell>
                    <TableCell>
                      {existingFooter.about?.map((a, i) => (
                        <Typography key={i} variant="body2" noWrap>ĐT: {a.phone} - Email: {a.email}</Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {existingFooter.menuColumns?.map((m, i) => (
                        <Typography key={i} variant="body2" noWrap>{m.title}: {m.link}</Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {existingFooter.stores?.map((s, i) => (
                        <Typography key={i} variant="body2" noWrap>{s.name}: {s.address}</Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {existingFooter.socialLinks?.map((s, i) => (
                         <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                           <Avatar src={s.image} sx={{ width: 24, height: 24 }} />
                           <Typography variant="body2">{s.name}</Typography>
                         </Box>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip label={existingFooter.status} color={existingFooter.status === 'Đang sử dụng' ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton onClick={handleOpenEditModal}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={handleOpenDeleteModal} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Chưa có cấu hình chân trang</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Hãy tạo một cấu hình để hiển thị nội dung ở chân trang web của bạn.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddModal}>
                Tạo cấu hình chân trang
              </Button>
            </Paper>
          )}
        </>
      )}

      <AddFooterModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={handleSuccess}
        footerConfig={footerData}
      />
      
      {existingFooter && (
        <>
          <DeleteFooterModal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            onSuccess={handleSuccess}
          />
          <EditFooterModal
            open={openEditModal}
            onClose={handleCloseEditModal}
            onSuccess={handleSuccess}
            initialData={existingFooter}
            footerIndex={0}
          />
        </>
      )}
    </Box>
  )
}

export default FooterManagement

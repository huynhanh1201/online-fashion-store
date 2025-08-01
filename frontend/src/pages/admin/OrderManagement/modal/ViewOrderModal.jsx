import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

import dayjs from 'dayjs'
import styleAdmin from '~/assets/StyleAdmin.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import usePermissions from '~/hooks/usePermissions'
function ViewOrderModal({
  open,
  onClose,
  order,
  histories = [],
  orderDetails = [],
  onUpdate,
  roles
}) {
  const { hasPermission } = usePermissions()
  const [tab, setTab] = useState(0)
  if (!order) return null
  const handleTabChange = (_, newValue) => setTab(newValue)
  const getNextStatus = (currentStatus) => {
    const flow = ['Processing', 'Shipping', 'Shipped', 'Delivered']
    const index = flow.indexOf(currentStatus)
    return index >= 0 && index < flow.length - 1 ? flow[index + 1] : null
  }

  const handleNextStatus = async () => {
    const nextStatus = getNextStatus(order.status)
    if (!nextStatus) return
    try {
      await onUpdate(order._id, { status: nextStatus })
    } catch (error) {
      console.error('Lỗi chuyển trạng thái:', error)
    }
  }

  const renderStatusChip = (status) => {
    const map = {
      Processing: { label: 'Đang xử lý', color: 'info' },
      Shipping: { label: 'Đang vận chuyển', color: 'primary' },
      Shipped: { label: 'Đã gửi hàng', color: 'warning' },
      Delivered: { label: 'Đã giao', color: 'success' },
      Cancelled: { label: 'Đã hủy', color: 'error' },
      Failed: { label: 'Thất bại', color: 'error' }
    }
    const config = map[status] || { label: '—', color: 'default' }
    return (
      <Chip
        label={config.label}
        color={config.color}
        size='large'
        sx={{ width: '140px', fontWeight: 'bold' }}
      />
    )
  }

  const renderStatusLabel = (status) => {
    const map = {
      Processing: 'Đang xử lý',
      Shipping: 'Đang vận chuyển',
      Shipped: 'Đã gửi hàng',
      Delivered: 'Đã giao',
      Cancelled: 'Đã hủy',
      Failed: 'Thất bại'
    }
    return map[status] || status
  }
  const previousStatuses = Array.from(
    new Set(
      histories.map((h) => h.status).filter((s) => s && s !== order.status)
    )
  )

  // Add 'Processing' only if the current status is beyond 'Processing'
  if (
    order.status !== 'Processing' &&
    order.status !== 'Cancelled' &&
    order.status !== 'Failed'
  ) {
    previousStatuses.unshift('Processing')
  }

  const style = {
    nonePadding: {
      py: 1.5
    },
    tableRow: {
      minWidth: 400,
      maxWidth: 400,
      width: 400
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      fullWidth
      PaperProps={{
        sx: {
          height: '95vh',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
      BackdropProps={{ sx: styleAdmin.OverlayModal }}
    >
      <Box>
        <DialogTitle sx={{ py: 1, pl: 3 }}>Thông tin đơn hàng</DialogTitle>

        <DialogActions sx={{ p: 0, justifyContent: 'start', pb: 2, pl: 3 }}>
          <Button
            variant='outlined'
            color='error'
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Box>
      <Divider />
      <DialogContent dividers sx={{ flex: 1, overflowY: 'auto', pt: 0 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            mb: 2,
            borderBottom: '1px solid var(--primary-color)',
            '& .MuiTab-root': { color: '#000', textTransform: 'none' },
            '& .Mui-selected': {
              color: 'var(--primary-color) !important',
              fontWeight: '900'
            },
            '& .MuiTabs-indicator': { backgroundColor: 'var(--primary-color)' }
          }}
        >
          <Tab label='Thông tin đơn hàng' />
          <Tab label='Lịch sử đơn hàng' />
          <Tab label='Danh sách sản phẩm' />
        </Tabs>

        {tab === 0 && (
          <Table sx={style.nonePadding}>
            <TableBody>
              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Mã đơn hàng</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.code || '—'}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Người nhận</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.shippingAddress?.fullName
                    .split(' ')
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(' ') || '—'}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>SĐT</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.shippingAddress?.phone || '—'}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Địa chỉ giao hàng</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.shippingAddress
                    ? `${order.shippingAddress.address}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`
                    : '—'}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Phương thức thanh toán</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.paymentMethod?.toUpperCase() || '—'}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Trạng thái thanh toán</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  <Chip
                    label={
                      order.paymentStatus === 'Pending'
                        ? 'Đang chờ'
                        : order.paymentStatus === 'Completed'
                          ? 'Đã thanh toán'
                          : order.paymentStatus === 'Failed'
                            ? 'Thất bại'
                            : '—'
                    }
                    color={
                      order.paymentStatus === 'Completed'
                        ? 'success'
                        : order.paymentStatus === 'Failed'
                          ? 'error'
                          : 'warning'
                    }
                    size='large'
                    sx={{ width: '120px', fontWeight: '800' }}
                  />
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Trạng thái đơn hàng</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  <Stack direction='row' alignItems='center' spacing={1}>
                    {previousStatuses.map((status, index) => (
                      <React.Fragment key={index}>
                        <Chip
                          label={renderStatusLabel(status)}
                          color={renderStatusChip(status).props.color}
                          size='large'
                          sx={{ width: '137px', fontWeight: '800' }}
                          variant='contained'
                        />

                        {index < previousStatuses.length - 1 && (
                          <ArrowForwardIcon />
                        )}
                      </React.Fragment>
                    ))}
                    {previousStatuses.length > 0 && <ArrowForwardIcon />}
                    {hasPermission('order:update') ? (
                      <>
                        <Chip
                          label={renderStatusLabel(order.status)}
                          color={renderStatusChip(order.status).props.color}
                          size='large'
                          sx={{
                            width: '137px',
                            fontWeight: '800'
                          }}
                        />
                        {getNextStatus(order.status) && (
                          <>
                            <ArrowForwardIcon />
                            <Chip
                              label={renderStatusLabel(
                                getNextStatus(order?.status)
                              )}
                              variant='contained'
                              size='large'
                              sx={{
                                width: '137px',
                                fontWeight: '800'
                              }}
                              color='default'
                              onClick={handleNextStatus}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <Chip
                        label={renderStatusLabel(order.status)}
                        color={renderStatusChip(order.status).props.color}
                        size='large'
                        sx={{ width: '137px', fontWeight: '800' }}
                      />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Giao hàng</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  <Chip
                    label={order.isDelivered ? 'Đã giao' : 'Chưa giao'}
                    color={order.isDelivered ? 'success' : 'default'}
                    size='large'
                    sx={{ width: '137px', fontWeight: '800' }}
                  />
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Giảm giá</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.discountAmount > 0
                    ? `- ${order.discountAmount.toLocaleString()}₫`
                    : 'Không có'}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Tổng tiền</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.total.toLocaleString('vi-VN')}₫
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Ngày tạo</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {dayjs(order.createdAt).format('HH:mm DD/MM/YYYY')}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Ngày cập nhật</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {dayjs(order.updatedAt).format('HH:mm DD/MM/YYYY')}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Lời nhắn</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.note || 'Không có'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {tab === 1 && (
          <Box>
            {histories.length === 0 ? (
              <Typography>Không có lịch sử cập nhật.</Typography>
            ) : (
              histories.map((h) => {
                const roleMap =
                  roles.find((r) => r.name === h?.updatedBy?.role)?.label ||
                  'Không có vai trò'
                return (
                  <Box key={h._id} mb={2} p={1} border={1} borderRadius={2}>
                    <Typography>
                      <Box display='flex' alignItems='center' gap={1}>
                        <strong>Trạng thái:</strong>
                        {renderStatusChip(h.status)}
                      </Box>
                    </Typography>
                    <Typography>
                      <strong>Người cập nhật:</strong>{' '}
                      {h.updatedBy.name
                        .split(' ')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(' ') || ''}
                    </Typography>
                    <Typography>
                      <strong>Quyền: </strong> {roleMap.toUpperCase()}
                    </Typography>
                    <Typography>
                      <strong>Thời gian:</strong>{' '}
                      {dayjs(h.updatedAt).format(' HH:mm DD/MM/YYYY')}
                    </Typography>
                  </Box>
                )
              })
            )}
          </Box>
        )}

        {tab === 2 && (
          <Box>
            {orderDetails.length === 0 ? (
              <Typography>Không có sản phẩm trong đơn hàng.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell align='right'>Số lượng</TableCell>
                    <TableCell align='right'>Đơn giá</TableCell>
                    <TableCell align='right'>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.map((item) => {
                    const ProductName =
                      item.name || item?.productId?.name || 'không có tên'
                    return (
                      <TableRow key={item._id}>
                        <TableCell>
                          {ProductName.split(' ')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(' ') || 'Không có tên'}
                        </TableCell>
                        <TableCell align='right'>
                          {item.quantity.toLocaleString('vi-VN')}
                        </TableCell>
                        <TableCell align='right'>
                          {item.price.toLocaleString('vi-VN')}₫
                        </TableCell>
                        <TableCell align='right'>
                          {item.subtotal.toLocaleString('vi-VN')}₫
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewOrderModal

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

function ViewOrderModal({
  open,
  onClose,
  order,
  histories = [],
  orderDetails = [],
  onUpdate
}) {
  const [tab, setTab] = useState(0)
  if (!order) return null
  const handleTabChange = (_, newValue) => setTab(newValue)
  const getNextStatus = (currentStatus) => {
    const flow = ['Pending', 'Processing', 'Shipped', 'Delivered']
    const index = flow.indexOf(currentStatus)
    return index >= 0 && index < flow.length - 1 ? flow[index + 1] : null
  }

  const handleNextStatus = async () => {
    const nextStatus = getNextStatus(order.status)
    if (!nextStatus) return
    try {
      await onUpdate(order._id, { status: nextStatus }) // bạn có thể gọi API tại đây
    } catch (error) {
      console.error('Lỗi chuyển trạng thái:', error)
    }
  }

  const renderStatusChip = (status) => {
    const map = {
      Pending: { label: 'Đang chờ', color: 'warning' },
      Processing: { label: 'Đang xử lý', color: 'info' },
      Shipping: { label: 'Đang vận chuyển', color: 'primary' },
      Shipped: { label: 'Đã gửi hàng', color: 'primary' },
      Delivered: { label: 'Đã giao', color: 'success' },
      Cancelled: { label: 'Đã hủy', color: 'error' },
      Failed: { label: 'Thất bại', color: 'error' }
    }

    const config = map[status] || { label: '—', color: 'default' }

    return (
      <Chip
        label={config.label}
        color={config.color}
        size='small'
        sx={{ width: '120px', fontWeight: 'bold' }}
      />
    )
  }
  const renderStatusLabel = (status) => {
    const map = {
      Pending: 'Đang chờ',
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
  const style = {
    nonePadding: {
      py: 1.5
    },
    tableRow: {
      minWidth: 200
    }
  }
  const colorOrder = [
    { value: 'Pending', color: 'warning' },
    { value: 'Processing', color: 'info' },
    { value: 'Shipping', color: 'primary' },
    { value: 'Shipped', color: 'success' },
    { value: 'Delivered', color: 'success' },
    { value: 'Cancelled', color: 'error' },
    { value: 'Failed', color: 'error' }
  ]
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      fullWidth
      PaperProps={{
        sx: {
          height: '88vh',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          mt: '87px'
        }
      }}
      BackdropProps={{ sx: styleAdmin.OverlayModal }}
    >
      <Box>
        <DialogTitle sx={{ py: 1, pl: 3 }}>Thông tin đơn hàng</DialogTitle>

        <DialogActions sx={{ p: 0, justifyContent: 'start', pb: 1, pl: 3 }}>
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
            borderBottom: '1px solid #001f5d',
            '& .MuiTab-root': { color: '#000', textTransform: 'none' },
            '& .Mui-selected': {
              color: '#001f5d !important',
              fontWeight: '900'
            },
            '& .MuiTabs-indicator': { backgroundColor: '#001f5d' }
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
                      <Chip
                        key={index}
                        label={renderStatusLabel(status)}
                        color={
                          colorOrder.find((option) => option.value === status)
                            ?.color || 'primary'
                        }
                        size='large'
                        sx={{ width: '120px', fontWeight: '800' }}
                        variant='outlined'
                      />
                    ))}
                    <Chip
                      label={renderStatusLabel(order.status)}
                      color={
                        order.status === 'Cancelled'
                          ? 'error'
                          : order.status === 'Pending'
                            ? 'warning'
                            : order.status === 'Processing'
                              ? 'info'
                              : order.status === 'Shipped'
                                ? 'primary'
                                : order.status === 'Delivered'
                                  ? 'success'
                                  : 'default'
                      }
                      size='large'
                      sx={{ width: '120px', fontWeight: '800' }}
                    />
                    {/*{getNextStatus(order.status) && (*/}
                    {/*  <Chip*/}
                    {/*    icon={<ArrowForwardIcon />}*/}
                    {/*    label={renderStatusLabel(getNextStatus(order.status))}*/}
                    {/*    variant='outlined'*/}
                    {/*    size='large'*/}
                    {/*    sx={{ width: '120px', fontWeight: '800' }}*/}
                    {/*    color='info'*/}
                    {/*    onClick={handleNextStatus}*/}
                    {/*  />*/}
                    {/*)}*/}
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
                    sx={{ width: '120px', fontWeight: '800' }}
                  />
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Giảm giá</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.discountAmount > 0
                    ? `- ${order.discountAmount.toLocaleString()}đ`
                    : 'Không có'}
                </TableCell>
              </TableRow>

              <TableRow sx={style.nonePadding}>
                <TableCell sx={{ ...style.nonePadding, ...style.tableRow }}>
                  <strong>Tổng tiền</strong>
                </TableCell>
                <TableCell sx={style.nonePadding}>
                  {order.total.toLocaleString('vi-VN')}đ
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
              histories.map((h) => (
                <Box key={h._id} mb={2} p={1} border={1} borderRadius={2}>
                  <Typography>
                    <Box display='flex' alignItems='center' gap={1}>
                      <strong>Trạng thái:</strong>
                      {renderStatusChip(h.status)}
                    </Box>
                  </Typography>
                  <Typography>
                    <strong>Ghi chú:</strong> {h.note || 'Không có'}
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
                    <strong>Quyền: </strong>{' '}
                    {h.updatedBy.role === 'admin' ? 'QUẢN TRỊ' : 'KHÁCH HÀNG'}
                  </Typography>
                  <Typography>
                    <strong>Thời gian:</strong>{' '}
                    {dayjs(h.updatedAt).format(' HH:mm DD/MM/YYYY')}
                  </Typography>
                </Box>
              ))
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
                          {item.price.toLocaleString('vi-VN')}đ
                        </TableCell>
                        <TableCell align='right'>
                          {item.subtotal.toLocaleString('vi-VN')}đ
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

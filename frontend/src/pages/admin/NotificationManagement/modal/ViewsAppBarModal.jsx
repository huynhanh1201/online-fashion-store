import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Modal,
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import socket from '~/socket'

dayjs.extend(relativeTime)
dayjs.locale('vi')

// Giả lập danh sách thông báo dài
const notifications = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  type: index % 2 === 0 ? 'system' : 'user',
  title: `Thông báo ${index + 1}`,
  content: `Đây là nội dung của thông báo số ${index + 1}`,
  createdAt: new Date(Date.now() - index * 10000000).toISOString(),
  read: index % 3 === 0
}))

const modalStyle = {
  position: 'absolute',
  top: '67px',
  right: '2%',
  width: 360,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '82vh',
  p: 0
}

const scrollListStyle = {
  overflowY: 'auto',
  padding: 2,
  flexGrow: 1
}

export default function ViewsAppBarModal({ open, handleClose }) {
  const [filter, setFilter] = useState('all')
  const [visibleNotifications, setVisibleNotifications] = useState([])
  const [limit, setLimit] = useState(10)

  const scrollRef = useRef()

  // Kết nối socket
  useEffect(() => {
    socket.connect()
  }, [])

  // Lọc dữ liệu theo filter
  const filtered = useMemo(() => {
    return notifications
      .filter((n) => (filter === 'all' ? true : n.type === filter))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [filter])

  // Cập nhật danh sách hiển thị theo limit
  useEffect(() => {
    setVisibleNotifications(filtered.slice(0, limit))
  }, [filtered, limit])

  // Khi thay đổi filter thì reset limit
  useEffect(() => {
    setLimit(10)
  }, [filter])

  // Xử lý cuộn để tải thêm
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollHeight - scrollTop - clientHeight < 30) {
      // Gần cuối
      setLimit((prev) => {
        if (prev < filtered.length) return prev + 10
        return prev
      })
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableScrollLock
      BackdropProps={{ sx: StyleAdmin.NoneOverlayModal }}
    >
      <Box sx={modalStyle}>
        {/* Header cố định */}
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            borderBottom: '1px solid #eee',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            bgcolor: 'background.paper',
            borderRadius: '8px'
          }}
        >
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='h6'>Thông báo</Typography>
            <Button variant='text' size='small' sx={{ textTransform: 'none' }}>
              <Link to='/admin/notification-management' onClick={handleClose}>
                Xem tất cả
              </Link>
            </Button>
          </Box>
          <Stack direction='row' spacing={1} mt={1}>
            <Chip
              label='Tất cả'
              onClick={() => setFilter('all')}
              color={filter === 'all' ? 'primary' : 'default'}
            />
            <Chip
              label='Hệ thống'
              onClick={() => setFilter('system')}
              color={filter === 'system' ? 'primary' : 'default'}
            />
            <Chip
              label='Người dùng'
              onClick={() => setFilter('user')}
              color={filter === 'user' ? 'primary' : 'default'}
            />
          </Stack>
        </Box>

        {/* Danh sách cuộn */}
        <Box sx={scrollListStyle} ref={scrollRef} onScroll={handleScroll}>
          {visibleNotifications.map((item) => (
            <Box
              key={item.id}
              mb={2}
              sx={{
                backgroundColor: item.read ? '#fafafa' : '#fff5f5',
                borderRadius: 2,
                p: 1.5
              }}
            >
              <Stack direction='row' spacing={2} alignItems='center'>
                <Avatar>{item.type === 'system' ? 'S' : 'U'}</Avatar>
                <Box flex={1}>
                  <Typography fontWeight='bold'>{item.title}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {item.content}
                  </Typography>
                  <Stack direction='row' justifyContent='space-between'>
                    <Typography variant='caption' color='text.disabled'>
                      {dayjs(item.createdAt).fromNow()}
                    </Typography>
                    {!item.read && (
                      <FiberManualRecordIcon fontSize='small' color='primary' />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          ))}
          {visibleNotifications.length === 0 && (
            <Typography variant='body2' align='center' color='text.secondary'>
              Không có thông báo nào.
            </Typography>
          )}
        </Box>
        <Button
          variant='text'
          size='small'
          sx={{
            minHeight: 50,
            maxHeight: 50,
            height: 50,
            borderTop: '1px solid #ccc',
            textTransform: 'none'
          }}
        >
          <Link to='/admin/notification-management' onClick={handleClose}>
            Xem tất cả thông báo
          </Link>
        </Button>
      </Box>
    </Modal>
  )
}

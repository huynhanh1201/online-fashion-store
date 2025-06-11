// ViewsAppBarModal.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Modal,
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  Stack,
  Button,
  ListItemButton
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
dayjs.extend(relativeTime)
dayjs.locale('vi') // set ngôn ngữ là tiếng Việt
const notifications = [
  {
    id: 1,
    type: 'system',
    title: 'Bài học Tóm tắt chương',
    content: 'Một bài học mới đã được thêm vào khoá học JavaScript.',
    createdAt: '2025-03-12T12:00:18.553Z',
    read: false
  },
  {
    id: 2,
    type: 'user',
    title: 'Thông báo từ giảng viên',
    content: 'Bạn có bài kiểm tra cần hoàn thành trước ngày mai.',
    createdAt: '2025-03-12T12:00:18.553Z',
    read: true
  },
  {
    id: 3,
    type: 'system',
    title: 'Cập nhật khóa học',
    content: 'Chúng tôi vừa cập nhật nội dung chương 3.',
    createdAt: '2025-03-12T12:00:18.553Z',
    read: false
  },
  {
    id: 4,
    type: 'user',
    title: 'Tin nhắn từ trợ giảng',
    content: 'Vui lòng đọc tài liệu đính kèm trước buổi học tới.',
    createdAt: '2025-03-12T12:00:18.553Z',
    read: true
  },
  {
    id: 5,
    type: 'system',
    title: 'Bài học Tóm tắt chương',
    content: 'Một bài học mới đã được thêm vào khoá học JavaScript.',
    createdAt: '2025-03-12T12:00:18.553Z',
    read: false
  },
  {
    id: 6,
    type: 'user',
    title: 'Thông báo từ giảng viên',
    content: 'Bạn có bài kiểm tra cần hoàn thành trước ngày mai.',
    createdAt: '2025-03-12T12:00:18.553Z',
    read: true
  },
  {
    id: 7,
    type: 'system',
    title: 'Cập nhật khóa học',
    content: 'Chúng tôi vừa cập nhật nội dung chương 3.',
    createdAt: '2025-03-12T12:00:18.553Z',
    read: false
  },
  {
    id: 8,
    type: 'user',
    title: 'Tin nhắn từ trợ giảng',
    content: 'Vui lòng đọc tài liệu đính kèm trước buổi học tới.',
    createdAt: '2025-06-06T11:56:40.306Z',
    read: false
  }
]

const modalStyle = {
  position: 'absolute',
  top: '10%',
  right: '2%',
  width: 360,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
  maxHeight: '82vh',
  overflowY: 'auto'
}

import socket from '~/socket'
import { useEffect } from 'react'

export default function ViewsAppBarModal({ open, handleClose }) {
  // =========TEST WEBSOCKET==============
  useEffect(() => {
    socket.connect()
  }, [])
  // =========TEST WEBSOCKET==============

  const [filter, setFilter] = useState('all')
  // const timeAgo = dayjs(notifications.createdAt).fromNow()
  const filtered = notifications
    .filter((n) => (filter === 'all' ? true : n.type === filter))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

  return (
    <Modal open={open} onClose={handleClose} disableScrollLock>
      <Box sx={modalStyle}>
        <Box display='flex' justifyContent='space-between' mb={2}>
          <Typography variant='h6'>Thông báo</Typography>
          <Button variant='text' size='small'>
            <Link to='/admin/notification-management' onClick={handleClose}>
              {' '}
              Xem tất cả thông báo
            </Link>
          </Button>
        </Box>

        <Stack direction='row' spacing={1} mb={2}>
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

        {filtered.map((item) => (
          <Box
            key={item.id}
            mb={2}
            sx={{
              backgroundColor: item.read ? '#fafafa' : '#fff5f5',
              borderRadius: 2,
              p: 1.5,
              mb: 1.5,
              position: 'relative'
            }}
          >
            <Stack
              direction='row'
              spacing={2}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
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
      </Box>
    </Modal>
  )
}

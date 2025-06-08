// NotificationsPage.jsx
import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  Chip,
  Pagination
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
dayjs.extend(relativeTime)
dayjs.locale('vi') // set ngôn ngữ là tiếng Việt
const allNotifications = [
  // Lặp giả dữ liệu nhiều thông báo để phân trang
  ...Array(23)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      type: i % 2 === 0 ? 'system' : 'user',
      title: `Thông báo #${i + 1}`,
      content: 'Đây là nội dung của thông báo mẫu.',
      time: '2 tháng trước',
      read: i % 3 === 0
    }))
]

export default function NotificationManagement() {
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // const filtered = allNotifications.filter((n) =>
  //   filter === 'all' ? true : n.type === filter
  // )
  const filtered = allNotifications
    .filter((n) => (filter === 'all' ? true : n.type === filter))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <Box p={3} fullWidth mx='auto'>
      <Typography variant='h5' mb={2}>
        Tất cả thông báo
      </Typography>

      <Stack direction='row' spacing={1} mb={2}>
        <Chip
          label='Tất cả'
          onClick={() => {
            setFilter('all')
            setPage(1)
          }}
          color={filter === 'all' ? 'primary' : 'default'}
        />
        <Chip
          label='Hệ thống'
          onClick={() => {
            setFilter('system')
            setPage(1)
          }}
          color={filter === 'system' ? 'primary' : 'default'}
        />
        <Chip
          label='Người dùng'
          onClick={() => {
            setFilter('user')
            setPage(1)
          }}
          color={filter === 'user' ? 'primary' : 'default'}
        />
      </Stack>

      {paged.map((item) => (
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
              <Typography variant='body2'>{item.content}</Typography>
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

      <Pagination
        count={Math.ceil(filtered.length / pageSize)}
        page={page}
        onChange={(e, value) => setPage(value)}
        color='primary'
      />
    </Box>
  )
}

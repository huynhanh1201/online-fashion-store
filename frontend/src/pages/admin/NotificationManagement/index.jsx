import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button } from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
dayjs.extend(relativeTime)
dayjs.locale('vi')

const allNotifications = [
  ...Array(100)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      type: i % 2 === 0 ? 'system' : 'user',
      title: `Thông báo #${i + 1}`,
      content: 'Đây là nội dung của thông báo mẫu.',
      createdAt: dayjs().subtract(i, 'day').toISOString(),
      read: i % 3 === 0
    }))
]

export default function NotificationManagement() {
  const [filter, setFilter] = useState('all')
  const [readStatus, setReadStatus] = useState('all')
  const [sortOrder, setSortOrder] = useState('desc')
  const [displayCount, setDisplayCount] = useState(10)
  const observerRef = useRef(null)
  const navigate = useNavigate()

  const filtered = allNotifications
    .filter((n) => (filter === 'all' ? true : n.type === filter))
    .filter((n) =>
      readStatus === 'all' ? true : readStatus === 'read' ? n.read : !n.read
    )
    .sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    )

  const visibleItems = filtered.slice(0, displayCount)

  // IntersectionObserver để tự động tải thêm
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting) {
          setDisplayCount((prev) => Math.min(prev + 10, filtered.length))
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      }
    )
    if (observerRef.current) observer.observe(observerRef.current)

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [filtered.length])

  return (
    <Box p={3} mx='auto' pt={0}>
      <Button
        variant='outlined'
        color='error'
        size='small'
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ textTransform: 'none', mr: 2, mb: 2 }}
      >
        Quay lại
      </Button>
      <Typography variant='h5' mb={2}>
        Tất cả thông báo
      </Typography>

      <Stack direction='row' spacing={1} mb={2} flexWrap='wrap'>
        <Chip
          label='Tất cả'
          onClick={() => {
            setFilter('all')
            setDisplayCount(10)
          }}
          color={filter === 'all' ? 'primary' : 'default'}
        />
        <Chip
          label='Hệ thống'
          onClick={() => {
            setFilter('system')
            setDisplayCount(10)
          }}
          color={filter === 'system' ? 'primary' : 'default'}
        />
        <Chip
          label='Người dùng'
          onClick={() => {
            setFilter('user')
            setDisplayCount(10)
          }}
          color={filter === 'user' ? 'primary' : 'default'}
        />
      </Stack>

      <Stack direction='row' spacing={4} mb={2} alignItems='center'>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Trạng thái đọc</FormLabel>
          <RadioGroup
            row
            value={readStatus}
            onChange={(e) => {
              setReadStatus(e.target.value)
              setDisplayCount(10)
            }}
          >
            <FormControlLabel value='all' control={<Radio />} label='Tất cả' />
            <FormControlLabel value='read' control={<Radio />} label='Đã đọc' />
            <FormControlLabel
              value='unread'
              control={<Radio />}
              label='Chưa đọc'
            />
          </RadioGroup>
        </FormControl>

        <FormControl size='small'>
          <FormLabel>Sắp xếp</FormLabel>
          <Select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value)
              setDisplayCount(10)
            }}
          >
            <MenuItem value='desc'>Mới nhất</MenuItem>
            <MenuItem value='asc'>Cũ nhất</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {visibleItems.map((item) => (
        <Box
          key={item.id}
          sx={{
            backgroundColor: item.read ? '#fafafa' : '#fff5f5',
            borderRadius: 2,
            p: 1.5,
            mb: 1.5,
            position: 'relative'
          }}
        >
          <Stack direction='row' spacing={2} alignItems='center'>
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

      {/* Thẻ theo dõi cuối trang */}
      <div ref={observerRef} style={{ height: '1px' }} />
    </Box>
  )
}

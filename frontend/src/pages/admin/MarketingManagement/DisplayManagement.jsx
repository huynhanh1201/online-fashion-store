import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const mockBanners = [
  {
    id: 'bnr001',
    title: 'Banner Sale Hè',
    imageUrl: '/uploads/summer.jpg',
    link: '/khuyen-mai/summer',
    position: 'Trang chủ',
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    visible: true
  },
  {
    id: 'bnr002',
    title: 'Back to School Banner',
    imageUrl: '/uploads/back2school.jpg',
    link: '/khuyen-mai/back2school',
    position: 'Trang sản phẩm',
    startDate: '2025-07-15',
    endDate: '2025-07-31',
    visible: false
  }
];

const DisplayManagement = () => {
  return (
    <Box mt={2}>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Thêm banner mới
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Vị trí</TableCell>
              <TableCell>Liên kết</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockBanners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.position}</TableCell>
                <TableCell>{banner.link}</TableCell>
                <TableCell>{banner.startDate} - {banner.endDate}</TableCell>
                <TableCell>{banner.visible ? 'Hiển thị' : 'Ẩn'}</TableCell>
                <TableCell>
                  <Button size="small">Sửa</Button>
                  <Button size="small" color="error">Xoá</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DisplayManagement;
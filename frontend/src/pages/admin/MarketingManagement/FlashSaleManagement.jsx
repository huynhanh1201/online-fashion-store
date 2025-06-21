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

const mockFlashSales = [
  {
    id: 'fs001',
    productName: 'Áo thun nam trắng',
    originalPrice: 250000,
    flashPrice: 99000,
    stock: 100,
    startTime: '2025-06-25T09:00:00',
    endTime: '2025-06-25T11:00:00',
    status: 'Đã lên lịch'
  },
  {
    id: 'fs002',
    productName: 'Giày sneaker nữ',
    originalPrice: 450000,
    flashPrice: 199000,
    stock: 50,
    startTime: '2025-07-01T12:00:00',
    endTime: '2025-07-01T14:00:00',
    status: 'Sắp diễn ra'
  }
];

const FlashSaleManagement = () => {
  const formatTime = (isoString) => new Date(isoString).toLocaleString('vi-VN');

  return (
    <Box mt={2}>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Thêm Flash Sale mới
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Giá gốc</TableCell>
              <TableCell>Giá Flash</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockFlashSales.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.originalPrice.toLocaleString()}đ</TableCell>
                <TableCell>{item.flashPrice.toLocaleString()}đ</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  {formatTime(item.startTime)} - {formatTime(item.endTime)}
                </TableCell>
                <TableCell>{item.status}</TableCell>
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

export default FlashSaleManagement;

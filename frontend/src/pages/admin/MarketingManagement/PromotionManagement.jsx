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

const mockVouchers = [
  {
    id: 'SUMMER20K',
    discountType: 'fixed',
    amount: 20000,
    minOrderValue: 199000,
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    status: 'Đang hoạt động'
  },
  {
    id: 'BACK2SCHOOL10',
    discountType: 'percent',
    amount: 10,
    minOrderValue: 100000,
    startDate: '2025-07-15',
    endDate: '2025-07-31',
    status: 'Sắp diễn ra'
  }
];

const PromotionManagement = () => {
  return (
    <Box mt={2}>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Tạo mã giảm giá mới
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Điều kiện</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockVouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>{voucher.id}</TableCell>
                <TableCell>{voucher.discountType === 'fixed' ? 'Giảm tiền' : 'Giảm %'}</TableCell>
                <TableCell>
                  {voucher.discountType === 'fixed'
                    ? `${voucher.amount.toLocaleString()}đ`
                    : `${voucher.amount}%`}
                </TableCell>
                <TableCell>
                  Đơn từ {voucher.minOrderValue.toLocaleString()}đ
                </TableCell>
                <TableCell>{voucher.startDate} - {voucher.endDate}</TableCell>
                <TableCell>{voucher.status}</TableCell>
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

export default PromotionManagement;
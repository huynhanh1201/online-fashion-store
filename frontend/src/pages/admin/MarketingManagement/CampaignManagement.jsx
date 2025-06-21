import React from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const mockCampaigns = [
  {
    id: 'cmp001',
    name: 'Sale Hè 2025',
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    status: 'Đang hoạt động',
    bannerCount: 3,
    voucherCount: 10
  },
  {
    id: 'cmp002',
    name: 'Back To School',
    startDate: '2025-07-15',
    endDate: '2025-07-31',
    status: 'Sắp diễn ra',
    bannerCount: 2,
    voucherCount: 5
  }
];

const CampaignManagement = () => {
  return (
    <Box mt={2}>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Tạo chiến dịch mới
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên chiến dịch</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Số banner</TableCell>
              <TableCell>Số mã giảm</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockCampaigns.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.startDate} - {row.endDate}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.bannerCount}</TableCell>
                <TableCell>{row.voucherCount}</TableCell>
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

export default CampaignManagement;

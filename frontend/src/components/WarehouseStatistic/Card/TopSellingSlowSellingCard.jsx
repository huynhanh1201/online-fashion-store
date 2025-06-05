import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Divider
} from '@mui/material'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

const bestSelling = [
  { sku: 'AO001-RED-M', name: 'Áo Thun Basic', revenue: '45M', sold: '1230' },
  { sku: 'QU002-BLU-L', name: 'Quần Jeans Slim', revenue: '38M', sold: '890' },
  { sku: 'GI003-WHI-38', name: 'Giày Sneaker', revenue: '52M', sold: '745' },
  { sku: 'TU004-BLK-S', name: 'Túi Xách Mini', revenue: '28M', sold: '650' },
  { sku: 'MU005-GRY-F', name: 'Mũ Baseball', revenue: '15M', sold: '420' }
]

const slowSelling = [
  {
    sku: 'AO010-PUR-XL',
    name: 'Áo Vest Cổ Điển',
    unsoldFor: '3 tháng',
    stock: 45
  },
  {
    sku: 'QU011-YEL-M',
    name: 'Quần Short Neon',
    unsoldFor: '4 tháng',
    stock: 78
  },
  {
    sku: 'GI012-PIN-35',
    name: 'Giày Cao Gót',
    unsoldFor: '2 tháng',
    stock: 23
  },
  { sku: 'TU013-ORG-L', name: 'Túi Du Lịch', unsoldFor: '5 tháng', stock: 12 },
  { sku: 'PH014-SIL-F', name: 'Phụ Kiện Cổ', unsoldFor: '6 tháng', stock: 34 }
]

export default function TopSellingSlowSellingCard() {
  return (
    <Grid container spacing={2}>
      {/* Bán chạy */}
      <Grid item size={6} xs={12} md={6}>
        <Box
          sx={{
            background: 'linear-gradient(to bottom right, #e0f7fa, #ffeaea)',
            borderRadius: 2,
            p: 2
          }}
        >
          <Box display='flex' alignItems='center' gap={1} mb={1}>
            <WhatshotIcon color='error' />
            <Typography variant='subtitle1' fontWeight='bold'>
              Top 5 Bán Chạy
            </Typography>
          </Box>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Tên SP</TableCell>
                <TableCell>Doanh Thu</TableCell>
                <TableCell>SL Bán</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestSelling.map((item, idx) => {
                item.sold = Number(item.sold).toLocaleString('vi-VN')
                return (
                  <TableRow key={idx}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.revenue}</TableCell>
                    <TableCell>{item.sold}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </Grid>

      {/* Bán chậm */}
      <Grid item size={6} xs={12} md={6}>
        <Box
          sx={{
            background: 'linear-gradient(to bottom right, #e0f7fa, #ffeaea)',
            borderRadius: 2,
            p: 2
          }}
        >
          <Box display='flex' alignItems='center' gap={1} mb={1}>
            <HourglassEmptyIcon color='warning' />
            <Typography variant='subtitle1' fontWeight='bold'>
              Top 5 Bán Chậm
            </Typography>
          </Box>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Tên SP</TableCell>
                <TableCell>Không Bán</TableCell>
                <TableCell>Tồn Kho</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slowSelling.map((item, idx) => {
                item.stock = Number(item.stock).toLocaleString('vi-VN')
                return (
                  <TableRow key={idx}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.unsoldFor}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </Grid>
    </Grid>
  )
}

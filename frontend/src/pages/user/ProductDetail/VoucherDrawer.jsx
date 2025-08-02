import React from 'react'
import { Drawer, Box, Typography, Button, Card, Tooltip } from '@mui/material'
import { styled } from '@mui/system'

const VoucherCard = styled(Card)(({ theme }) => ({
  borderRadius: 4,
  boxShadow: 6,
  padding: theme.spacing(2),
  backgroundColor: 'var(--surface-color)',
  border: '3px dashed #a6a6a6',
  height: 130,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2)
}))

const VoucherDrawer = ({
  open,
  onClose,
  coupons,
  copiedCode,
  handleCopy,
  formatCurrencyShort
}) => (
  <Drawer anchor='right' open={open} onClose={onClose}>
    <Box
      sx={{
        width: 400,
        height: '100vh',
        pt: 8,
        px: 2,
        pb: 4,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mt: 8 }}>
        {coupons.map((coupon) => {
          const valueText =
            coupon.type === 'percent'
              ? `${coupon.amount}%`
              : `${coupon.amount.toLocaleString()}đ`
          const minOrderText = coupon.minOrderValue
            ? `Đơn tối thiểu ${formatCurrencyShort(coupon.minOrderValue)}`
            : ''

          return (
            <VoucherCard key={coupon.code}>
              <Box sx={{ flex: 1 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  MÃ GIẢM
                </Typography>
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  color='var(--primary-color)'
                >
                  {valueText}
                </Typography>
                <Tooltip title={coupon.code}>
                  <Typography
                    variant='body1'
                    color='var(--primary-color)'
                    mt={0.5}
                    sx={{
                      maxWidth: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Mã: <strong>{coupon.code}</strong>
                  </Typography>
                </Tooltip>
              </Box>
              <Box sx={{ ml: 3, minWidth: 130 }}>
                {minOrderText && (
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    display='block'
                  >
                    {minOrderText}
                  </Typography>
                )}
                <Tooltip
                  title={
                    copiedCode === coupon.code ? 'Đã sao chép' : 'Sao chép mã'
                  }
                >
                  <Button
                    variant='contained'
                    size='medium'
                    sx={{
                      backgroundColor: 'var(--primary-color)',
                      color: '#fff',
                      mt: 2
                    }}
                    onClick={() => handleCopy(coupon.code)}
                    fullWidth
                  >
                    Sao chép
                  </Button>
                </Tooltip>
              </Box>
            </VoucherCard>
          )
        })}
      </Box>
      <Button variant='outlined' fullWidth sx={{ mt: 2 }} onClick={onClose}>
        Đóng
      </Button>
    </Box>
  </Drawer>
)

export default VoucherDrawer

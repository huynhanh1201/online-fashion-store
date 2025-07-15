import React from 'react'
import {
  Card,
  Typography,
  Box,
  Button,
  Tooltip,
} from '@mui/material'

const CouponItem = ({ coupon, onCopy, copiedCode, formatCurrencyShort, disabled = false }) => {

  // Kiểm tra coupon cơ bản
  if (!coupon || !coupon._id) {
    return (
      <Card
        sx={{
          borderRadius: 4,

          p: 1,
          backgroundColor: '#fff',
          border: '2px dashed #a6a6a6',
          height: { xs: 100, sm: 110, md: 120 },
          width: { xs: '100%', sm: 300, md: 320 },
          maxWidth: 350,
          minWidth: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="error" fontSize={{ xs: '0.8rem', sm: '0.9rem' }}>
          Coupon không hợp lệ
        </Typography>
      </Card>
    )
  }

  // Giá trị mặc định để tránh lỗi
  const isPercent = coupon.type === 'percent'
  const amount = typeof coupon.amount === 'number' ? coupon.amount : 0
  const valueText = isPercent
    ? `${amount}%`
    : `${amount.toLocaleString()} VND`
  const code = coupon.code || 'N/A'
  const minOrderText = coupon.minOrderValue && typeof coupon.minOrderValue === 'number'
    ? `Đơn tối thiểu ${formatCurrencyShort(coupon.minOrderValue)}`
    : ''

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 1,
        backgroundColor: '#fff',
        border: '2px dashed #a6a6a6',
        height: { xs: 100, sm: 110, md: 120 },
        width: { xs: '100%', sm: 300, md: 320 },
        maxWidth: 350,
        minWidth: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          pr: 1,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
        >
          Mã giảm giá
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="var(--primary-color)"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {valueText}
        </Typography>
        <Tooltip title={code}>
          <Typography
            variant="body2"
            color="var(--primary-color)"
            mt={0.5}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Mã: <strong>{code}</strong>
          </Typography>
        </Tooltip>
      </Box>
      <Box
        sx={{
          minWidth: { xs: 100, sm: 110 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          pl: 1,
        }}
      >
        {minOrderText && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
          >
            {minOrderText}
          </Typography>
        )}
        <Tooltip
          title={copiedCode === code ? 'Đã áp dụng' : 'Áp dụng'}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: 'var(--primary-color)',
              color: '#fff',
              mt: 1,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              padding: { xs: '4px 8px', sm: '6px 12px' },
              minWidth: 80,
              borderColor: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'var(--accent-color)',
                borderColor: 'var(--primary-color)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#ccc',
                color: '#fff',
                borderColor: '#ccc',
                opacity: 1, // giữ không mờ
                cursor: 'not-allowed',
              },
            }}
            onClick={() => onCopy(coupon.code)}
            disabled={disabled}
          >
            {disabled ? 'Không áp dụng' : copiedCode === coupon.code ? 'Đã áp dụng' : 'Áp dụng'}
          </Button>


        </Tooltip>
      </Box>
    </Card>
  )
}

export default CouponItem
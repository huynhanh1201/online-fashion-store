import React, { useState } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  useMediaQuery
} from '@mui/material'

const tabLabels = [
  'Chính sách bảo mật',
  'Chính sách member',
  'Chính sách giao hàng',
  'Chính sách đổi trả và bảo hành'
]

const PolicyPage = () => {
  const [tab, setTab] = useState(0)
  const isMobile = useMediaQuery('(max-width:900px)')

  const handleTabChange = (event, newValue) => setTab(newValue)

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, md: 6 },
        maxWidth: '1200px',
        mx: 'auto'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'flex-start',
          justifyContent: 'center',
          gap: 4
        }}
      >
        {/* Tabs Sidebar */}
        <Box sx={{ minWidth: isMobile ? '100%' : 260, mb: isMobile ? 2 : 0 }}>
          <Typography
            variant='h6'
            fontWeight='bold'
            gutterBottom
            textAlign={isMobile ? 'center' : 'left'}
          >
            Danh mục
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Tabs
            orientation={isMobile ? 'horizontal' : 'vertical'}
            value={tab}
            onChange={handleTabChange}
            variant='scrollable'
            scrollButtons={isMobile ? 'auto' : false}
            sx={{
              borderRight: isMobile ? 0 : 1,
              borderBottom: isMobile ? 1 : 0,
              borderColor: 'divider',
              minHeight: 48,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                alignItems: 'flex-start',
                px: 2,
                py: 1.5,
                minHeight: 48
              },
              '& .Mui-selected': {
                color: 'primary.main',
                fontWeight: 700
              }
            }}
          >
            {tabLabels.map((label, idx) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Main EditContent */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {tab === 0 && (
            <Box sx={{ width: '100%', maxWidth: 700 }}>
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='center'
              >
                Chính sách bảo mật
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                Chính sách bảo mật thông tin cá nhân
              </Typography>
              <Typography paragraph>
                Khi bạn liên hệ mua sắm trên website, chúng tôi thu thập các
                thông tin như tên, email, địa chỉ, số điện thoại. Mục đích là để
                hỗ trợ và xác nhận đơn hàng.
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                Mục đích thu thập
              </Typography>
              <Typography paragraph>
                Việc thu thập thông tin nhằm mục đích:
                <ul>
                  <li>Gửi thông tin chương trình khuyến mãi</li>
                  <li>Giao hàng, xác nhận đơn hàng</li>
                  <li>Liên hệ hỗ trợ khi cần thiết</li>
                </ul>
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                Phạm vi sử dụng
              </Typography>
              <Typography paragraph>
                Thông tin thu thập chỉ được sử dụng trong phạm vi nội bộ
                website, không chia sẻ với bên thứ ba nếu không có sự đồng ý của
                khách hàng.
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                Thời gian lưu trữ
              </Typography>
              <Typography paragraph>
                Dữ liệu cá nhân được lưu trữ cho đến khi khách hàng yêu cầu hủy
                bỏ.
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                Địa chỉ thu thập và quản lý thông tin
              </Typography>
              <Typography paragraph>
                Công ty TNHH ABC
                <br />
                123 Nguyễn Văn Linh, Quận 7, TP. HCM
                <br />
                Email: support@tenmiencuaban.com
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                Bảo mật thông tin
              </Typography>
              <Typography paragraph>
                Thông tin cá nhân của khách hàng được bảo mật tuyệt đối. Mọi
                giao dịch được mã hóa và bảo vệ qua giao thức SSL.
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                Cam kết
              </Typography>
              <Typography paragraph>
                Chúng tôi cam kết sử dụng thông tin đúng mục đích, đúng phạm vi
                và bảo vệ thông tin một cách tối đa.
              </Typography>
            </Box>
          )}
          {tab === 1 && (
            <Box sx={{ width: '100%', maxWidth: 700 }}>
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='center'
              >
                Chính sách member
              </Typography>
              <Typography paragraph sx={{ mt: 3 }}>
                Nội dung chính sách member sẽ được cập nhật sau.
              </Typography>
            </Box>
          )}
          {tab === 2 && (
            <Box sx={{ width: '100%', maxWidth: 700 }}>
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='center'
              >
                Chính sách giao hàng
              </Typography>
              <Typography paragraph sx={{ mt: 3 }}>
                Nội dung chính sách giao hàng sẽ được cập nhật sau.
              </Typography>
            </Box>
          )}
          {tab === 3 && (
            <Box sx={{ width: '100%', maxWidth: 700 }}>
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='center'
              >
                Chính sách đổi trả và bảo hành
              </Typography>
              <Typography paragraph sx={{ mt: 3 }}>
                Nội dung chính sách đổi trả và bảo hành sẽ được cập nhật sau.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PolicyPage

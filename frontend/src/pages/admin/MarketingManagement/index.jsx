import React, { useState } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  useTheme,
  alpha
} from '@mui/material'
import {
  ViewQuilt as ViewQuiltIcon,
  LocalOffer as LocalOfferIcon,
  FlashOn as FlashOnIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  Star as StarIcon
} from '@mui/icons-material'

import PromotionManagement from './PromotionManagement/PromotionManagement.jsx'
import DisplayManagement from './DisplayManagement/DisplayManagement.jsx'
import FlashSaleManagement from './FlashSaleManagement/FlashSaleManagement.jsx'
import FooterManagement from './FooterManagement/FooterManagement.jsx'
import HeaderManagement from './HeaderManagement/HeaderManagement.jsx'
import FeaturedCategoryManagement from '~/pages/admin/MarketingManagement/FeaturedCategoryManagement/FeaturedCategoryManagement.jsx'
import ServiceHighlightManagement from '~/pages/admin/MarketingManagement/ServiceHighlightManagement/ServiceHighlightManagement.jsx'

function a11yProps(index) {
  return {
    id: `marketing-tab-${index}`,
    'aria-controls': `marketing-tabpanel-${index}`
  }
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`marketing-tabpanel-${index}`}
      aria-labelledby={`marketing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const MarketingManagement = () => {
  const theme = useTheme()
  const [tab, setTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <Box sx={{ p: 3,  minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <LocalOfferIcon sx={{ fontSize: 40, color: '#1A3C7B' }} />
          Quản lý các chiến dịch Marketing
        </Typography>
      </Box>

      {/* Tabs */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label='marketing management tabs'
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1A3C7B',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#ffff',
                  color: '#1A3C7B'
                }
              },
              '& .Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: '#4575cc',
                fontWeight: 700
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab
              icon={<ViewQuiltIcon />}
              iconPosition='start'
              label='Banner'
              {...a11yProps(0)}
            />
            <Tab
              icon={<LocalOfferIcon />}
              iconPosition='start'
              label='Voucher'
              {...a11yProps(1)}
            />
            <Tab
              icon={<FlashOnIcon />}
              iconPosition='start'
              label='Flash Sale'
              {...a11yProps(2)}
            />
            <Tab
              icon={<ImageIcon />}
              iconPosition='start'
              label='Header'
              {...a11yProps(3)}
            />
            <Tab
              icon={<ImageIcon />}
              iconPosition='start'
              label='Footer'
              {...a11yProps(4)}
            />

            <Tab
              icon={<CategoryIcon />}
              iconPosition='start'
              label='Danh mục nổi bật'
              {...a11yProps(5)}
            />
            <Tab
              icon={<StarIcon />}
              iconPosition='start'
              label='Dịch vụ nổi bật'
              {...a11yProps(6)}
            />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}>
          <DisplayManagement />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PromotionManagement />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <FlashSaleManagement />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <HeaderManagement />
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <FooterManagement />
        </TabPanel>
        <TabPanel value={tab} index={5}>
          <FeaturedCategoryManagement />
        </TabPanel>
        <TabPanel value={tab} index={6}>
          <ServiceHighlightManagement />
        </TabPanel>
      </Card>
    </Box>
  )
}

export default MarketingManagement

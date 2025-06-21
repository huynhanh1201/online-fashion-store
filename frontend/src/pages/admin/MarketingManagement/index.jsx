import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FlashOnIcon from '@mui/icons-material/FlashOn';

import CampaignManagement from './CampaignManagement';
import DisplayManagement from './DisplayManagement';
import PromotionManagement from './PromotionManagement';
import FlashSaleManagement from './FlashSaleManagement';

function a11yProps(index) {
  return {
    id: `marketing-tab-${index}`,
    'aria-controls': `marketing-tabpanel-${index}`
  };
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketing-tabpanel-${index}`}
      aria-labelledby={`marketing-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MarketingManagement = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2, borderRadius: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ p: 2, fontWeight: 'bold' }}>
          Quản lý Marketing
        </Typography>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="marketing management tabs"
          variant="fullWidth"
        >
          <Tab icon={<CampaignIcon />} iconPosition="start" label="Chiến dịch" {...a11yProps(0)} />
          <Tab icon={<ViewQuiltIcon />} iconPosition="start" label="Banner" {...a11yProps(1)} />
          <Tab icon={<LocalOfferIcon />} iconPosition="start" label="Voucher" {...a11yProps(2)} />
          <Tab icon={<FlashOnIcon />} iconPosition="start" label="Flash Sale" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <CampaignManagement />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <DisplayManagement />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <PromotionManagement />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <FlashSaleManagement />
      </TabPanel>
    </Paper>
  );
};

export default MarketingManagement;

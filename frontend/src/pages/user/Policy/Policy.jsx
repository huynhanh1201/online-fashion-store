import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material'
import { getAllPolicies } from '~/services/policyService'

const tabLabels = [
  'Chính sách bảo mật',
  'Chính sách member',
  'Chính sách giao hàng',
  'Chính sách đổi trả và bảo hành'
]

const policyTypes = [
  'privacy_policy',
  'member_policy', 
  'shipping_policy',
  'return_policy'
]

const PolicyPage = () => {
  const [tab, setTab] = useState(0)
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMobile = useMediaQuery('(max-width:900px)')

  const handleTabChange = (event, newValue) => setTab(newValue)

  // Load policies khi component mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const policiesData = await getAllPolicies()
        
        // Filter policies theo type và chỉ lấy active, non-destroyed
        const filteredPolicies = policiesData.filter(policy => 
          policy.destroy === false && 
          policy.status === 'active' &&
          policyTypes.includes(policy.category)
        )
        
        setPolicies(filteredPolicies)
      } catch (error) {
        console.error('Lỗi khi tải chính sách:', error)
        setError('Không thể tải thông tin chính sách. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  // Tìm policy theo tab hiện tại
  const getCurrentPolicy = () => {
    const currentType = policyTypes[tab]
    return policies.find(policy => policy.category === currentType)
  }

  const currentPolicy = getCurrentPolicy()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 2, md: 6 }
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 2, md: 6 },
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, md: 6 },
        maxWidth: '1400px',
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

        {/* Main Content */}
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
          {currentPolicy ? (
            <Box sx={{ width: '100%', maxWidth: 700 }}>
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='center'
              >
                {currentPolicy.title}
              </Typography>
              
              {currentPolicy.excerpt && (
                <Typography 
                  variant='h6' 
                  color="text.secondary"
                  gutterBottom 
                  sx={{ mt: 2, textAlign: 'center' }}
                >
                  {currentPolicy.excerpt}
                </Typography>
              )}
              
              <Box 
                sx={{ 
                  mt: 4,
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    fontWeight: 600,
                    mt: 3,
                    mb: 1
                  },
                  '& p': {
                    mb: 2,
                    lineHeight: 1.6
                  },
                  '& ul, & ol': {
                    mb: 2,
                    pl: 3
                  },
                  '& li': {
                    mb: 1
                  }
                }}
                dangerouslySetInnerHTML={{ __html: currentPolicy.content }}
              />
            </Box>
          ) : (
            <Box sx={{ width: '100%', maxWidth: 700, textAlign: 'center' }}>
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='center'
              >
                {tabLabels[tab]}
              </Typography>
              <Typography 
                variant='h6' 
                color="text.secondary"
                sx={{ mt: 3 }}
              >
                Nội dung chính sách này đang được cập nhật. Vui lòng quay lại sau.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PolicyPage

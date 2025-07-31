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
import { useLocation, useNavigate } from 'react-router-dom'
import { getAllPolicies } from '~/services/policyService'

const tabLabels = [
  'Điều khoản sử dụng',
  'Chính sách bảo mật',
  'Chính sách member',
  'Chính sách đổi trả',
  'Chính sách vận chuyển',
  'Chính sách bảo hành'
]

const policyTypes = [
  'terms_of_service',
  'privacy_policy',
  'member_policy',
  'return_policy',
  'shipping_policy',
  'warranty_policy'
]

const PolicyPage = () => {
  const [tab, setTab] = useState(0)
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMobile = useMediaQuery('(max-width:900px)')

  const location = useLocation()
  const navigate = useNavigate()

  // Đồng bộ tab khi hash trên URL thay đổi
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash) {
      const index = policyTypes.indexOf(hash)
      if (index !== -1) {
        setTab(index)
      }
    }
  }, [location.hash])

  // Khi đổi tab, cập nhật hash trong URL
  const handleTabChange = (event, newValue) => {
    setTab(newValue)
    navigate(`/policy#${policyTypes[newValue]}`)
  }

  // Load policies khi component mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const policiesData = await getAllPolicies()

        const filteredPolicies = policiesData.filter(
          (policy) =>
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

  // Lấy policy hiện tại
  const currentPolicy = policies.find(
    (policy) => policy.category === policyTypes[tab]
  )

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
        <Alert severity='error' sx={{ mb: 2 }}>
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
        maxWidth: '100%',
        mx: 'auto',
        minHeight: '100vh'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'flex-start',
          justifyContent: 'flex-start',
          gap: 4,
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        {/* Tabs Sidebar */}
        <Box
          sx={{
            minWidth: isMobile ? '100%' : 260,
            maxWidth: isMobile ? '100%' : 260,
            mb: isMobile ? 2 : 0,
            flexShrink: 0
          }}
        >
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
              maxHeight: isMobile ? 'auto' : 'calc(100vh - 300px)',
              overflowY: isMobile ? 'visible' : 'auto',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                alignItems: 'flex-start',
                px: 2,
                py: 1.5,
                minHeight: 48,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              '& .Mui-selected': {
                color: 'primary.main',
                fontWeight: 700
              }
            }}
          >
            {tabLabels.map((label) => (
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
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '100%',
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          {currentPolicy ? (
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'left',
                overflow: 'hidden'
              }}
            >
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='left'
                sx={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {currentPolicy.title}
              </Typography>

              {currentPolicy.excerpt && (
                <Typography
                  variant='h6'
                  color='text.secondary'
                  gutterBottom
                  sx={{
                    mt: 2,
                    textAlign: 'left',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {currentPolicy.excerpt}
                </Typography>
              )}

              <Box
                sx={{
                  mt: 4,
                  width: '100%',
                  overflow: 'hidden',
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    fontWeight: 600,
                    mt: 3,
                    mb: 1,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  },
                  '& p': {
                    mb: 2,
                    lineHeight: 1.6,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  },
                  '& ul, & ol': {
                    mb: 2,
                    pl: 3,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  },
                  '& li': {
                    mb: 1,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    display: 'block',
                    margin: '16px auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  },
                  '& table': {
                    maxWidth: '100%',
                    overflowX: 'auto',
                    display: 'block'
                  },
                  '& pre, & code': {
                    maxWidth: '100%',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  },
                  '& a': {
                    wordBreak: 'break-all'
                  }
                }}
                dangerouslySetInnerHTML={{ __html: currentPolicy.content }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'left',
                overflow: 'hidden'
              }}
            >
              <Typography
                variant='h4'
                fontWeight='bold'
                gutterBottom
                align='left'
                sx={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {tabLabels[tab]}
              </Typography>
              <Typography
                variant='h6'
                color='text.secondary'
                sx={{
                  mt: 3,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                Nội dung chính sách này đang được cập nhật. Vui lòng quay lại
                sau.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PolicyPage

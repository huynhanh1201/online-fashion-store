import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Chip,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material'
import {
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material'
import { getCollections } from '~/services/collectionService'

const CollectionList = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getCollections()
        const websiteConfigs = response.data || response
        
        const collectionConfig = websiteConfigs.find((item) => item.key === 'collections')
        const collectionsData = collectionConfig?.content || []
        
        // Chỉ hiển thị collections có trạng thái active
        const activeCollections = collectionsData.filter(collection => 
          collection.status === 'active'
        )
        
        setCollections(activeCollections)
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách collections')
        setCollections([])
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          <Link component={RouterLink} to="/" color="primary">
            Quay về trang chủ
          </Link>
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link component={RouterLink} to="/" color="inherit">
          Trang chủ
        </Link>
        <Typography color="text.primary">Collections</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bộ sưu tập sản phẩm
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Khám phá các bộ sưu tập độc đáo của chúng tôi
        </Typography>
      </Box>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <Grid container spacing={3}>
          {collections.map((collection) => (
            <Grid item xs={12} sm={6} md={4} key={collection._id || collection.name}>
              <Card 
                component={RouterLink}
                to={`/collection/${collection.slug}`}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={collection.imageUrl || '/placeholder-image.jpg'}
                  alt={collection.name}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ flexGrow: 1 }}>
                    {collection.name}
                  </Typography>
                  
                  {collection.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {collection.description.length > 100 
                        ? `${collection.description.substring(0, 100)}...`
                        : collection.description
                      }
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={collection.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      color={collection.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {collection.products?.length || 0} sản phẩm
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">
          Hiện tại chưa có bộ sưu tập nào. Vui lòng quay lại sau.
        </Alert>
      )}
    </Container>
  )
}

export default CollectionList 
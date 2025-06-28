import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Typography, Grid, CircularProgress, Alert, Container } from '@mui/material'
import { getCategoryBySlug } from '~/services/categoryService'
import { getProductsByCategory } from '~/services/productService'
import ProductCard from '~/components/ProductCards/ProductCards'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const CategoryPage = () => {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch category by slug
        const categoryData = await getCategoryBySlug(slug)
        if (!categoryData) {
          setError('Không tìm thấy danh mục')
          return
        }

        setCategory(categoryData)

        // Fetch products in this category
        const productsData = await getProductsByCategory(categoryData._id, 1, 100)
        setProducts(productsData.products || [])

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err)
        setError('Có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategoryAndProducts()
    }
  }, [slug])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  if (!category) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Không tìm thấy danh mục
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Category Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
          {category.name}
        </Typography>
        
        {category.image && (
          <Box sx={{ mb: 3 }}>
            <img 
              src={optimizeCloudinaryUrl(category.image, { width: 800, height: 300 })} 
              alt={category.name} 
              style={{ 
                width: '100%', 
                maxHeight: '300px', 
                objectFit: 'cover',
                borderRadius: '8px'
              }} 
            />
          </Box>
        )}
        
        {category.description && (
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
            {category.description}
          </Typography>
        )}
      </Box>

      {/* Products Section */}
      <Box>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 500 }}>
          Sản phẩm trong danh mục ({products.length})
        </Typography>

        {products.length === 0 ? (
          <Alert severity="info">
            Chưa có sản phẩm nào trong danh mục này.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  )
}

export default CategoryPage

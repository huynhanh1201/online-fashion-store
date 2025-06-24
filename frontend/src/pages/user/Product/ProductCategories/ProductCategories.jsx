import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography, Skeleton, CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import { getCategories } from '~/services/admin/categoryService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const ProductCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await getCategories({})
      const categoryData = response.categories || []
      
      // Filter out categories that are marked as destroyed (hidden)
      const activeCategories = categoryData.filter(category => category.destroy === false)
      
      setCategories(activeCategories)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Không thể tải danh mục sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything if loading
  if (loading) {
    return (
      <Box
        sx={{ padding: '5px', borderRadius: '20px', margin: '30px', gap: '50px' }}
      >
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          sx={{ marginTop: '50px', gap: '100px' }}
        >
          {[1, 2, 3].map((index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width={80} height={24} />
            </Box>
          ))}
        </Grid>
      </Box>
    )
  }

  // Don't render anything if no categories or error
  if (categories.length === 0) {
    return null
  }

  return (
    <Box
      sx={{ padding: '5px', borderRadius: '20px', margin: '30px', gap: '50px' }}
    >
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        sx={{ marginTop: '50px', gap: '100px' }}
      >
        {categories.map((category, index) => (
          <Box
            component={Link}
            to={category.link || `/productbycategory/${category._id}`}
            key={category._id}
            sx={{
              textAlign: 'center',
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-block',
              '&:hover img': { transform: 'translateY(-8px)' }
            }}
          >
            <Box
              component='img'
              src={
                category.image 
                  ? optimizeCloudinaryUrl(category.image, { width: 100, height: 100 })
                  : 'https://via.placeholder.com/100x100?text=No+Image'
              }
              alt={`Nhóm ${category.name}`}
              sx={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: '50%',
                transition: 'transform 0.3s ease'
              }}
            />
            <Typography
              variant='h6'
              mt={1}
            >{`Nhóm ${category.name}`}</Typography>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default ProductCategories

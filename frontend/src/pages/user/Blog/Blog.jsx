import React, { Component } from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  styled
} from '@mui/material'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography color='error'>Đã xảy ra lỗi khi tải nội dung.</Typography>
      )
    }
    return this.props.children
  }
}

const HeaderCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  height: '400px',
  background: 'linear-gradient(135deg, #333, #666)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '30px',
  '&:hover': {
    boxShadow: theme.shadows[10]
  }
}))

const PromoCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  height: '400px',
  background: 'linear-gradient(135deg, #ff6b35, #4a90e2)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '30px',
  '&:hover': {
    boxShadow: theme.shadows[10]
  }
}))

const FeatureBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: '12px',
  borderRadius: '8px',
  textAlign: 'center',
  fontSize: '11px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}))

const NewsCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}))

const ExperienceCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}))

const Blog = () => {
  const mainArticles = [
    {
      id: 1,
      title: 'MIX ĐỒ ĐI DẠM CƯỚI VỚI QUẦN JEANS',
      subtitle: 'CHO NAM THANH LỊCH',
      category: 'Tip',
      image: 'https://file.hstatic.net/1000360022/file/1__4_.png',
      featured: true
    },
    {
      id: 2,
      title: 'MAX LẠNH MỌI MÙA',
      subtitle: 'KOOL MỌI LOOK',
      category: 'Featured',
      image:
        'https://file.hstatic.net/1000360022/file/z6146112584911_ece71beefd90a9c9b9ae94a6b6586fab.jpg',
      featured: true,
      isPromo: true
    }
  ]

  const sideArticles = [
    {
      id: 3,
      title: 'STREETWEAR LÀ GÌ?',
      subtitle: 'GỢI Ý OUTFIT STREETWEAR CÁ TÍNH NĂNG ĐỘNG',
      category: 'Tip',
      image:
        'https://file.hstatic.net/1000360022/file/chinh_sach_bf209aafc4f84946892255d69aa37a8c.jpg'
    }
  ]

  const experienceArticles = [
    {
      id: 4,
      title: 'Những Cách Luôn - Ngửi Thức Thật Dù Không Lặp Đầy Dán Sớm Trong',
      category: 'Kinh nghiệm',
      image: 'https://file.hstatic.net/1000360022/file/thumb_-_smj.jpg'
    },
    {
      id: 5,
      title: 'Mix Phong Cách Thể Thể Thời 2024 - Bí Quyết Chọn Váy Dành Cho Nữ',
      category: 'Kinh nghiệm',
      image: 'https://file.hstatic.net/1000360022/file/thumb_-_smj.jpg'
    }
  ]

  return (
    <ErrorBoundary>
      <Box
        sx={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          padding: '20px'
        }}
      >
        {/* News Section */}
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CardMedia
              component='img'
              image='https://file.hstatic.net/1000360022/file/z6146112584911_ece71beefd90a9c9b9ae94a6b6586fab.jpg'
              alt='Tin tức banner'
              sx={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                mb: 2
              }}
            />
            <Typography
              variant='h4'
              sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}
            >
              TIN TỨC
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid sx={{ flex: 2 }}>
              <Typography
                variant='h5'
                sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}
              >
                TIN THỜI TRANG
              </Typography>
              <Grid container spacing={2}>
                {sideArticles.map((article) => (
                  <Grid
                    key={article.id}
                    sx={{
                      flex: 1,
                      [(theme) => theme.breakpoints.up('md')]: { flex: 0.5 }
                    }}
                  >
                    <NewsCard>
                      <CardMedia
                        component='img'
                        height='150'
                        image={article.image}
                        alt={article.title}
                        sx={{ position: 'relative' }}
                      />
                      <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                        <Typography
                          variant='caption'
                          sx={{
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            p: 0.5,
                            borderRadius: 0.5
                          }}
                        >
                          {article.category}
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant='h6'
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                          {article.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {article.subtitle}
                        </Typography>
                      </CardContent>
                    </NewsCard>
                  </Grid>
                ))}
                {experienceArticles.slice(0, 1).map((article) => (
                  <Grid
                    key={article.id}
                    sx={{
                      flex: 1,
                      [(theme) => theme.breakpoints.up('md')]: { flex: 0.5 }
                    }}
                  >
                    <NewsCard>
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant='h6'
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                          {article.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 1 }}
                        >
                          {article.category}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Tìm hiểu nguyên nhân chóng mặt khi mặt thời tiết nắng
                          nóng qua đây để tránh những gãy không phải lúc nào
                          cũng đơn giản...
                        </Typography>
                        <Button
                          variant='outlined'
                          size='small'
                          sx={{ mt: 1, borderRadius: 1 }}
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </NewsCard>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid sx={{ flex: 1 }}>
              <Typography
                variant='h5'
                sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}
              >
                KINH NGHIỆM HAY
              </Typography>
              {experienceArticles.map((article) => (
                <ExperienceCard key={article.id}>
                  <CardMedia
                    component='img'
                    image={article.image}
                    alt={article.title}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  <CardContent sx={{ p: 1, flex: 1 }}>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 'bold', mb: 0.5 }}
                    >
                      {article.title}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {article.category}
                    </Typography>
                  </CardContent>
                </ExperienceCard>
              ))}
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button variant='outlined' sx={{ borderRadius: 20, fontSize: 14 }}>
              Xem tất cả
            </Button>
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}

export default Blog

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {
  Card as MuiCard,
  Grid,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { registerUserAPI } from '~/apis'
import { toast } from 'react-toastify'
import { getUserBanners } from '~/services/bannerService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [backgroundBanner, setBackgroundBanner] = useState(null)
  const [loadingBanner, setLoadingBanner] = useState(true)

  const toggleShowPassword = () => setShowPassword((prev) => !prev)
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev)

  // Lấy banner cho background
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoadingBanner(true)
        const banners = await getUserBanners()
        // Tìm banner cho vị trí login
        const loginBanner = banners.find(banner => banner.position === 'login')
        setBackgroundBanner(loginBanner)
      } catch (error) {
        console.error('Lỗi khi lấy banner:', error)
      } finally {
        setLoadingBanner(false)
      }
    }

    fetchBanner()
  }, [])

  const submitRegister = async (data) => {
    toast
      .promise(registerUserAPI(data), {
        pending: 'Đang đăng ký tài khoản...'
      })
      .then((userInfo) => {
        navigate(`/login?rigisteredEmail=${userInfo.email}`)
      })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: backgroundBanner?.imageUrl 
          ? `url("${optimizeCloudinaryUrl(backgroundBanner.imageUrl, { width: 1920, height: 1080 })}")`
          : 'url("https://png.pngtree.com/background/20230426/original/pngtree-an-image-of-a-clothing-store-picture-image_2490513.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
        p: 2,
        position: 'relative'
      }}
    >
      <Button
        variant='contained'
        color='secondary'
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
          px: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }
        }}
        startIcon={<ArrowBack />}
      >
        Trang chủ
      </Button>

      <form onSubmit={handleSubmit(submitRegister)}>
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <MuiCard
            elevation={6}
            sx={{
              width: { xs: '90vw', sm: 400 },
              mt: 6,
              p: 3,
              borderRadius: 3,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant='h5' fontWeight='bold' gutterBottom>
                Tạo tài khoản mới
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Vui lòng điền đầy đủ thông tin bên dưới
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label='Tên hiển thị'
                type='text'
                variant='outlined'
                error={!!errors.name}
                {...register('name', {
                  required: 'Vui lòng nhập tên hiển thị.'
                })}
              />
              {errors.name && (
                <Alert severity='error' sx={{ mt: 1 }}>
                  {errors.name.message}
                </Alert>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label='Email'
                type='text'
                variant='outlined'
                error={!!errors.email}
                {...register('email', {
                  required: 'Vui lòng nhập email.',
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: 'Email không hợp lệ.'
                  }
                })}
              />
              {errors.email && (
                <Alert severity='error' sx={{ mt: 1 }}>
                  {errors.email.message}
                </Alert>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label='Mật khẩu'
                type={showPassword ? 'text' : 'password'}
                variant='outlined'
                error={!!errors.password}
                {...register('password', {
                  required: 'Vui lòng nhập mật khẩu.',
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/,
                    message:
                      'Mật khẩu phải có 8-128 ký tự, gồm chữ thường, chữ in hoa, số và ký tự đặc biệt.'
                  }
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={toggleShowPassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                helperText='≥8 ký tự, 1 chữ thường, 1 chữ in hoa, 1 số, 1 ký tự đặc biệt'
              />
              {errors.password && (
                <Alert severity='error' sx={{ mt: 1 }}>
                  {errors.password.message}
                </Alert>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label='Xác nhận mật khẩu'
                type={showConfirmPassword ? 'text' : 'password'}
                variant='outlined'
                error={!!errors.confirmPassword}
                {...register('confirmPassword', {
                  required: 'Vui lòng xác nhận mật khẩu.',
                  validate: (value) =>
                    value === watch('password') || 'Mật khẩu không khớp.'
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={toggleShowConfirmPassword}
                        edge='end'
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {errors.confirmPassword && (
                <Alert severity='error' sx={{ mt: 1 }}>
                  {errors.confirmPassword.message}
                </Alert>
              )}
            </Box>

            <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                fullWidth
                sx={{ py: 1.2, borderRadius: 2 }}
              >
                Đăng ký
              </Button>
            </CardActions>

            <Grid item xs={12}>
              <Typography
                align='center'
                sx={{ mt: 1, color: '#666', fontSize: '0.9rem' }}
              >
                Bạn đã có tài khoản?{' '}
                <a
                  href='/login'
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Đăng nhập ngay
                </a>
              </Typography>
            </Grid>
          </MuiCard>
        </Zoom>
      </form>
    </Box>
  )
}

export default Register

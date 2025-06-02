import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {
  Card as MuiCard,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  Facebook,
  GitHub,
  Google,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { styled } from '@mui/system'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginUserAPI } from '~/redux/user/userSlice'
import { getProfileUser } from '~/services/userService'
import { logoutUserAPI } from '~/redux/user/userSlice'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
const SocialButton = styled(Button)({
  padding: '8px',
  borderRadius: '50%',
  minWidth: '40px',
  height: '40px',
  borderColor: '#e0e0e0',
  '&:hover': {
    borderColor: '#1976d2',
    backgroundColor: '#f5f5f5'
  }
})

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword((prev) => !prev)
  const [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('rigisteredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const submitLogIn = async (data) => {
    try {
      const response = await toast.promise(
        dispatch(loginUserAPI(data)).unwrap(),
        {
          pending: 'Đang đăng nhập...',
          success: 'Đăng nhập thành công!',
          error: 'Đăng nhập thất bại!'
        }
      )
      localStorage.setItem('token', response.token) // Lưu token
      // Gọi getProfile ngay sau đăng nhập
      try {
        const profileData = await getProfileUser()
        dispatch({ type: 'user/loginUserAPI/fulfilled', payload: profileData })
        console.log('Thông tin người dùng từ API:', profileData)
      } catch (error) {
        toast.error(error.message || 'Lỗi tải thông tin người dùng')
        dispatch(logoutUserAPI(false))
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
      navigate('/')
    } catch (error) {
      toast.error(error || 'Đăng nhập thất bại')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'url("https://png.pngtree.com/background/20230426/original/pngtree-an-image-of-a-clothing-store-picture-image_2490513.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
        p: 2
      }}
    >
      {/*<Button*/}
      {/*  variant='contained'*/}
      {/*  color='secondary'*/}
      {/*  onClick={() => navigate('/')}*/}
      {/*  sx={{*/}
      {/*    position: 'absolute',*/}
      {/*    top: 16,*/}
      {/*    left: 16,*/}
      {/*    zIndex: 10,*/}
      {/*    borderRadius: 2,*/}
      {/*    textTransform: 'none',*/}
      {/*    fontWeight: 500,*/}
      {/*    px: 2*/}
      {/*  }}*/}
      {/*  startIcon={<ArrowBack />}*/}
      {/*>*/}
      {/*  Trang chủ*/}
      {/*</Button>*/}

      <form onSubmit={handleSubmit(submitLogIn)}>
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <MuiCard
            elevation={6}
            sx={{
              width: { xs: '90vw', sm: 400 },
              p: 3,
              borderRadius: 3,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              marginTop: '50px'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant='h5' fontWeight='bold' gutterBottom>
                Chào mừng trở lại
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Vui lòng đăng nhập để tiếp tục
              </Typography>

              {verifiedEmail && (
                <Alert
                  variant='outlined'
                  severity='success'
                  icon={<CheckCircleOutline sx={{ color: '#2e7d32' }} />}
                  sx={{
                    textAlign: 'left',
                    borderRadius: '8px',
                    borderColor: '#4caf50',
                    backgroundColor: '#e8f5e9',
                    color: '#1b5e20',
                    fontWeight: 500,
                    padding: '12px 16px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '& .MuiAlert-icon': {
                      alignItems: 'center'
                    }
                  }}
                >
                  Tài khoản đã được xác thực thành công!
                </Alert>
              )}

              {registeredEmail && (
                <Alert
                  variant='outlined'
                  severity='info'
                  icon={<InfoOutlined sx={{ color: '#0288d1' }} />}
                  sx={{
                    textAlign: 'left',
                    borderRadius: '8px',
                    borderColor: '#03a9f4',
                    backgroundColor: '#e3f2fd',
                    color: '#01579b',
                    fontWeight: 500,
                    padding: '12px 16px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '& .MuiAlert-icon': {
                      alignItems: 'center'
                    }
                  }}
                >
                  Vui lòng kiểm tra email <b>{registeredEmail}</b> để xác thực
                  tài khoản trước khi sử dụng dịch vụ.
                </Alert>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                autoFocus
                fullWidth
                label='Email'
                type='text'
                variant='outlined'
                error={!!errors.email}
                {...register('email', {
                  required: 'Email không được để trống.',
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
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
                  required: 'Mật khẩu không được để trống.'
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
              />
              {errors.password && (
                <Alert severity='error' sx={{ mt: 1 }}>
                  {errors.password.message}
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
                Đăng nhập
              </Button>
            </CardActions>

            <Grid item xs={12}>
              <Typography
                align='center'
                sx={{ mt: 1.5, color: '#666', fontSize: '0.9rem' }}
              >
                <a
                  href='/forgot-password'
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Quên mật khẩu?
                </a>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                align='center'
                sx={{ mt: 1, color: '#666', fontSize: '0.9rem' }}
              >
                Bạn chưa có tài khoản?{' '}
                <a
                  href='/Register'
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Đăng ký ngay
                </a>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <SocialButton variant='outlined'>
                  <Facebook sx={{ color: '#3b5998' }} />
                </SocialButton>
                <SocialButton variant='outlined'>
                  <Google sx={{ color: '#db4437' }} />
                </SocialButton>
                <SocialButton variant='outlined'>
                  <GitHub sx={{ color: '#333333' }} />
                </SocialButton>
              </Box>
            </Grid>
          </MuiCard>
        </Zoom>
      </form>
    </Box>
  )
}

export default Login

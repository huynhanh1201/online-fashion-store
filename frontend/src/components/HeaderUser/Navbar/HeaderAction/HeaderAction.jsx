import React, { useState, useEffect, useRef } from 'react'
import {
  IconButton,
  Box,
  Typography,
  Avatar,
  Badge,
  Button
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutUserAPI,
  selectCurrentUser,
  loginUserAPI
} from '~/redux/user/userSlice'
import { getProfileUser } from '~/services/userService'
import { toast } from 'react-toastify'
import { useCart } from '~/hooks/useCarts'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const HeaderAction = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const menuRef = useRef(null) // Reference to the menu element

  // Lấy giỏ hàng từ Redux store
  const cartItems = useSelector((state) => state.cart.cartItems)
  const { refresh } = useCart()
  const tempQuantities = useSelector((state) => state.cart.tempQuantities || {})
  const cartCount = cartItems.reduce((sum, item) => {
    const variantId = item.variant?._id || item.variantId
    const tempQty = tempQuantities[variantId]
    return sum + (tempQty !== undefined ? tempQty : item.quantity)
  }, 0)

  const [tokenUpdated, setTokenUpdated] = useState(
    localStorage.getItem('accessToken')
  ) // Theo dõi token

  // Hàm cắt tên user nếu vượt quá 15 ký tự
  const truncateUserName = (name) => {
    if (!name) return ''
    return name.length > 15 ? name.substring(0, 15) + '...' : name
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    const fetchProfile = async () => {
      try {
        const profileData = await getProfileUser()
        if (profileData && profileData.name) {
          dispatch({
            type: 'user/loginUserAPI/fulfilled',
            payload: profileData
          })
        } else {
          throw new Error('Không tìm thấy thông tin người dùng')
        }
      } catch (error) {
        toast.error(error.message || 'Lỗi tải thông tin người dùng')
        dispatch(logoutUserAPI(false))
        localStorage.removeItem('accessToken')
        setTokenUpdated(null)
      }
    }

    if (token && !currentUser) {
      setTokenUpdated(token)
      fetchProfile()
    }
  }, [dispatch, currentUser])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    dispatch(logoutUserAPI())
    localStorage.removeItem('accessToken')
    setTokenUpdated(null)
    handleClose()
    navigate('/login')
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        anchorEl &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !anchorEl.contains(event.target)
      ) {
        handleClose()
      }
    }

    const handleScroll = () => {
      if (anchorEl) handleClose()
    }

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [anchorEl])

  return (
    <>
      <IconButton color='inherit' component={Link} to='/cart' sx={{ mt: 0.7 }}>
        <Badge badgeContent={cartCount} color='error'>
          <ShoppingCartIcon sx={{ fontSize: 26 }} />
        </Badge>
      </IconButton>
      <IconButton color='inherit' onClick={handleClick}>
        {currentUser && currentUser.avatarUrl ? (
          <Avatar
            src={optimizeCloudinaryUrl(currentUser.avatarUrl)}
            alt={currentUser.name || 'User'}
            sx={{ width: 30, height: 30 }}
          />
        ) : (
          <PersonIcon />
        )}
      </IconButton>

      <Box
        ref={menuRef}
        sx={{
          position: 'absolute',
          top: '100%',
          right: 0,
          transform: open ? 'translateY(0) scaleY(1)' : 'translateY(0) scaleY(0)',
          transformOrigin: 'top',
          minWidth: 160,
          zIndex: 1400,
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: open ? '10px' : '0',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s ease, opacity 0.4s ease',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {currentUser ? (
            <>
              <Button
                onClick={handleClose}
                component={Link}
                to='/profile'
                sx={{
                  fontWeight: 'bold',
                  opacity: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: '12px 16px',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <Avatar
                  src={optimizeCloudinaryUrl(currentUser.avatarUrl)}
                  alt={currentUser.name || 'User'}
                  sx={{
                    width: 46,
                    height: 46,
                    border: '2px solid #1976d2',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                />
                <Typography
                  sx={{
                    color: '#1976d2',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {truncateUserName(currentUser.name)}
                  <CheckCircleIcon
                    sx={{
                      fontSize: '1.1rem',
                      color: '#4caf50',
                      ml: 0.5
                    }}
                  />
                </Typography>
              </Button>
              <Button
                onClick={handleClose}
                component={Link}
                to='/profile'
                sx={{
                  fontWeight: '300',
                  padding: '12px 16px',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Trang cá nhân
              </Button>
              <Box sx={{ width: '100%', padding: '5px' }}>
                <hr
                  style={{
                    border: 0,
                    borderTop: '1px solid #eee',
                    margin: '0 0 8px 0'
                  }}
                />
              </Box>
            </>
          ) : (
            <Button
              onClick={handleClose}
              component={Link}
              to='/login'
              sx={{
                fontWeight: '300',
                padding: '12px 16px',
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Đăng nhập
            </Button>
          )}
          <Button
            onClick={handleClose}
            component={Link}
            to='/cart'
            sx={{
              fontWeight: '300',
              padding: '12px 16px',
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
            }
          >
            Giỏ hàng
          </Button>
          <Button
            onClick={handleClose}
            component={Link}
            to='/orders'
            sx={{
              fontWeight: '300',
              padding: '12px 16px',
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
            }
          >
            Thông tin đơn hàng
          </Button>
          <Box sx={{ width: '100%', padding: '5px' }}>
            <hr
              style={{
                border: 0,
                borderTop: '1px solid #eee',
                margin: '0 0 8px 0'
              }}
            />
          </Box>
          <Button
            onClick={handleLogout}
            sx={{
              fontWeight: '300',
              padding: '12px 16px',
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
            }
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                style={{ marginRight: 8 }}
                width='22'
                height='22'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1'
                />
              </svg>
              Đăng xuất
            </span>
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default HeaderAction
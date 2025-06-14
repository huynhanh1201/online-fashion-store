import React, { useState, useEffect, useRef } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Grow,
  Fade,
  Paper,
  Avatar,
  Typography
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
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const [tokenUpdated, setTokenUpdated] = useState(
    localStorage.getItem('token')
  ) // Theo dõi token

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchProfile = async () => {
      try {
        const profileData = await getProfileUser()
        if (profileData && profileData.name) {
          dispatch({
            type: 'user/loginUserAPI/fulfilled',
            payload: profileData
          })
          await refresh()
        } else {
          throw new Error('Không tìm thấy thông tin người dùng')
        }
      } catch (error) {
        toast.error(error.message || 'Lỗi tải thông tin người dùng')
        dispatch(logoutUserAPI(false))
        localStorage.removeItem('token')
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
    localStorage.removeItem('token')
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
      <IconButton color='inherit' onClick={handleClick}>
        {currentUser && currentUser.avatarUrl ? (
          <Avatar
            src={currentUser.avatarUrl}
            alt={currentUser.name || 'User'}
            sx={{ width: 30, height: 30 }}
          />
        ) : (
          <PersonIcon />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Grow}
        TransitionProps={{
          timeout: { enter: 400, exit: 200 },
          easing: {
            enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
            exit: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }}
        PaperProps={{
          component: Paper,
          elevation: 4,
          sx: {
            mt: 1,
            minWidth: 160,
            zIndex: (theme) => theme.zIndex.tooltip + 10,
            '& .MuiMenuItem-root': {
              transition: 'background-color 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
          }
        }}
        MenuListProps={{ ref: menuRef }}
      >
        <Fade in={open} timeout={{ enter: 300, exit: 150 }}>
          <div>
            {currentUser ? (
              <>
                <MenuItem
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
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    }
                  }}
                >
                  <Avatar
                    src={currentUser.avatarUrl}
                    alt={currentUser.name || 'User'}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      border: '2px solid #1976d2',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
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
                    {currentUser.name}
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: '1.1rem',
                        color: '#4caf50',
                        ml: 0.5
                      }} 
                    />
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to='/profile'>
                  Hồ sơ
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleClose} component={Link} to='/login'>
                Đăng nhập
              </MenuItem>
            )}
            <MenuItem onClick={handleClose} component={Link} to='/cart'>
              Giỏ hàng
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to='/orders'>
              Thông tin đơn hàng
            </MenuItem>
          </div>
        </Fade>
      </Menu>

      <IconButton color='inherit' component={Link} to='/cart'>
        <Badge badgeContent={cartCount} color='error'>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </>
  )
}

export default HeaderAction

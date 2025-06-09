import React, { useState, useEffect } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Grow,
  Paper,
  Avatar
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
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
    const handleScroll = () => {
      if (anchorEl) handleClose()
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
        PaperProps={{
          component: Paper,
          elevation: 4,
          sx: {
            mt: 1,
            minWidth: 100,
            zIndex: (theme) => theme.zIndex.tooltip + 10
          }
        }}
      >
        {currentUser ? (
          <>
            <MenuItem component={Link} to='/profile'>
              Hồ sơ
            </MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </>
        ) : (
          <MenuItem component={Link} to='/login'>
            Đăng nhập
          </MenuItem>
        )}
        <MenuItem component={Link} to='/cart'>
          Giỏ hàng
        </MenuItem>
        <MenuItem component={Link} to='/orders'>
          Thông tin đơn hàng
        </MenuItem>
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

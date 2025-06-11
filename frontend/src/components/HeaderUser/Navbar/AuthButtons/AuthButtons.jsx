import React, { useState, useEffect } from 'react'
import { Button, Menu, MenuItem, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { getProfileUser } from '~/services/userService'
import { toast } from 'react-toastify'

const StyledButtonRegister = styled(Button)(({ theme }) => ({
  color: '#000',
  fontWeight: 500,
  borderRadius: '10px',
  minWidth: '120px',
  maxWidth: '120px',
  border: '2px solid #1A3C7B',
  padding: '8px 16px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e9ecef',
    transform: 'translateY(-2px)'
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '100px',
    maxWidth: '100px',
    fontSize: '0.875rem',
    padding: '6px 12px'
  }
}))

const StyledButtonLogin = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  borderRadius: '10px',
  minWidth: '120px',
  maxWidth: '120px',
  padding: '8px 16px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: '#1A3C7B',
  '&:hover': {
    backgroundColor: '#e9ecef',
    transform: 'translateY(-2px)',
    color: 'black'
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '100px',
    maxWidth: '100px',
    fontSize: '0.875rem',
    padding: '6px 12px'
  }
}))
const StyledTypography = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 400,
  padding: '8px 16px',
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    padding: '6px 12px',
    fontSize: '0.9rem'
  }
}))

const AuthButtons = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [tokenUpdated, setTokenUpdated] = useState(
    localStorage.getItem('token')
  )
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileUser()
        if (profileData && profileData.name) {
          dispatch({
            type: 'user/loginUserAPI/fulfilled',
            payload: profileData
          })
          console.log('Tên từ API:', profileData.name)
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

    const token = localStorage.getItem('token')
    if (token) {
      setTokenUpdated(token)
      fetchProfile()
    }
  }, [dispatch, tokenUpdated])

  const truncateName = (name) => {
    if (!name) return 'Người dùng'
    if (name.length <= 15) return name
    return `${name.slice(0, 12)}...`
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {!currentUser ? (
        <>
          <StyledButtonRegister component={Link} to='/register'>
            Đăng ký
          </StyledButtonRegister>
          <StyledButtonLogin component={Link} to='/login'>
            Đăng nhập
          </StyledButtonLogin>
        </>
      ) : null}
    </div>
  )
}

export default AuthButtons

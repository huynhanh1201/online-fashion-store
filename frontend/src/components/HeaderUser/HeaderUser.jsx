import React, { useState, useRef } from 'react'
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Box,
  Typography
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { styled } from '@mui/system'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Logo from './Navbar/Logo/Logo'
import Search from './Navbar/Search/Search'
import HeaderAction from './Navbar/HeaderAction/HeaderAction'
import MobileDrawer from './Navbar/MobileDrawer/MobileDrawer'
import Topbar from '../HeaderUser/Topbar/Topbar'
import Menu from './Navbar/Menu/Menu'
import AuthButtons from './Navbar/AuthButtons/AuthButtons'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, var(--background-color) 0%, var(--surface-color) 100%)',
  color: 'var(--text-color)',
  top: 40,
  position: 'fixed',
  zIndex: 1300,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  transition: 'top 0.3s ease',
  [theme.breakpoints.down('md')]: {
    top: 40
  },
  [theme.breakpoints.down('sm')]: {
    top: 40
  }
}))

const HeaderUser = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef()
  const currentUser = useSelector(selectCurrentUser)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <Topbar />
      <StyledAppBar>
        <Container
          maxWidth='100%'
          ref={headerRef}
          sx={{ overflow: 'visible' }}
        >
          <Toolbar
            disableGutters
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: { xs: 56, sm: 64, md: 72 },
              width: '100%',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            {/* Left Section - Logo & Menu Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <IconButton
                color='inherit'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: 'none' },
                  p: { xs: 1, sm: 1.5 }
                }}
                aria-label='open drawer'
              >
                <MenuIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>

              <Typography
                variant='h6'
                noWrap
                className="no-select"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
                  cursor: 'pointer',
                  userSelect: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Logo href='/'>Logo</Logo>
              </Typography>
            </Box>

            {/* Center Section - Desktop Menu */}
            <Box
              className="no-select"
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexGrow: 1,
                justifyContent: 'start',
                maxWidth: '800px',
                userSelect: 'none',
                overflow: 'visible'
              }}
            >
              <Menu headerRef={headerRef} />
            </Box>

            {/* Right Section - Search & Actions */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1, md: 1.5 },
                justifyContent: 'flex-end',
                flexShrink: 0,
                minWidth: '270px',
                maxWidth: { xs: '50%', sm: '40%', md: 'none' }
              }}
            >
              {/* Search Component - Hide on very small screens */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'block', },
                  mr:-2,
                  mt:1
                }}
              >
                <Search />
              </Box>

              {/* Search Icon for mobile */}
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Search compact />
              </Box>

              {/* Auth Buttons */}
              <Box sx={{ flexShrink: 0,ml:1 }}>
                <AuthButtons />
              </Box>

              {/* Header Action - Only show if user is logged in */}
              {currentUser && (
                <Box sx={{ flexShrink: 0 }}>
                  <HeaderAction />
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      <MobileDrawer
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 280 },
            maxWidth: '100vw'
          }
        }}
      />
    </>
  )
}

export default HeaderUser
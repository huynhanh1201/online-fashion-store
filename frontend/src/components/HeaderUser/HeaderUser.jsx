import React, { useState } from 'react'
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
import Logo from './Navbar/Logo/Logo'
import Search from './Navbar/Search/Search'
import HeaderAction from './Navbar/HeaderAction/HeaderAction'
import MobileDrawer from './Navbar/MobileDrawer/MobileDrawer'
import Topbar from '../HeaderUser/Topbar/Topbar'
import Menu from './Navbar/Menu/Menu'
import AuthButtons from './Navbar/AuthButtons/AuthButtons'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #ffffff 0%, #f8f9fa 100%)',
  color: '#000',
  top: 40,
  position: 'fixed',
  zIndex: 1301,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  [theme.breakpoints.down('md')]: {
    top: 30
  }
}))

const HeaderUser = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <Topbar />
      <StyledAppBar>
        <Container maxWidth='lg'>
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: { xs: 56, sm: 64 },
              paddingY: 0
            }}
          >
            {/* Logo + menu icon mobile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: 80, sm: 100, md: '20%' },
                flexShrink: 0
              }}
            >
              <IconButton
                color='inherit'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{ mr: 0.5, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant='h6'
                sx={{
                  width: { xs: 60, sm: 80, md: '100%' },
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                }}
              >
                <Logo href='/'>ICONDEWIM™</Logo>
              </Typography>
            </Box>

            {/* Menu giữa */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 2,
                flexGrow: 1,
                justifyContent: 'center',
                maxWidth: 600,
                minWidth: 600
              }}
            >
              <Menu />
            </Box>

            {/* Search + Auth + Action bên phải */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5, md: 2 },
                justifyContent: 'flex-end',
                width: { xs: 'auto', md: '30%' },
                flexShrink: 0
              }}
            >
              <Search />
              <AuthButtons />
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HeaderAction />
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      <MobileDrawer open={mobileOpen} onClose={handleDrawerToggle} />
    </>
  )
}

export default HeaderUser

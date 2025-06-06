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
  transition: 'top 0.3s ease',
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
        <Container maxWidth='xl'>
          <Toolbar
            disableGutters
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: { xs: 56, sm: 64, md: 72 },
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
            {/* Left: Menu icon + Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexBasis: { xs: 'auto', md: '20%' },
                flexShrink: 0,
                gap: 1
              }}
            >
              <IconButton
                color='inherit'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{ mr: 1, display: { md: 'none' } }}
                aria-label='open drawer'
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant='h6'
                noWrap
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <Logo href='/'>ICONDEWIM™</Logo>
              </Typography>
            </Box>

            {/* Center: Menu */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexGrow: 1,
                justifyContent: 'center',
                maxWidth: 600,
                minWidth: 400,
                gap: 2,
                userSelect: 'none'
              }}
            >
              <Menu />
            </Box>

            {/* Right: Search + Auth + HeaderAction */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5, md: 2 },
                justifyContent: 'flex-end',
                flexBasis: { xs: 'auto', md: '25%' },
                flexShrink: 0,
                minWidth: { xs: 'auto', md: 250 }
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

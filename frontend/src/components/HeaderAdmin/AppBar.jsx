import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MoreIcon from '@mui/icons-material/MoreVert'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import ViewsAppBarModal from '~/pages/admin/NotificationManagement/modal/ViewsAppBarModal.jsx'
export default function AdminAppBar({
  open,
  onDrawerOpen,
  onProfileMenuOpen,
  onMenuClose
}) {
  const mobileMenuId = 'primary-search-account-menu-mobile'
  const [modalOpen, setModalOpen] = useState(false)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)
  return (
    <AppBar position='fixed' className={`app-bar ${open ? 'open' : ''}`}>
      <Toolbar className='app-bar--header'>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={open ? onMenuClose : onDrawerOpen}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant='h6' noWrap component='div'>
          Xin chào
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40
          }}
        >
          <IconButton
            size='large'
            aria-label='show notifications'
            color='inherit'
            onClick={modalOpen ? handleModalClose : handleModalOpen}
          >
            <Badge
              // badgeContent={notifications.filter((n) => !n.read).length}
              badgeContent={10}
              color='error'
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
        {/* Mobile icon fallback */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size='large'
            aria-label='show more'
            aria-controls={mobileMenuId}
            aria-haspopup='true'
            onClick={onProfileMenuOpen}
            color='inherit'
          >
            <MoreIcon />
          </IconButton>
        </Box>
        <ViewsAppBarModal open={modalOpen} handleClose={handleModalClose} />
      </Toolbar>
    </AppBar>
  )
}

import React, { useState, useEffect } from 'react'
import { Box, CssBaseline, Button } from '@mui/material'
import { Outlet } from 'react-router-dom'
import AdminAppBar from '~/components/HeaderAdmin/AppBar'
import AdminDrawer from '~/components/HeaderAdmin/Drawer'
import AdminMenu from '~/components/HeaderAdmin/Menu'
import '~/layout/AdminLayout.css'
import ProfileModal from '~/components/ProfileAdmin/index.jsx'
import useProfile from '~/hooks/useUserProfile.js'

export default function AdminLayout() {
  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [openProfile, setOpenProfile] = useState(false)
  const { profile, fetchProfile } = useProfile()

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  useEffect(() => {
    if (open) {
      fetchProfile()
    }
  }, [open])

  const styles = {
    box: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '10px',
      zIndex: 1200
    }
  }

  return (
    <Box className={`admin-layout ${open ? 'open' : ''}`}>
      <Box onMouseEnter={() => !open && handleDrawerOpen()} sx={styles.box} />
      <CssBaseline />
      <AdminAppBar
        open={open}
        anchorEl={anchorEl}
        onDrawerOpen={handleDrawerOpen}
        onProfileMenuOpen={handleProfileMenuOpen}
        onProfileMenuClose={handleMenuClose}
        onMenuClose={handleDrawerClose}
        profile={profile}
      />
      <AdminDrawer
        open={open}
        onClose={handleDrawerClose}
        profile={profile}
        onDrawerOpen={handleDrawerOpen}
        //
        onProfileOpen={() => {
          setOpenProfile(true)
        }}
        onProfileMenuClose={handleMenuClose}
      />
      <AdminMenu
        anchorEl={anchorEl}
        isOpen={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onProfileClick={() => {
          setOpenProfile(true)
          handleMenuClose()
        }}
        profile={profile}
      />
      <ProfileModal
        fetchProfile={fetchProfile}
        profile={profile}
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
      <main className='main-content'>
        <div className='drawer-header' />
        <Outlet />
      </main>
    </Box>
  )
}

import React, { useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button
} from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const LogoutButton = ({ handleLogout }) => {
  const [openConfirm, setOpenConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleOpenConfirm = () => setOpenConfirm(true)
  const handleCloseConfirm = () => setOpenConfirm(false)

  const confirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await handleLogout()
      setOpenConfirm(false)
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <Box sx={{ p: 0, textAlign: 'center' }}>
        <List sx={{ flexGrow: 1, p: 0 }}>
          <ListItem disablePadding onClick={handleOpenConfirm}>
            <ListItemButton sx={{ color: '#f00' }}>
              <ListItemIcon>
                <ExitToAppIcon color='error' />
              </ListItemIcon>
              <ListItemText sx={{ color: '#f00' }} primary='Đăng xuất' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        fullWidth
        maxWidth='sm'
        BackdropProps={{
          sx: StyleAdmin.OverlayModal
        }}
      >
        <DialogTitle>Đăng xuất</DialogTitle>
        <Divider sx={{ my: 0 }} />
        <DialogContent>
          Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
        </DialogContent>
        <Divider sx={{ my: 0 }} />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={handleCloseConfirm}
            color='inherit'
            disabled={isLoggingOut}
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmLogout}
            color='error'
            variant='contained'
            disabled={isLoggingOut}
            sx={{ textTransform: 'none' }}
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LogoutButton

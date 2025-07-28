import React from 'react'
import {
  MenuItem,
  Paper,
  List,
  Grow,
  ClickAwayListener,
  Popper
} from '@mui/material'
// import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUserAPI } from '~/redux/user/userSlice'
export default function AdminMenu({
  anchorEl,
  isOpen,
  onClose,
  onProfileClick
}) {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logoutUserAPI())
    onClose()
  }
  const styles = {
    menuItem: {
      width: '200px',
      height: '40px'
    }
  }

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      role={undefined}
      placement='bottom-end'
      transition
      disablePortal
      style={{ zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: 'top right' }}>
          <Paper>
            <ClickAwayListener onClickAway={onClose}>
              <List>
                <MenuItem
                  onClick={() => {
                    onProfileClick()
                    // navigate('/admin/profile') // Chuyển hướng tới trang profile
                  }}
                  sx={{ borderBottom: '1px solid #ccc', ...styles.menuItem }}
                >
                  Thông tin cá nhân
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogout()
                  }}
                  sx={styles.menuItem}
                >
                  Đăng xuất
                </MenuItem>
              </List>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

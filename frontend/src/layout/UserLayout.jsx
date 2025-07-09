import { Outlet, Link } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import HeaderUser from '../components/HeaderUser/HeaderUser'
import { Box } from '@mui/material'
function UserLayout() {
  return (
    <>
      <Box sx={{ marginBottom: '105px' }}>
        <HeaderUser />
      </Box>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default UserLayout

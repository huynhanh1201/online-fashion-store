import { Button } from '@mui/material'
import { styled } from '@mui/system'

const LogoButton = styled(Button)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 700,
  color: '#03235e',
  textTransform: 'none',
  letterSpacing: '1px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px'
  }
}))

const Logo = () => {
  return <LogoButton href='/'>FASHIONSTORE™</LogoButton>
}

export default Logo

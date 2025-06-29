import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Custom header
const CustomHeader = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1200
}));

const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  minHeight: '70px',
  [theme.breakpoints.down('md')]: {
    padding: '0 15px'
  }
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 700,
  color: 'white',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    textShadow: '0 0 20px rgba(255,255,255,0.5)'
  }
}));

const NavigationMenu = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const NavLink = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    background: 'rgba(255,255,255,0.15)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: '2px',
    background: 'white',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)'
  },
  '&:hover::after': {
    width: '80%'
  }
}));

const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '50%',
  padding: '10px',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.2)',
  '&:hover': {
    background: 'rgba(255,255,255,0.2)',
    transform: 'scale(1.1)',
    boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
  }
}));

// Mobile drawer
const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '280px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px'
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '1px solid rgba(255,255,255,0.2)'
}));

const DrawerNavLink = styled(ListItem)(({ theme }) => ({
  color: 'white',
  borderRadius: '10px',
  marginBottom: '5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateX(5px)'
  }
}));

// Main content
const MainContent = styled('main')(({ theme }) => ({
  marginTop: '70px',
  minHeight: 'calc(100vh - 70px - 200px)', // Subtract header and footer height
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  position: 'relative'
}));

// Custom footer
const CustomFooter = styled('footer')(({ theme }) => ({
  background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
  color: 'white',
  padding: '40px 0 20px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  }
}));

const FooterContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '40px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '30px'
  }
}));

const FooterSection = styled(Box)(({ theme }) => ({
  '& h3': {
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#e2e8f0'
  },
  '& p': {
    color: '#cbd5e1',
    lineHeight: 1.6,
    marginBottom: '15px'
  },
  '& a': {
    color: '#cbd5e1',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#667eea'
    }
  }
}));

const FooterBottom = styled(Box)(({ theme }) => ({
  borderTop: '1px solid rgba(255,255,255,0.1)',
  marginTop: '30px',
  paddingTop: '20px',
  textAlign: 'center',
  color: '#a0aec0',
  position: 'relative',
  zIndex: 2
}));

const CollectionLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Sản phẩm mới', path: '/new-products' },
    { label: 'Blog', path: '/blog' },
    { label: 'Liên hệ', path: '/contact' }
  ];

  const drawer = (
    <Box>
      <DrawerHeader>
        <Logo variant="h6">Fashion Store</Logo>
        <IconButton
          color="inherit"
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <List>
        {navigationItems.map((item) => (
          <DrawerNavLink
            key={item.label}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={item.label} />
          </DrawerNavLink>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Custom Header */}
      <CustomHeader>
        <HeaderToolbar>
          {/* Logo */}
          <Logo component={RouterLink} to="/" variant="h6">
            Fashion Store
          </Logo>

          {/* Desktop Navigation */}
          <NavigationMenu>
            {navigationItems.map((item) => (
              <NavLink
                key={item.label}
                component={RouterLink}
                to={item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </NavigationMenu>

          {/* Header Actions */}
          <HeaderActions>
            <ActionButton size="small">
              <SearchIcon />
            </ActionButton>
            <ActionButton size="small">
              <FavoriteIcon />
            </ActionButton>
            <ActionButton size="small">
              <ShoppingBagIcon />
            </ActionButton>
            <ActionButton size="small">
              <PersonIcon />
            </ActionButton>
            
            {/* Mobile Menu Button */}
            {isMobile && (
              <ActionButton
                size="small"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </ActionButton>
            )}
          </HeaderActions>
        </HeaderToolbar>
      </CustomHeader>

      {/* Mobile Drawer */}
      <MobileDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
      >
        {drawer}
      </MobileDrawer>

      {/* Main Content */}
      <MainContent>
        <Outlet />
      </MainContent>

      {/* Custom Footer */}
      <CustomFooter>
        <FooterContent maxWidth="lg">
          <FooterSection>
            <Typography variant="h6" component="h3">
              Về chúng tôi
            </Typography>
            <Typography variant="body2">
              Fashion Store - Nơi bạn tìm thấy phong cách của riêng mình. 
              Chúng tôi cung cấp những sản phẩm thời trang chất lượng cao 
              với thiết kế độc đáo và giá cả hợp lý.
            </Typography>
          </FooterSection>

          <FooterSection>
            <Typography variant="h6" component="h3">
              Dịch vụ
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/collections">Collections</RouterLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/new-products">Sản phẩm mới</RouterLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/blog">Blog thời trang</RouterLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/contact">Liên hệ</RouterLink>
              </Box>
            </Box>
          </FooterSection>

          <FooterSection>
            <Typography variant="h6" component="h3">
              Hỗ trợ
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/shipping">Chính sách vận chuyển</RouterLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/returns">Chính sách đổi trả</RouterLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/size-guide">Hướng dẫn chọn size</RouterLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <RouterLink to="/faq">Câu hỏi thường gặp</RouterLink>
              </Box>
            </Box>
          </FooterSection>

          <FooterSection>
            <Typography variant="h6" component="h3">
              Liên hệ
            </Typography>
            <Typography variant="body2">
              📧 info@fashionstore.com
            </Typography>
            <Typography variant="body2">
              📞 1900-1234
            </Typography>
            <Typography variant="body2">
              🏢 123 Đường ABC, Quận 1, TP.HCM
            </Typography>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <Typography variant="body2">
            © 2024 Fashion Store. Tất cả quyền được bảo lưu.
          </Typography>
        </FooterBottom>
      </CustomFooter>
    </Box>
  );
};

export default CollectionLayout;

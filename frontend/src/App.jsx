import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './assets/scrollbar.css'
import { selectCurrentUser } from '~/redux/user/userSlice'

// Trang người dùng

import UserHome from '~/pages/user/Home/UserHome'
import AccountVerification from '~/pages/user/Auth/AccountVerification'
import UserLayout from '~/layout/UserLayout'
import Login from '~/pages/user/Auth/Login'
import Register from '~/pages/user/Auth/Register'
import Product from '~/pages/user/Product/Product'
import ProductDetail from '~/pages/user/ProductDetail/Index'
import Payment from '~/pages/user/Payment/Payment'
import Cart from '~/pages/user/Cart/Cart'
import Profile from '~/pages/user/Profile/Profile'
import Order from '~/pages/user/Orders/OrderListPage'
import PaymentVnpay from '~/pages/user/PaymentVnpay/PaymentVnpay'
import OrderSuccess from './pages/user/OrderSuccess/OrderSuccess'
import OrderFailed from './pages/user/OrderFailed/OrderFailed'
import SearchResult from '~/pages/user/SearchResult/SearchResult'
import Blog from '~/pages/user/Blog/Blog'
import ProductbyCategory from '~/pages/user/ProductbyCategory/ProductbyCategory'
import NewProducts from '~/pages/user/NewProducts/NewProducts'
import Policy from '~/pages/user/Policy/Policy'
import CategoryPage from './pages/user/CategoryPage/CategoryPage'
// Trang HeaderAdmin
import AdminLayout from '~/layout/AdminLayout'
import AdminHome from '~/pages/admin/Home/index'
import UserManagement from '~/pages/admin/UserManagement/index'
import AccountManagement from '~/pages/admin/AccountManagement/index.jsx'
import ProductManagement from '~/pages/admin/ProductManagement/index.jsx'
import CategorieManagement from '~/pages/admin/CategorieManagement/index.jsx'
import OrderManagement from '~/pages/admin/OrderManagement/index'
import DiscountManagement from '~/pages/admin/DiscountManagement/index.jsx'
import TransactionManegement from '~/pages/admin/TransactionManegement/index.jsx'
import ColorManagement from '~/pages/admin/ColorManagement/index.jsx'
import NotificationManagement from '~/pages/admin/NotificationManagement/index.jsx'
import ReviewManagement from '~/pages/admin/ReviewManagement/index.jsx'
import ColorPaletteManagement from '~/pages/admin/ColorPaletteManagement/index.jsx'
import SizePaletteManagement from '~/pages/admin/SizePaletteManagement/index.jsx'
// kho
import WarehouseStatisticTab from '~/pages/admin/InventoryManagement/tab/WarehouseStatisticTab.jsx'
import PartnerTab from '~/pages/admin/InventoryManagement/tab/PartnersTab.jsx'
import VariantManagement from '~/pages/admin/InventoryManagement/tab/VariantTab.jsx'
import InventoryTab from '~/pages/admin/InventoryManagement/tab/InventoryTab.jsx'
import WarehouseSlipsTab from '~/pages/admin/InventoryManagement/tab/WarehouseSlipsTab.jsx'
import SizeManagement from '~/pages/admin/SizeManagement/index.jsx'
import InventoryLogTab from '~/pages/admin/InventoryManagement/tab/InventoryLogTab.jsx'
import WarehousesTab from '~/pages/admin/InventoryManagement/tab/WarehousesTab.jsx'
import BatchesTab from '~/pages/admin/InventoryManagement/tab/BatchesTab.jsx'
import BlogManagement from '~/pages/admin/BlogManagement/index.jsx'
import RoleManagement from '~/pages/admin/RoleManagement/index.jsx'
import PermissionManagement from '~/pages/admin/PermissionManagemenet/index.jsx'
import ProductDashboard from '~/pages/admin/ProductStatistics/index.jsx'
import OrderDashboard from '~/pages/admin/OrderStatistic/index.jsx'
// Quản lý nội dung
import DisplayManagement from '~/pages/admin/MarketingManagement/DisplayManagement/DisplayManagement.jsx'
import FlashSaleManagement from '~/pages/admin/MarketingManagement/FlashSaleManagement/FlashSaleManagement.jsx'
import HeaderManagement from '~/pages/admin/MarketingManagement/HeaderManagement/HeaderManagement.jsx'
import FeaturedCategoryManagement from '~/pages/admin/MarketingManagement/FeaturedCategoryManagement/FeaturedCategoryManagement.jsx'
import ServiceHighlightManagement from '~/pages/admin/MarketingManagement/ServiceHighlightManagement/ServiceHighlightManagement.jsx'
import FooterManagement from './pages/admin/MarketingManagement/FooterManagement/FooterManagement'
import ThemeManagement from './pages/admin/MarketingManagement/ThemeManagement/ThemeManagement'
// Trang 404
import NotFound from '~/pages/404/NotFound'
// Hook
import { useAutoClearTempCart } from '~/hooks/useAutoClearTempCart'
import OrderDetail from '~/pages/user/Orders/OrderDetail'
import { BlogDetail } from '~/pages/user/Blog'

// Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới được truy cập
const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }

  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  useAutoClearTempCart()
  return (
    <Routes>
      {/*Authentication*/}
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/*Customer*/}
      <Route path='/' element={<UserLayout />}>
        <Route path='product' element={<Product />} />
        <Route path='/productdetail/:productId' element={<ProductDetail />} />
        <Route path='blog' element={<Blog />} />
        <Route path='/blog/:blogId' element={<BlogDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />

        <Route
          path='productbycategory/:categoryId'
          element={<ProductbyCategory />}
        />
        <Route path='productnews' element={<NewProducts />} />
        <Route path='policy' element={<Policy />} />
        {/*Protected Routes (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho phép truy cập sau khi đã login)*/}
        <Route element={<ProtectedRoute user={currentUser} />}>
          {/*<Outlet/> của react-router-dom sẽ chạy vào các child route trong này*/}
          <Route path='payment' element={<Payment />} />
          <Route path='/order-success' element={<OrderSuccess />} />

          {/*=====Huynh Anh=====*/}
          <Route path='/payment-result' element={<PaymentVnpay />} />
          <Route path='/payment-failed' element={<OrderFailed />} />

          {/*=======End=========*/}

          <Route path='cart' element={<Cart />} />
          <Route path='profile' element={<Profile />} />
          <Route path='orders' element={<Order />} />
          <Route path='order-detail/:orderId' element={<OrderDetail />} />
          <Route path='searchresult' element={<SearchResult />} />
        </Route>
        <Route index element={<UserHome />} />
      </Route>

      {/*Admin*/}

      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path='user-management' element={<UserManagement />} />
          <Route path='account-management' element={<AccountManagement />} />
          <Route path='product-statistic' element={<ProductDashboard />} />
          <Route path='product-management' element={<ProductManagement />} />
          <Route
            path='categorie-management'
            element={<CategorieManagement />}
          />
          <Route path='order-management' element={<OrderManagement />} />
          <Route path='order-statistic' element={<OrderDashboard />} />
          <Route path='discount-management' element={<DiscountManagement />} />
          <Route
            path='transaction-management'
            element={<TransactionManegement />}
          />
          <Route path='color-management' element={<ColorManagement />} />
          <Route path='review-management' element={<ReviewManagement />} />
          <Route
            path='warehouse-statistic-management'
            element={<WarehouseStatisticTab />}
          />
          <Route
            path='notification-management'
            element={<NotificationManagement />}
          />
          <Route path='size-management' element={<SizeManagement />} />
          <Route path='partner-management' element={<PartnerTab />} />
          <Route path='variant-management' element={<VariantManagement />} />
          <Route path='inventory-management' element={<InventoryTab />} />
          <Route
            path='warehouse-slips-management'
            element={<WarehouseSlipsTab />}
          />
          <Route
            path='inventory-log-management'
            element={<InventoryLogTab />}
          />
          <Route path='warehouses-management' element={<WarehousesTab />} />
          <Route path='batches-management' element={<BatchesTab />} />
          <Route
            path='color-palette-management'
            element={<ColorPaletteManagement />}
          />
          <Route
            path='size-palette-management'
            element={<SizePaletteManagement />}
          />
          <Route path='display-management' element={<DisplayManagement />} />
          <Route
            path='flashsale-management'
            element={<FlashSaleManagement />}
          />
          <Route path='header-management' element={<HeaderManagement />} />
          <Route
            path='featured-category-management'
            element={<FeaturedCategoryManagement />}
          />
          <Route path='theme-management' element={<ThemeManagement />} />
          <Route
            path='service-highlight-management'
            element={<ServiceHighlightManagement />}
          />
          <Route path='footer-management' element={<FooterManagement />} />
          <Route path='blog-management' element={<BlogManagement />} />
          <Route path='role-management' element={<RoleManagement />} />
          <Route
            path='permission-management'
            element={<PermissionManagement />}
          />
        </Route>
      </Route>

      {/*Not found 404*/}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

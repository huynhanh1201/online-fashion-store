import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '~/redux/user/userSlice'

// Trang người dùng

import UserHome from '~/pages/user/Home/UserHome'
import AccountVerification from '~/pages/user/Auth/AccountVerification'
import UserLayout from '~/layout/UserLayout'
import Login from '~/pages/user/Auth/Login'
import Register from '~/pages/user/Auth/Register'
import Product from '~/pages/user/Product/Product'
import ProductDetail from '~/pages/user/ProductDetail/ProductDetail'
import Payment from '~/pages/user/Payment/Payment'
import Cart from '~/pages/user/Cart/Cart'
import Profile from '~/pages/user/Profile/Profile'
import Order from '~/pages/user/Orders/OrderListPage'
import PaymentVnpay from '~/pages/user/PaymentVnpay/PaymentVnpay'
import OrderSuccess from './pages/OrderSuccess/OrderSuccess'
import SearchResult from '~/pages/user/SearchResult/SearchResult'
// Trang HeaderAdmin
import AdminLayout from '~/layout/AdminLayout'
import AdminHome from '~/pages/admin/Home/index'
import UserManagement from '~/pages/admin/UserManagement/index'
import ProductManagement from '~/pages/admin/ProductManagement/index.jsx'
import CategorieManagement from '~/pages/admin/CategorieManagement/index.jsx'
import OrderManagement from '~/pages/admin/OrderManagement/index'
import DiscountManagement from '~/pages/admin/DiscountManagement/index.jsx'
import TransactionManegement from '~/pages/admin/TransactionManegement/index.jsx'
import ColorManagement from '~/pages/admin/ColorManagement/index.jsx'
import InventoryManagement from '~/pages/admin/InventoryManagement/index.jsx'
// import InventoryLogManagement from '~/pages/admin/InventoryLogManagement/index.jsx'
import SizeManagement from '~/pages/admin/SizeManagement/index.jsx'
import InventoryLogManagement from '~/pages/admin/InventoryLogManagement/index.jsx'
// Trang 404
import NotFound from '~/pages/404/NotFound'

// Hook
import { useAutoClearTempCart } from './hooks/useAutoClearTempCart'
import OrderDetail from './pages/user/Orders/OrderDetail'

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
        {/*Protected Routes (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho phép truy cập sau khi đã login)*/}
        <Route element={<ProtectedRoute user={currentUser} />}>
          {/*<Outlet/> của react-router-dom sẽ chạy vào các child route trong này*/}
          <Route path='payment' element={<Payment />} />
          <Route path='/order-success' element={<OrderSuccess />} />

          {/*=====Huynh Anh=====*/}
          <Route path='/payment-result' element={<PaymentVnpay />} />
          <Route
            path='/payment-failed'
            element={<h2>THANH TOÁN THẤT BẠI!</h2>}
          />

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
          <Route path='product-management' element={<ProductManagement />} />
          <Route
            path='categorie-management'
            element={<CategorieManagement />}
          />
          <Route path='order-management' element={<OrderManagement />} />
          <Route path='discount-management' element={<DiscountManagement />} />
          <Route
            path='transaction-management'
            element={<TransactionManegement />}
          />
          <Route path='color-management' element={<ColorManagement />} />
          <Route
            path='inventory-management'
            element={<InventoryManagement />}
          />
          <Route
            path='inventory-log-management'
            element={<InventoryLogManagement />}
          />
          <Route path='size-management' element={<SizeManagement />} />
        </Route>
      </Route>

      {/*Not found 404*/}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

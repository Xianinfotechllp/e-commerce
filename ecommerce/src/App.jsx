
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './Admin/components/Dashboard'
import Login from './Admin/components/AdminLogin'
import Products from './Admin/components/Products'
import Users from './Admin/components/Users'
import LayOut from './Admin/components/LayOut'
import AdminCoupons from './Admin/components/AdminCoupons'
import CheckoutForm from './Admin/components/checkOutForm'
import VendorProductManager from './vendor/components/VendorProductManager'
import VendorLogin from './vendor/components/VendorLogin'
import VendorRegister from './vendor/components/VendorRegister'
import Home from './client/Home'
import VendorDashboard from './vendor/components/VendorDashboard'
import VendorLayout from './vendor/components/VendorLayout'
import VendorOrderManagement from './vendor/components/VendorOrderManagement'
import ProductPage from './client/ProductPage'
import CartPage from './client/CartPage'
import Register from './Auth/Register'
import AdminLogin from './Admin/components/AdminLogin'
import LoginForm from './Auth/LoginForm'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='admin-login' element={<AdminLogin />} />
          <Route path='login' element={<LoginForm/>} />
            <Route path='register' element={<Register />} />


          <Route path='admin' element={<LayOut />}>
          <Route index  element={<Dashboard />} />
          <Route index path='dashboard' element={<Dashboard />} />
            <Route path='admin-users' element={<Users />} />
            <Route path='admin-coupons' element={<AdminCoupons />} />
            {/* <Route path='/' element={<Dashboard />} /> */}
            <Route path='admin-products' element={<Products />} />
          </Route>

          {/* vendor */}
          <Route path='vendor' element={<VendorLayout />}>
            <Route index  element={<VendorDashboard />} />
            <Route index path='vendor-dashboard' element={<VendorDashboard />} />
            <Route path='vendor-product' element={<VendorProductManager />} />
            <Route path='vendor-order' element={<VendorOrderManagement />} />
          </Route>

          {/* user-client */}
         
                <Route path="/" element={<Home />} />
                <Route path='checkout' element={<CheckoutForm />} />
                <Route path='cart' element={<CartPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
          

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App




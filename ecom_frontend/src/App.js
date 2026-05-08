import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./componants/pages/Home";
import Admin from "./componants/dashboard/Admin";
import Vendor from "./componants/dashboard/Vendor";
import User from "./componants/dashboard/User";
import PrivateRoutes from "./componants/utils/PrivateRoutes";
import Login from "./componants/pages/Login";
import Signup from "./componants/pages/Signup";
import { AuthProvider } from "./componants/utils/Auth";
import ProductPage from "./componants/ProductDetails";
import Cart from "./componants/pages/Cart";
import Wishlist from "./componants/pages/Wishlist";
import Checkout from "./componants/pages/Checkout";
// import MultiRoleTestingGuide from "./componants/pages/MultiRoleTestingGuide";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<Home />} path="/" />
          <Route element={<ProductPage />} path="/product/:id" />
          {/* <Route element={<MultiRoleTestingGuide />} path="/testing-guide" /> */}

          {/* Private Routes */}
          <Route element={<PrivateRoutes allowedRoles={["Admin"]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<PrivateRoutes allowedRoles={["Vendor"]} />}>
            <Route path="/vendor" element={<Vendor />} />
          </Route>

          <Route element={<PrivateRoutes allowedRoles={["User"]} />}>
            <Route path="/user" element={<User />} />
            <Route element={<Cart />} path="/cart" />
            <Route element={<Wishlist />} path="/wishlist" />
            <Route element={<Checkout />} path="/checkout" />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

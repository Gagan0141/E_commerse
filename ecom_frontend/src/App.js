import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./componants/pages/Home";
import Admin from "./componants/dashboard/Admin";
import Vendor from "./componants/dashboard/Vendor";
import User from "./componants/dashboard/User";

import PrivateRoutes from "./componants/utils/PrivateRoutes";

import Login from "./componants/pages/Login";
import Signup from "./componants/pages/Signup";

import AuthProvider from "./componants/utils/Auth";

import ProductPage from "./componants/ProductDetails";

import Cart from "./componants/pages/Cart";
import Wishlist from "./componants/pages/Wishlist";
import Checkout from "./componants/user_tabs/Checkout";

// import MultiRoleTestingGuide from "./componants/pages/MultiRoleTestingGuide";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/product/:id" element={<ProductPage />} />

          {/* <Route
            path="/testing-guide"
            element={<MultiRoleTestingGuide />}
          /> */}

          {/* ADMIN ROUTES */}

          <Route
            element={<PrivateRoutes role="Admin" allowedRoles={["Admin"]} />}
          >
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* VENDOR ROUTES */}

          <Route
            element={<PrivateRoutes role="Vendor" allowedRoles={["Vendor"]} />}
          >
            <Route path="/vendor" element={<Vendor />} />
          </Route>

          {/* USER ROUTES */}

          <Route
            element={<PrivateRoutes role="User" allowedRoles={["User"]} />}
          >
            <Route path="/user" element={<User />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/wishlist" element={<Wishlist />} />

            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

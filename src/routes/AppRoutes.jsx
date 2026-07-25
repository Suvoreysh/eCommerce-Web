import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Otp from "../pages/Auth/Otp";
import LoginWithOtp from "../pages/Auth/login_with_otp";

import Home from "../pages/Store/Home";
import SingleProductpage from "../pages/Store/SingleProduct";
import ProductListing from "../pages/Product/ProductListing";
import ProductCategory from "../pages/Product/ProductCategory";
import SingleProduct from "../pages/Product/SingleProduct";

import CartList from "../pages/Cart/CartList";
import UserDetail from "../pages/Cart/UserDetail";
import Delivery from "../pages/Cart/Delivery";
import Payment from "../pages/Cart/Payment";
import OrderSuccess from "../pages/Cart/OrderSuccess";

import Profile from "../pages/Profile/Profile";
import MyOrders from "../pages/Profile/MyOrders";
import OrderDetails from "../pages/Profile/OrderDetails";

import Placeholder from "../pages/Placeholder";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-with-otp" element={<LoginWithOtp />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />

        {/* Store */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productdetails/:id" element={<SingleProductpage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/category" element={<ProductCategory />} />
        <Route path="/product/:id" element={<SingleProduct />} />

        {/* Cart / Checkout */}
        <Route path="/cart" element={<CartList />} />
        <Route path="/cart/details" element={<UserDetail />} />
        <Route path="/cart/delivery" element={<Delivery />} />
        <Route path="/cart/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />

        {/* Placeholders */}
        <Route path="/search" element={<Placeholder title="Search" />} />
        <Route path="/assistant" element={<Placeholder title="Assistant" />} />
        <Route path="/wishlist" element={<Placeholder title="Wishlist" />} />

        <Route
          path="/change-password"
          element={<Placeholder title="Change Password" />}
        />

        <Route
          path="/change-language"
          element={<Placeholder title="Change Language" />}
        />

        <Route path="/wallet" element={<Placeholder title="My Wallet" />} />

        <Route
          path="/profile/details"
          element={<Placeholder title="My Profile" />}
        />

        <Route
          path="/forgot-password"
          element={<Placeholder title="Forgot Password" />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

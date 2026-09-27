import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Otp from "../pages/Auth/Otp";
import LoginWithOtp from "../pages/Auth/login_with_otp";
import ForgotPassword from "../pages/Auth/ForgotPassword";

import Home from "../pages/Store/Home";
import SingleProductpage from "../pages/Store/SingleProduct";
import ProductListing from "../pages/Product/ProductListing";
import ProductCategory from "../pages/Product/ProductCategory";
import SingleProduct from "../pages/Product/SingleProduct";

import Wishlist from "../pages/Wishlist/Wishlist";
import CartList from "../pages/Cart/CartList";
import UserDetail from "../pages/Cart/UserDetail";
import Delivery from "../pages/Cart/Delivery";
import Payment from "../pages/Cart/Payment";
import OrderSuccess from "../pages/Cart/OrderSuccess";
import ResetPassword from "../pages/Auth/ResetPassword";
import Profile from "../pages/Profile/Profile";
import MyOrders from "../pages/Profile/MyOrders";
import OrderDetails from "../pages/Profile/OrderDetails";
import ChangePassword from "../pages/Profile/ChangePassword";
import AddressBook from "../pages/Profile/AddressBook";
import AddressForm from "../pages/Profile/AddressForm";

import Policy from "../pages/Policy/Policy";

import Placeholder from "../pages/Placeholder";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Auth */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-with-otp" element={<LoginWithOtp />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />

        {/* Store */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productdetails/:id" element={<SingleProductpage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/category" element={<ProductCategory />} />
        <Route path="/category/:categoryId" element={<ProductCategory />} />
        <Route path="/product/:id" element={<SingleProduct />} />

        {/* Cart / Checkout — requires login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartList />} />
          <Route path="/cart/details" element={<UserDetail />} />
          <Route path="/cart/delivery" element={<Delivery />} />
          <Route path="/cart/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Profile — requires login */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Address Book — requires login */}
          <Route path="/address" element={<AddressBook />} />
          <Route path="/address/add" element={<AddressForm />} />
          <Route path="/address/edit/:id" element={<AddressForm />} />

          <Route path="/wallet" element={<Placeholder title="My Wallet" />} />
          <Route
            path="/profile/details"
            element={<Placeholder title="My Profile" />}
          />
        </Route>

        {/* Placeholders */}
        <Route path="/search" element={<Placeholder title="Search" />} />
        <Route path="/assistant" element={<Placeholder title="Assistant" />} />

        {/* Policies (Terms & Conditions / Return Policy / Privacy Policy) */}
        <Route path="/policy" element={<Policy />} />
        <Route path="/policy/:tab" element={<Policy />} />

        <Route
          path="/change-language"
          element={<Placeholder title="Change Language" />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

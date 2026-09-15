import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";

const NAV_VISIBLE_PREFIXES = [
  "/home",
  "/search",
  "/profile",
  "/assistant",
  "/products",
  "/productdetails",
  "/category",
  "/product",
  "/policy",
];

export default function Layout() {
  const { pathname } = useLocation();
  const showNav =
    !pathname.startsWith("/cart") &&
    NAV_VISIBLE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  return (
    <div className="app-shell">
      <Outlet />
      {showNav && <BottomNav />}
    </div>
  );
}

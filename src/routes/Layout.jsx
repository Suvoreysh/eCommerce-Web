import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";
import SearchModal from "../components/search/SearchModal";

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
  "/address"
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

      <SearchModal />
    </div>
  );
}

import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";

const NAV_VISIBLE_PATHS = ["/home", "/search", "/profile", "/assistant", "/products", "/productdetails/:id", "/category" ];

export default function Layout() {
  const { pathname } = useLocation();
  const showNav = NAV_VISIBLE_PATHS.includes(pathname);

  return (
    <div className="app-shell">
      <Outlet />
      {showNav && <BottomNav />}
    </div>
  );
}

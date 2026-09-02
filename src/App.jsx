import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CartCountProvider } from "./context/CartCountContext";
import { WishlistProvider } from "./context/WishlistContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CartCountProvider>
            <WishlistProvider>
              <AppRoutes />
            </WishlistProvider>
          </CartCountProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

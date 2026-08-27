import { createContext, useContext, useState, useCallback } from "react";
import { cartApi } from "../api/cartApi";

const CartCountContext = createContext(null);

export function CartCountProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await cartApi.getCart();
      setCartCount(Number(response?.data?.total_items ?? 0));
    } catch (err) {
      console.error("Get cart count failed:", err);
    }
  }, []);

  return (
    <CartCountContext.Provider value={{ cartCount, setCartCount, refreshCartCount }}>
      {children}
    </CartCountContext.Provider>
  );
}

export function useCartCount() {
  const ctx = useContext(CartCountContext);
  if (!ctx) throw new Error("useCartCount must be used within CartCountProvider");
  return ctx;
}

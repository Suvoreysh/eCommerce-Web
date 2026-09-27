import { createContext, useContext, useState, useCallback, useRef } from "react";
import { cartApi } from "../api/cartApi";

const CartCountContext = createContext(null);

export function CartCountProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  // Cache: avoid redundant fetches within a short window
  const lastFetchRef = useRef(0);
  const DEBOUNCE_MS = 800;

  const refreshCartCount = useCallback(async (force = false) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setCartCount(0);
      return;
    }
    const now = Date.now();
    if (!force && now - lastFetchRef.current < DEBOUNCE_MS) return;
    lastFetchRef.current = now;

    try {
      const response = await cartApi.getCart();
      setCartCount(Number(response?.data?.total_items ?? 0));
    } catch (err) {
      console.error("Get cart count failed:", err);
    }
  }, []);

  const setCartCountDirect = useCallback((n) => {
    setCartCount(n);
  }, []);

  return (
    <CartCountContext.Provider value={{ cartCount, setCartCount: setCartCountDirect, refreshCartCount }}>
      {children}
    </CartCountContext.Provider>
  );
}

export function useCartCount() {
  const ctx = useContext(CartCountContext);
  if (!ctx) throw new Error("useCartCount must be used within CartCountProvider");
  return ctx;
}

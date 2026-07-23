import { createContext, useContext, useState, useMemo, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [coupon, setCoupon] = useState(null);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const subTotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const discount = coupon ? coupon.amount : 0;
  const total = Math.max(0, subTotal - discount);

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    address,
    setAddress,
    coupon,
    setCoupon,
    subTotal,
    discount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

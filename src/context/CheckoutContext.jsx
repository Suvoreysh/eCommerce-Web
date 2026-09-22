import { createContext, useContext, useMemo, useState } from "react";

const CheckoutContext = createContext(null);

/**
 * Thin in-memory relay between the three checkout steps (User Detail ->
 * Delivery -> Payment) so each page can read what an earlier step picked
 * without re-fetching. Nothing here is persisted — a full page reload starts
 * checkout over, same as re-visiting /cart/details.
 */
export function CheckoutProvider({ children }) {
  const [userDetails, setUserDetails] = useState(null);
  const [address, setAddress] = useState(null);
  const [paymentType, setPaymentType] = useState(null);

  const reset = () => {
    setUserDetails(null);
    setAddress(null);
    setPaymentType(null);
  };

  const value = useMemo(
    () => ({
      userDetails,
      setUserDetails,
      address,
      setAddress,
      paymentType,
      setPaymentType,
      reset,
    }),
    [userDetails, address, paymentType],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}

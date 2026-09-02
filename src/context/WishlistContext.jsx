import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { wishlistApi } from "../api/wishlistApi";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [idSet, setIdSet] = useState(() => new Set());
  const [loading, setLoading] = useState(false);

  const clear = useCallback(() => {
    setItems([]);
    setIdSet(new Set());
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      clear();
      return;
    }

    try {
      setLoading(true);
      const response = await wishlistApi.getWishlist();
      const list = Array.isArray(response?.data?.items)
        ? response.data.items
        : [];

      setItems(list);
      setIdSet(new Set(list.map((item) => Number(item.product_id))));
    } catch (err) {
      console.error("Get wishlist failed:", err);
    } finally {
      setLoading(false);
    }
  }, [user, clear]);

  // Refetch whenever auth state changes; wipe local state on logout so
  // stale hearts / wishlist page data never leak between accounts.
  useEffect(() => {
    if (user) {
      refresh();
    } else {
      clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isWishlisted = useCallback(
    (productId) => idSet.has(Number(productId)),
    [idSet],
  );

  const toggle = useCallback(
    async (productId) => {
      if (!user) {
        return { requiresLogin: true };
      }

      const id = Number(productId);
      const wasWishlisted = idSet.has(id);

      // Optimistic UI update
      setIdSet((prev) => {
        const next = new Set(prev);
        wasWishlisted ? next.delete(id) : next.add(id);
        return next;
      });

      try {
        const response = await wishlistApi.toggleWishlist(id);
        const inWishlist = response?.data?.in_wishlist ?? !wasWishlisted;

        setIdSet((prev) => {
          const next = new Set(prev);
          inWishlist ? next.add(id) : next.delete(id);
          return next;
        });

        if (!inWishlist) {
          setItems((prev) => prev.filter((item) => Number(item.product_id) !== id));
        } else {
          // We don't have full product details (image/price) from the
          // toggle response, so refresh the list in the background.
          refresh();
        }

        return { inWishlist };
      } catch (err) {
        // Revert optimistic update on failure
        setIdSet((prev) => {
          const next = new Set(prev);
          wasWishlisted ? next.add(id) : next.delete(id);
          return next;
        });
        console.error("Toggle wishlist failed:", err);
        throw err;
      }
    },
    [user, idSet, refresh],
  );

  const removeItem = useCallback(async (productId) => {
    const id = Number(productId);

    try {
      await wishlistApi.removeFromWishlist(id);
      setItems((prev) => prev.filter((item) => Number(item.product_id) !== id));
      setIdSet((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Remove wishlist item failed:", err);
      throw err;
    }
  }, []);

  const value = {
    items,
    loading,
    count: items.length,
    isWishlisted,
    toggle,
    removeItem,
    refresh,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

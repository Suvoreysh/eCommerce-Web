import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

/**
 * Holds only the open/closed state of the global search modal so any part of
 * the app (bottom nav, navbar, store search bars) can open the very same
 * <SearchModal /> — which is mounted once, in the Layout.
 */
export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openSearch, closeSearch }),
    [isOpen, openSearch, closeSearch],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

import "./SearchBar.css";
import { FiSearch } from "react-icons/fi";
import { useSearch } from "../../context/SearchContext";

// Looks like the store search field but opens the shared search modal, so
// every entry point (bottom nav, navbar, store pages) behaves identically.
export default function SearchBar({ placeholder = "Search products, categories…" }) {
  const { openSearch } = useSearch();

  return (
    <div className="search-bar-wrap">
      <button
        type="button"
        className="search-bar search-bar--trigger"
        aria-haspopup="dialog"
        onClick={openSearch}
      >
        <FiSearch aria-hidden="true" />
        <span>{placeholder}</span>
      </button>
    </div>
  );
}

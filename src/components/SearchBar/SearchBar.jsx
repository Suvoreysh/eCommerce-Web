import "./SearchBar.css";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ placeholder = "Search “Mac”" }) {
  return (
    <div className="search-bar-wrap">
      <div className="search-bar">
        <FiSearch />
        <input type="text" placeholder={placeholder} />
      </div>
    </div>
  );
}

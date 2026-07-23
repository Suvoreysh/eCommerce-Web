import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./BottomNav.css";
import Search from "./Search"; // adjust path to match your folder structure

// Home
import HomeIcon from "../../assets/icons/Navigation-bar-icon/Static/home.svg";
import HomeActiveIcon from "../../assets/icons/Navigation-bar-icon/Hover/home.svg";

// Search
import SearchIcon from "../../assets/icons/Navigation-bar-icon/Static/search.svg";
import SearchActiveIcon from "../../assets/icons/Navigation-bar-icon/Hover/search.svg";

// Profile
import ProfileIcon from "../../assets/icons/Navigation-bar-icon/Static/profile.svg";
import ProfileActiveIcon from "../../assets/icons/Navigation-bar-icon/Hover/profile.svg";

// Assistant
import AssistantIcon from "../../assets/icons/Navigation-bar-icon/Static/call.svg";
import AssistantActiveIcon from "../../assets/icons/Navigation-bar-icon/Hover/call.svg";

const items = [
  {
    to: "/home",
    label: "Home",
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
  },
  {
    to: "/search",
    label: "Search",
    icon: SearchIcon,
    activeIcon: SearchActiveIcon,
    isModal: true,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: ProfileIcon,
    activeIcon: ProfileActiveIcon,
  },
  {
    to: "/assistant",
    label: "Assistant",
    icon: AssistantIcon,
    activeIcon: AssistantActiveIcon,
  },
];

const ANIMATION_MS = 280;

export default function BottomNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);

  const closeTimeoutRef = useRef(null);

  const openSearch = () => {
    setSearchClosing(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setSearchOpen(false);
      setSearchClosing(false);
    }, ANIMATION_MS);
  };

  useEffect(() => {
    return () => clearTimeout(closeTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= 769) {
        clearTimeout(closeTimeoutRef.current);
        setSearchOpen(false);
        setSearchClosing(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [searchOpen]);

  return (
    <>
      <nav className="bottom-nav">
        {items.map((item) =>
          item.isModal ? (
            <button
              key={item.to}
              type="button"
              className={`bottom-nav__item ${
                searchOpen ? "bottom-nav__item--active" : ""
              }`}
              onClick={searchOpen ? closeSearch : openSearch}
            >
              <img
                src={searchOpen ? item.activeIcon : item.icon}
                alt={item.label}
                className="bottom-nav__icon"
              />
              <span className="bottom-nav__label">{item.label}</span>
            </button>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (searchOpen) closeSearch();
              }}
              className={({ isActive }) =>
                `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.label}
                    className="bottom-nav__icon"
                  />
                  <span className="bottom-nav__label">{item.label}</span>
                </>
              )}
            </NavLink>
          ),
        )}
      </nav>

      {searchOpen && (
        <div className="search-modal-backdrop" onClick={closeSearch}>
          <div
            className={`search-modal-panel ${
              searchClosing ? "search-modal-panel--closing" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Search onClose={closeSearch} />
          </div>
        </div>
      )}
    </>
  );
}

import { NavLink } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import "./BottomNav.css";

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

export default function BottomNav() {
  const { isOpen: searchOpen, openSearch, closeSearch } = useSearch();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) =>
        item.isModal ? (
          <button
            key={item.to}
            type="button"
            className={`bottom-nav__item ${
              searchOpen ? "bottom-nav__item--active" : ""
            }`}
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={searchOpen ? closeSearch : openSearch}
          >
            <img
              src={searchOpen ? item.activeIcon : item.icon}
              alt=""
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
                  alt=""
                  className="bottom-nav__icon"
                />
                <span className="bottom-nav__label">{item.label}</span>
              </>
            )}
          </NavLink>
        ),
      )}
    </nav>
  );
}

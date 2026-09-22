import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";

/**
 * Drop-in wishlist heart button. Handles the toggle call, optimistic
 * styling, and redirecting to login when the user isn't authenticated —
 * so every product card can share one implementation instead of each
 * keeping its own local wishlist state.
 */
export default function WishlistButton({
  productId,
  className = "",
  activeClassName = "",
  label,
  icon: Icon = FiHeart,
  activeIcon: ActiveIcon = FaHeart,
}) {
  const navigate = useNavigate();
  const { isWishlisted, toggle } = useWishlist();
  const [busy, setBusy] = useState(false);

  const active = isWishlisted(productId);

  const handleClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (busy) return;
    setBusy(true);

    try {
      const result = await toggle(productId);
      if (result?.requiresLogin) {
        const returnTo = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        navigate(`/login?returnTo=${returnTo}`);
      }
    } catch {
      // toggle() already logs/reverts on failure — nothing else to do here
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`${className} ${active ? activeClassName : ""}`.trim()}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      disabled={busy}
      onClick={handleClick}
    >
      {active ? <ActiveIcon /> : <Icon />}
      {label}
    </button>
  );
}

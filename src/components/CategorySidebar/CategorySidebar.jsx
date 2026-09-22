import LazyImage from "../common/LazyImage";
import "./CategorySidebar.css";

// items: [{ id, label, image?, icon? }]  — `icon` shows when there is no image.
export default function CategorySidebar({
  items = [],
  activeId,
  onSelect,
  loading,
}) {
  if (loading) {
    return (
      <aside className="category-sidebar" aria-hidden="true">
        {[0, 1, 2, 3].map((n) => (
          <div className="sidebar-item sidebar-item-skeleton" key={n} />
        ))}
      </aside>
    );
  }

  if (items.length === 0) return null;

  return (
    <aside className="category-sidebar" aria-label="Subcategories">
      {items.map((item) => {
        const isActive = String(activeId) === String(item.id);

        return (
          <button
            type="button"
            key={item.id}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onSelect(item.id)}
          >
            <LazyImage
              className="sidebar-item-img"
              src={item.image}
              alt=""
              fit="cover"
              fallback={
                item.icon ? (
                  <span className="sidebar-item-icon">{item.icon}</span>
                ) : null
              }
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

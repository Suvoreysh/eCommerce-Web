import LazyImage from "../common/LazyImage";
import "./CategorySidebar.css";

export default function CategorySidebar({
  items = [],
  activeId,
  onSelect,
  loading,
  categoryImage,
}) {
  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <aside className="category-sidebar" aria-hidden="true">
        {[0, 1, 2, 3].map((n) => (
          <div className="sidebar-item sidebar-item-skeleton" key={n} />
        ))}
      </aside>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (items.length === 0) return null;

  /* =========================================================
     SIDEBAR
  ========================================================= */

  return (
    <aside className="category-sidebar" aria-label="Subcategories">
      {items.map((item) => {
        const isActive = String(activeId) === String(item.id);

        /*
          IMAGE LOGIC

          All
          -> parent category image

          Subcategory
          -> own image

          Missing subcategory image
          -> parent category image
        */

        const isAll = String(item.id).toLowerCase() === "all";

        const displayImage = isAll
          ? categoryImage || item.image
          : item.image || categoryImage;

        return (
          <button
            type="button"
            key={item.id}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onSelect(item.id)}
          >
            {/* IMAGE */}
            <LazyImage
              className="sidebar-item-img"
              src={displayImage}
              alt={item.label || ""}
              fit="cover"
              fallback={
                item.icon ? (
                  <span className="sidebar-item-icon">{item.icon}</span>
                ) : (
                  <span className="sidebar-item-image-fallback" />
                )
              }
            />

            {/* NAME */}
            <span className="sidebar-item-label">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

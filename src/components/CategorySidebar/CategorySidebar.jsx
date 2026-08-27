import "./CategorySidebar.css";

export default function CategorySidebar({
  items = [],
  activeId,
  onSelect,
  loading,
}) {
  if (loading) {
    return (
      <aside className="category-sidebar">
        {[0, 1, 2, 3].map((n) => (
          <div className="sidebar-item sidebar-item-skeleton" key={n} />
        ))}
      </aside>
    );
  }

  if (items.length === 0) return null;

  return (
    <aside className="category-sidebar">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`sidebar-item ${activeId === item.id ? "active" : ""}`}
          onClick={() => onSelect(item.id)}
        >
          {item.image && <img src={item.image} alt={item.label} />}
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

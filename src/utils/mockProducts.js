// Placeholder data so pages render before the real API is connected.
// Swap productApi.getAll()/getById() responses in and remove this file
// once the backend endpoints in src/api/config.js are live.
export const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  name: "iPhone 17 Pro",
  price: 399,
  mrp: 499,
  image: "https://placehold.co/300x300/e8f0f2/0f3a48?text=iPhone",
  badge: i % 3 === 0 ? "sale" : null,
  color: "Cosmic Orange",
  rating: 4.5,
  description:
    "A powerful, fast and portable device built for everyday performance, with a stunning display and all-day battery.",
}));

export const mockCategories = [
  { id: "iphone17pro", name: "Iphone 17 pro" },
  { id: "iphone17", name: "Iphone 17" },
  { id: "iphone17promax", name: "Iphone 17 pro max" },
];

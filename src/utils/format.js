// Small presentation helpers shared by store, cart and checkout screens.

export function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatINR(value) {
  const number = toNumber(value);

  if (number === null) return "";

  return `₹${number.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

// "₹49" when both ends match, "₹49 – ₹119" for a variant price range.
export function formatPriceRange(min, max) {
  const low = toNumber(min);
  const high = toNumber(max);

  if (low === null && high === null) return "";
  if (low === null) return formatINR(high);
  if (high === null || low === high) return formatINR(low);

  return `${formatINR(Math.min(low, high))} – ${formatINR(Math.max(low, high))}`;
}

// Laravel validation errors arrive as { field: ["message"] } on error.errors.
export function firstErrorMessage(error, fallback = "Something went wrong.") {
  const errors = error?.errors;

  if (errors && typeof errors === "object") {
    for (const value of Object.values(errors)) {
      const message = Array.isArray(value) ? value[0] : value;
      if (typeof message === "string" && message) return message;
    }
  }

  return error?.message || fallback;
}

// "credit-card" -> "Credit Card", "cash-on-delivery" -> "Cash On Delivery",
// short acronyms such as "UPI" are left alone.
export function paymentLabel(name) {
  const text = String(name ?? "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!text) return "Payment";
  if (text.length <= 4 && text === text.toUpperCase()) return text;

  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Only same-origin, in-app paths may be used as a post-login/post-save
// redirect target (blocks "//evil.com" and "https://…").
export function safeInternalPath(path, fallback = "/home") {
  if (typeof path !== "string") return fallback;
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}

// Cart / order-line images come back as bare file names from the API; product
// and category images come back as absolute URLs. This resolves either form.
export const VARIANT_IMAGE_BASE =
  "https://spaknit.com/spaknit/public/uploads/images/variants/";

const ABSOLUTE_URL_RE = /^(?:https?:)?\/\/|^data:|^blob:/i;

export function resolveImageUrl(image, base = VARIANT_IMAGE_BASE) {
  if (!image || typeof image !== "string") return "";
  if (ABSOLUTE_URL_RE.test(image)) return image;
  return `${base}${image.replace(/^\/+/, "")}`;
}

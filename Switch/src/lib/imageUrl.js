const BUCKET_BASE = (import.meta.env.VITE_ASSETS_BASE || "").replace(/\/+$/, "");

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="#9ca3af">Sin imagen</text></svg>`
  );

export function toBucketUrl(rawPath) {
  if (!rawPath) return PLACEHOLDER;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  let key = String(rawPath)
    .replace(/^https?:\/\/[^/]+\/?/, "")
    .replace(/^\/+/, "")
    .replace(/^storage\//, "")
    .replace(/^public\//, "");

  if (/^ropa\//i.test(key)) key = key.replace(/^ropa\//i, "imagenes/ropa/");
  if (/^accesorios\//i.test(key)) key = key.replace(/^accesorios\//i, "imagenes/accesorios/");

  return BUCKET_BASE ? `${BUCKET_BASE}/${encodeURI(key)}` : PLACEHOLDER;
}

export const toImageUrl = toBucketUrl;
export const IMAGE_PLACEHOLDER = PLACEHOLDER;
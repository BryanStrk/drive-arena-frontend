/**
 * Utilities para abrir ubicaciones en aplicaciones de mapas externas.
 *
 * Estrategia:
 * - "Ver el lugar" → siempre Google Maps (universal, sin auth)
 * - "Direcciones" → Apple Maps si iOS, Google Maps en lo demás
 *   (mejor UX nativa en iPhones, abre la app en lugar del navegador)
 */

/**
 * Detecta si el usuario está en iOS (iPhone, iPad, iPod).
 * Incluye detección de iPadOS 13+ que se reporta como "MacIntel" pero
 * tiene capacidad táctil (`ontouchend`).
 *
 * @returns {boolean}
 */
function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Mac") &&
      typeof document !== "undefined" &&
      "ontouchend" in document)
  );
}

/**
 * Genera la URL para VER una ubicación en Google Maps.
 *
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @returns {string}
 */
export function getViewMapsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Genera la URL para obtener DIRECCIONES hacia una ubicación.
 * Apple Maps en iOS, Google Maps en el resto.
 *
 * @param {number} lat - Latitud destino
 * @param {number} lng - Longitud destino
 * @returns {string}
 */
export function getDirectionsUrl(lat, lng) {
  if (isIOS()) {
    return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Abre una URL en una pestaña nueva con flags de seguridad.
 * `noopener,noreferrer` previene tabnabbing (la página destino no puede
 * acceder a `window.opener` ni leer el referrer).
 *
 * @param {string} url - URL a abrir
 */
export function openMapsUrl(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

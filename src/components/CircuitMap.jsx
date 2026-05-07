import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * URL del estilo dark de CartoDB. Gratis, sin API key.
 * Más estilos: https://github.com/CartoDB/basemap-styles
 */
const CARTO_DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

/**
 * Mapa interactivo dark-themed para destacar la ubicación de un circuito.
 *
 * @param {number} lat - Latitud del punto a destacar
 * @param {number} lng - Longitud del punto a destacar
 * @param {number} zoom - Nivel de zoom inicial (default 13)
 * @param {boolean} showControls - Mostrar controles de zoom/rotación
 * @param {Function} [onMarkerClick] - Callback opcional al hacer click en el marker
 */
function CircuitMap({
  lat = 41.5705,
  lng = 2.2611,
  zoom = 13,
  showControls = false,
  onMarkerClick,
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Ref para acceder al callback más reciente desde el listener.
  // El listener se registra una sola vez en el setup; sin este ref
  // quedaría capturando una closure obsoleta de `onMarkerClick`.
  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  });

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: CARTO_DARK_STYLE,
      center: [lng, lat],
      zoom,
      attributionControl: false,
      cooperativeGestures: true,
    });

    if (showControls) {
      mapInstance.current.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );
    }

    // Marker custom: contenedor 48x48 (área de click cómoda) con el dot
    // visual de 16px centrado. El halo `animate-ping` añade el efecto pulsante.
    const markerEl = document.createElement("div");
    markerEl.className =
      "relative w-12 h-12 flex items-center justify-center";
    markerEl.innerHTML = `
      <div class="relative w-4 h-4">
        <span class="absolute inset-[-8px] rounded-full bg-primary/40 animate-ping"></span>
        <span class="relative block w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg shadow-primary/50"></span>
      </div>
    `;

    // Click handler opcional sobre el marker
    if (onMarkerClickRef.current) {
      markerEl.style.cursor = "pointer";
      markerEl.setAttribute("role", "button");
      markerEl.setAttribute("aria-label", "Cómo llegar al circuito");
      markerEl.addEventListener("click", () => {
        onMarkerClickRef.current?.();
      });
    }

    new maplibregl.Marker({ element: markerEl })
      .setLngLat([lng, lat])
      .addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [lat, lng, zoom, showControls]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-2xl overflow-hidden"
      aria-label="Mapa interactivo del circuito"
    />
  );
}

export default CircuitMap;

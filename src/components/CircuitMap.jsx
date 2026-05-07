import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * URL del estilo dark de CartoDB. Gratis, sin API key, con licencia
 * permisiva para proyectos académicos y comerciales pequeños.
 * Más estilos disponibles: https://github.com/CartoDB/basemap-styles
 */
const CARTO_DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

/**
 * Mapa interactivo dark-themed para destacar la ubicación de un circuito.
 *
 * Características:
 * - Tema oscuro alineado al brand de Drive Arena
 * - Marker custom con halo pulsante en color `primary`
 * - Cooperative gestures (ctrl+scroll) para no atrapar el scroll de la página
 * - Controles de navegación opcionales
 * - Sin atribución intrusiva (se respeta la licencia con un footer aparte)
 *
 * @param {number} lat - Latitud del punto a destacar
 * @param {number} lng - Longitud del punto a destacar
 * @param {number} zoom - Nivel de zoom inicial (default 13)
 * @param {boolean} showControls - Mostrar controles de zoom/rotación
 */
function CircuitMap({
  lat = 41.5705,
  lng = 2.2611,
  zoom = 13,
  showControls = false,
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

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

    // Marker custom con halo pulsante (estética Drive Arena)
    const markerEl = document.createElement("div");
    markerEl.className = "relative w-4 h-4";
    markerEl.innerHTML = `
      <span class="absolute inset-[-8px] rounded-full bg-primary/40 animate-ping"></span>
      <span class="relative block w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg shadow-primary/50"></span>
    `;

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

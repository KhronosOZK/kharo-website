import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet measures its container's size once at construction. If that
// measurement happens before the page has finished its layout pass (webfonts,
// image aspect-ratio boxes still settling, etc.), the map's internal
// pixel/meter projection is wrong and the Circle - drawn in real-world
// meters - can render at a wildly wrong pixel radius that bleeds outside the
// visible box. Forcing a re-measure once the container has its final size
// fixes it; same root cause as the SearchMap sizing bug.
function FixSize() {
  const map = useMap();
  useEffect(() => {
    const id = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(id);
  }, [map]);
  return null;
}

// A soft area circle, never a precise pin - the copy next to this map always
// says "approximate area, exact address shared once confirmed", so the map
// itself shouldn't visually overclaim precision either.
export default function ApproxAreaMap({ lat, lon, className = "" }) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      minZoom={9}
      maxZoom={16}
      scrollWheelZoom={false}
      dragging
      zoomControl
      attributionControl={false}
      className={`w-full h-full ${className}`}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <FixSize />
      <Circle
        center={[lat, lon]}
        radius={900}
        pathOptions={{ color: "#1E7F55", fillColor: "#7FD8B0", fillOpacity: 0.25, weight: 1.5 }}
      />
    </MapContainer>
  );
}

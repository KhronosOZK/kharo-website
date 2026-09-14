import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// A soft area circle, never a precise pin - the copy next to this map always
// says "approximate area, exact address shared once confirmed", so the map
// itself shouldn't visually overclaim precision either.
export default function ApproxAreaMap({ lat, lon, className = "" }) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      attributionControl={false}
      className={`w-full h-full ${className}`}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" />
      <Circle
        center={[lat, lon]}
        radius={900}
        pathOptions={{ color: "#0B6B4F", fillColor: "#0B6B4F", fillOpacity: 0.12, weight: 1.5 }}
      />
    </MapContainer>
  );
}

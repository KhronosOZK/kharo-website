import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { areaCoords } from "@/lib/geo";

// Custom price-pill marker instead of Leaflet's default pin - matches the
// site's pill-button language instead of looking like a generic map widget.
function priceIcon(price, active) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${active ? "#0B6B4F" : "#ffffff"};
      color:${active ? "#ffffff" : "#111111"};
      border:1.5px solid ${active ? "#0B6B4F" : "#E0E0E0"};
      border-radius:999px;
      padding:5px 10px;
      font:700 12px/1 'DM Sans', sans-serif;
      box-shadow:0 6px 16px -6px rgba(0,0,0,0.35);
      white-space:nowrap;
    ">£${price}</div>`,
    iconSize: null,
    iconAnchor: [24, 14],
  });
}

// A map that starts life in a display:none container (our toggled panel) has
// zero size, so fitBounds's zoom math goes wrong unless we tell Leaflet to
// re-measure *first* and only fit bounds once that's actually taken effect -
// running both in the same tick races, hence the explicit two-step.
function FitToMarkers({ points, visibilityTrigger }) {
  const map = useMap();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      map.invalidateSize();
      if (points.length === 0) return;
      const bounds = L.latLngBounds(points).pad(0.3);
      map.fitBounds(bounds, { maxZoom: 12, animate: false });
    });
    return () => cancelAnimationFrame(id);
  }, [points, visibilityTrigger, map]);
  return null;
}

export default function SearchMap({ results, activeBorough, onAreaClick, visibilityTrigger }) {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  // Group listings by area so nearby cars share one pin (like Airbnb's price pins),
  // rather than trying to plot 120 exact-but-fake coordinates on top of each other.
  const groups = useMemo(() => {
    const byArea = new Map();
    for (const v of results) {
      const key = `${v.city}|${v.borough}`;
      if (!byArea.has(key)) {
        byArea.set(key, { city: v.city, borough: v.borough, coords: areaCoords(v.borough, v.city), vehicles: [] });
      }
      byArea.get(key).vehicles.push(v);
    }
    return [...byArea.values()].map((g) => ({
      ...g,
      minPrice: Math.min(...g.vehicles.map((v) => v.weekly_rent)),
    }));
  }, [results]);

  const points = useMemo(() => groups.map((g) => g.coords), [groups]);

  return (
    <MapContainer
      center={[52.9, -1.5]}
      zoom={6}
      scrollWheelZoom
      className="w-full h-full rounded-2xl"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.esri.com">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        maxNativeZoom={16}
      />
      <FitToMarkers points={points} visibilityTrigger={visibilityTrigger} />
      {groups.map((g) => (
        <Marker
          key={`${g.city}|${g.borough}`}
          position={g.coords}
          icon={priceIcon(g.minPrice, activeBorough === g.borough)}
          eventHandlers={{
            click: () => {
              if (g.vehicles.length === 1) {
                navigate(`/vehicle/${g.vehicles[0].id}`);
              } else {
                onAreaClick(activeBorough === g.borough ? null : g.borough);
              }
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
